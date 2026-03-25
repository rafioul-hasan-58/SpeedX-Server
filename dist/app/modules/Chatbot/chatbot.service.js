"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotService = void 0;
const product_model_1 = require("../Products/product.model");
const chatbot_model_1 = require("./chatbot.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const grok_1 = __importStar(require("../../config/grok"));
// ─── Tool Definitions (what AI can call) ─────────────────────────────────────
const tools = [
    {
        type: "function",
        function: {
            name: "searchBikes",
            description: "Search bikes by brand name or bike type from the database",
            parameters: {
                type: "object",
                properties: {
                    brandName: {
                        type: "string",
                        description: "Bike brand name e.g. Yamaha, Honda, Suzuki, TVS",
                    },
                    bikeType: {
                        type: ["string", "null"],
                        enum: ["bike", "scooter", null, ""],
                        description: "Bike type - only two options: 'bike' or 'scooter'",
                    },
                    maxPrice: {
                        type: ["number", "null"],
                        description: "Maximum price filter in BDT taka",
                    },
                    minPrice: {
                        type: ["number", "null"],
                        description: "Minimum price filter in BDT taka",
                    },
                },
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "getBikeDetails",
            description: "Get full details of a specific bike by its name including price, color, stock and description",
            parameters: {
                type: "object",
                properties: {
                    bikeName: {
                        type: "string",
                        description: "The exact or partial name of the bike e.g. 'Honda CB 150R'",
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
            description: "Check if a specific bike is available and how many are in stock",
            parameters: {
                type: "object",
                properties: {
                    bikeName: {
                        type: "string",
                        description: "The exact or partial name of the bike to check availability",
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
            description: "Get the cheapest or lowest price bike overall or filtered by brand or bike type",
            parameters: {
                type: "object",
                properties: {
                    brand: {
                        type: "string",
                        description: "Optional brand filter e.g. Yamaha, Honda, Suzuki",
                    },
                    category: {
                        type: "string",
                        description: "Optional bike type filter - only two options: 'bike' or 'scooter'",
                    },
                },
                required: [],
            },
        },
    },
];
// ─── Database Functions (actual queries) ─────────────────────────────────────
const runFunction = (name, args) => __awaiter(void 0, void 0, void 0, function* () {
    switch (name) {
        case "searchBikes": {
            const query = {};
            if (args.brand)
                query.brandName = new RegExp(args.brand, "i");
            if (args.category)
                query.bikeType = new RegExp(args.category, "i");
            if (args.maxPrice || args.minPrice) {
                query.price = {};
                if (args.maxPrice)
                    query.price.$lte = args.maxPrice;
                if (args.minPrice)
                    query.price.$gte = args.minPrice;
            }
            console.log("query", query);
            const bikes = yield product_model_1.Product.find(query)
                .select("name brandName price bikeType type stocks inStock color")
                .limit(5);
            if (bikes.length === 0)
                return { message: "No bikes found matching your criteria" };
            return { bikes };
        }
        case "getBikeDetails": {
            const bike = yield product_model_1.Product.findOne({
                name: new RegExp(args.bikeName, "i"),
            }).select("name brandName price bikeType type stocks inStock color description");
            if (!bike)
                return { message: `No bike found with name ${args.bikeName}` };
            return { bike };
        }
        case "checkAvailability": {
            const bike = yield product_model_1.Product.findOne({
                name: new RegExp(args.bikeName, "i"),
            }).select("name inStock stocks");
            if (!bike)
                return { message: `No bike found with name ${args.bikeName}` };
            return {
                name: bike.name,
                inStock: bike.inStock,
                stocks: bike.stocks,
            };
        }
        case "getCheapestBike": {
            const query = { inStock: true };
            if (args.brand)
                query.brandName = new RegExp(args.brand, "i");
            if (args.category)
                query.bikeType = new RegExp(args.category, "i");
            const bike = yield product_model_1.Product.findOne(query)
                .sort({ price: 1 })
                .select("name brandName price bikeType type stocks color");
            if (!bike)
                return { message: "No bikes found" };
            return { bike };
        }
        default:
            return { message: "Function not found" };
    }
});
// ─── Main Chat Service ────────────────────────────────────────────────────────
const chat = (userId, userMessage) => __awaiter(void 0, void 0, void 0, function* () {
    // 1 — Find or create chatbot history for this user
    let chatbot = yield chatbot_model_1.Chatbot.findOne({ userId });
    if (!chatbot) {
        chatbot = new chatbot_model_1.Chatbot({ userId, messages: [] });
    }
    // 2 — Build messages array for Groq (system + history + new message)
    const messages = [
        { role: "system", content: grok_1.SYSTEM_PROMPT },
        ...chatbot.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
        })),
        { role: "user", content: userMessage },
    ];
    // 3 — Send to Groq with tools
    let response = yield grok_1.default.chat.completions.create({
        model: grok_1.GROQ_MODEL,
        messages,
        tools,
        tool_choice: "auto",
        max_tokens: 1024,
        parallel_tool_calls: false,
    });
    let responseMessage = response.choices[0].message;
    // 4 — Handle tool/function calling loop
    while (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        // Add assistant message with tool calls to messages
        messages.push(responseMessage);
        // Run each tool call
        for (const toolCall of responseMessage.tool_calls) {
            const functionName = toolCall.function.name;
            const rawArgs = JSON.parse(toolCall.function.arguments);
            const functionArgs = Object.fromEntries(Object.entries(rawArgs).filter(([_, v]) => v !== null &&
                v !== undefined &&
                v !== ""));
            // Run the actual database query
            const functionResult = yield runFunction(functionName, functionArgs);
            // Add tool result to messages
            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(functionResult),
            });
        }
        // Send updated messages back to Groq
        response = yield grok_1.default.chat.completions.create({
            model: grok_1.GROQ_MODEL,
            messages,
            tools,
            tool_choice: "auto",
        });
        responseMessage = response.choices[0].message;
    }
    // 5 — Extract final text reply
    const assistantReply = responseMessage.content;
    if (!assistantReply || assistantReply.trim() === "") {
        throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, "AI did not return a valid response, please try again");
    }
    // 6 — Save both messages to database
    chatbot.messages.push({ role: "user", content: userMessage });
    chatbot.messages.push({ role: "assistant", content: assistantReply });
    yield chatbot.save();
    return assistantReply;
});
// ─── Get Chat History ─────────────────────────────────────────────────────────
const getChatHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatbot = yield chatbot_model_1.Chatbot.findOne({ userId });
    if (!chatbot)
        return [];
    return chatbot.messages;
});
// ─── Clear Chat History ───────────────────────────────────────────────────────
const clearChatHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield chatbot_model_1.Chatbot.findOneAndUpdate({ userId }, { messages: [] });
});
exports.chatbotService = {
    chat,
    getChatHistory,
    clearChatHistory,
};
