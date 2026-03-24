import Groq from "groq-sdk";
import { Product } from "../Products/product.model";
import { Chatbot } from "./chatbot.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import groqClient, { GROQ_MODEL, SYSTEM_PROMPT } from "../../config/grok";

// ─── Tool Definitions (what AI can call) ─────────────────────────────────────

const tools = [
    {
        type: "function",
        function: {
            name: "searchBikes",
            description: "Search bikes by brand, model or category from the database",
            parameters: {
                type: "object",
                properties: {
                    brand: {
                        type: "string",
                        description: "Bike brand name e.g. Yamaha, Honda, Suzuki",
                    },
                    category: {
                        type: "string",
                        description: "Bike category e.g. sport, commuter, off-road",
                    },
                    maxPrice: {
                        type: "number",
                        description: "Maximum price filter",
                    },
                    minPrice: {
                        type: "number",
                        description: "Minimum price filter",
                    },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "getBikeDetails",
            description: "Get full details of a specific bike by its name",
            parameters: {
                type: "object",
                properties: {
                    bikeName: {
                        type: "string",
                        description: "The name of the bike",
                    },
                },
                required: ["bikeName"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "checkAvailability",
            description: "Check if a specific bike is in stock",
            parameters: {
                type: "object",
                properties: {
                    bikeName: {
                        type: "string",
                        description: "The name of the bike to check",
                    },
                },
                required: ["bikeName"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "getCheapestBike",
            description: "Get the cheapest bike overall or by brand/category",
            parameters: {
                type: "object",
                properties: {
                    brand: {
                        type: "string",
                        description: "Optional brand filter",
                    },
                    category: {
                        type: "string",
                        description: "Optional category filter",
                    },
                },
            },
        },
    },
];

// ─── Database Functions (actual queries) ─────────────────────────────────────

const runFunction = async (name: string, args: Record<string, any>) => {
    switch (name) {
        case "searchBikes": {
            const query: Record<string, any> = {};
            if (args.brand) query.brand = new RegExp(args.brand, "i");
            if (args.category) query.category = new RegExp(args.category, "i");
            if (args.maxPrice || args.minPrice) {
                query.price = {};
                if (args.maxPrice) query.price.$lte = args.maxPrice;
                if (args.minPrice) query.price.$gte = args.minPrice;
            }
            const bikes = await Product.find(query)
                .select("name brand price cc category inStock stocks")
                .limit(5);
            if (bikes.length === 0) return { message: "No bikes found matching your criteria" };
            return { bikes };
        }

        case "getBikeDetails": {
            const bike = await Product.findOne({
                name: new RegExp(args.bikeName, "i"),
            });
            if (!bike) return { message: `No bike found with name ${args.bikeName}` };
            return { bike };
        }

        case "checkAvailability": {
            const bike = await Product.findOne({
                name: new RegExp(args.bikeName, "i"),
            }).select("name inStock stocks");
            if (!bike) return { message: `No bike found with name ${args.bikeName}` };
            return {
                name: bike.name,
                inStock: bike.inStock,
                stocks: bike.stocks,
            };
        }

        case "getCheapestBike": {
            const query: Record<string, any> = { inStock: true };
            if (args.brand) query.brand = new RegExp(args.brand, "i");
            if (args.category) query.category = new RegExp(args.category, "i");
            const bike = await Product.findOne(query)
                .sort({ price: 1 })
                .select("name brand price cc category stocks");
            if (!bike) return { message: "No bikes found" };
            return { bike };
        }

        default:
            return { message: "Function not found" };
    }
};

// ─── Main Chat Service ────────────────────────────────────────────────────────

const chat = async (userId: string, userMessage: string) => {

    // 1 — Find or create chatbot history for this user
    let chatbot = await Chatbot.findOne({ userId });
    if (!chatbot) {
        chatbot = new Chatbot({ userId, messages: [] });
    }

    // 2 — Build messages array for Groq (system + history + new message)
    const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...chatbot.messages.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content as string,
        })),
        { role: "user", content: userMessage },
    ];

    // 3 — Send to Groq with tools
    let response = await groqClient.chat.completions.create({
        model: GROQ_MODEL,
        messages,
        tools,
        tool_choice: "auto",
    });

    let responseMessage = response.choices[0].message;

    // 4 — Handle tool/function calling loop
    while (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {

        // Add assistant message with tool calls to messages
        messages.push(responseMessage);

        // Run each tool call
        for (const toolCall of responseMessage.tool_calls) {
            const functionName = toolCall.function.name;
            const functionArgs = JSON.parse(toolCall.function.arguments);

            // Run the actual database query
            const functionResult = await runFunction(functionName, functionArgs);

            // Add tool result to messages
            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(functionResult),
            });
        }

        // Send updated messages back to Groq
        response = await groqClient.chat.completions.create({
            model: GROQ_MODEL,
            messages,
            tools,
            tool_choice: "auto",
        });

        responseMessage = response.choices[0].message;
    }

    // 5 — Extract final text reply
    const assistantReply = responseMessage.content;

    if (!assistantReply || assistantReply.trim() === "") {
        throw new AppError(
            httpStatus.BAD_GATEWAY,
            "AI did not return a valid response, please try again"
        );
    }

    // 6 — Save both messages to database
    chatbot.messages.push({ role: "user", content: userMessage });
    chatbot.messages.push({ role: "assistant", content: assistantReply });
    await chatbot.save();

    return assistantReply;
};

// ─── Get Chat History ─────────────────────────────────────────────────────────

const getChatHistory = async (userId: string) => {
    const chatbot = await Chatbot.findOne({ userId });
    if (!chatbot) return [];
    return chatbot.messages;
};

// ─── Clear Chat History ───────────────────────────────────────────────────────

const clearChatHistory = async (userId: string) => {
    await Chatbot.findOneAndUpdate(
        { userId },
        { messages: [] }
    );
};

export const chatbotService = {
    chat,
    getChatHistory,
    clearChatHistory,
};