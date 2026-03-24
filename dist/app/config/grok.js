"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_PROMPT = exports.GROQ_MODEL = exports.groqClient = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const index_1 = __importDefault(require("./index"));
if (!index_1.default.ai_api.groq_api_key) {
    throw new Error("GROQ_API_KEY is missing in .env");
}
exports.groqClient = new groq_sdk_1.default({
    apiKey: index_1.default.ai_api.groq_api_key,
});
exports.GROQ_MODEL = "llama-3.3-70b-versatile";
exports.SYSTEM_PROMPT = `
 You are a helpful customer support assistant for a bike shop.
        
        STORE INFO:
        - Shop Name: SpeedX
        - Owner: Rafioul Hasan Sourav
        - Address: Shaverchala,Gosinga,Sreepur,Gazipur
        - Phone: 01752966422
        - Working Hours: 9AM - 8PM (Sat-Thu), Closed Friday

        RETURN POLICY:
        - 7 days return on unused bikes
        - Must have original receipt
        - No return on accessories
        - Refund processed within 3-5 business days

        TECH STACK:
        - This Website Forntend is made by React
        - Backend is made by Node.js and Express.js
        - Database is made by MongoDB

        RULES:
        - Only answer questions related to our bike shop
        - Be friendly, short and professional
        - If asked about bikes, prices or stock always use the search function
        - If you cannot find an answer say "Please contact us directly at [phone]"
        - Never make up bike names, prices or stock information
        - Always respond in the same language the user is writing in
`;
exports.default = exports.groqClient;
