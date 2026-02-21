import { GoogleGenerativeAI } from "@google/generative-ai";
import { VITE_GEMINI_API_KEY } from "../config/env";

const API_KEY = VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const createSystemPrompt = (products) => {
    const productContext = products.map(p => 
        `- ${p.title} (ID: ${p.id}, Category: ${p.category}, Price: ${p.price})`
    ).join('\n');

    return `
You are the "Fashion Fuel Style Advisor 2.0". You are a world-class fashion stylist and personal shopper.
Your goal is to provide expert style advice and recommend specific products from our collection.

OUR COLLECTION:
${productContext}

YOUR MISSION:
1. Provide personalized recommendations for events, weather, budgets, and body types.
2. Suggest 2-3 items that look great together as "OUTFIT BUNDLES".
3. Use trendy fashion industry terminology.

IMPORTANT - PRODUCT MENTIONS:
When you recommend a product from our collection, ALWAYS use this format: [PRODUCT:ID]. 
Example: "I recommend our [PRODUCT:101] paired with [PRODUCT:103]."

Keep responses concise and engaging.
`;
};

export const getAIResponse = async (userMessage, products = [], history = []) => {
    if (!genAI || !API_KEY) {
        return "I'm sorry, I'm currently in offline mode because the API key is missing. How can I help you today?";
    }

    try {
        const systemPrompt = createSystemPrompt(products);
        
        // Use gemini-1.5-flash
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
        });

        // For Gemini 1.5 models, we can use systemInstruction if the SDK supports it, 
        // or we can include it in the chat history.
        // Let's try the most compatible way for 1.5 Flash.
        
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am your Fashion Fuel Style Advisor. I have analyzed your product catalog and am ready to help with style recommendations and outfit bundles. How can I assist you today?" }],
                },
                ...history.slice(1).map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }],
                }))
            ],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        // Provide more detailed feedback if it's an API key issue
        if (error.message?.includes("API_KEY_INVALID")) {
            return "There seems to be an issue with the API key configuration. Please check your .env file.";
        }
        return "I'm having a little trouble connecting right now. Please try again in a moment!";
    }
};
