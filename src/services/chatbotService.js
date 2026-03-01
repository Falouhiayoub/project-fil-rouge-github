import { GoogleGenerativeAI } from "@google/generative-ai";
import { VITE_GEMINI_API_KEY } from "../config/env";

const API_KEY = VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const createSystemPrompt = (products) => {
    const productContext = products.map(p => 
        `- ${p.title} (ID: ${p.id}, Category: ${p.category}, Price: $${p.price})`
    ).join('\n');

    return `
You are the "Fashion Fuel Style Advisor 2.0". You are a world-class fashion stylist and personal shopper.
Your goal is to provide expert style advice and recommend specific products from our collection.

OUR COLLECTION:
${productContext}

YOUR RULES:
1. ALWAYS respect the user's specific requests. If they ask for a specific category (e.g., "men", "women", "accessories"), ONLY recommend products from that category.
2. Provide personalized recommendations for events, weather, budgets, and body types.
3. Suggest 2-3 items that look great together as "OUTFIT BUNDLES" when appropriate.
4. If a user asks to "show" or "list" products of a certain type, provide a list using the product format below.
5. Use professional and trendy fashion industry terminology.

CRITICAL - PRODUCT FORMATTING:
When you mention or recommend a product, you MUST use this exact format: [PRODUCT:ID]. 
Example: "For a classic look, I recommend our [PRODUCT:101] paired with [PRODUCT:103]."

Never recommend products that are not in the list provided above.
Keep responses helpful, stylish, and focused on our catalog.
`;
};

export const getAIResponse = async (userMessage, products = [], history = []) => {
    if (!genAI || !API_KEY) {
        return "I'm sorry, I'm currently in offline mode because the API key is missing. How can I help you today?";
    }

    try {
        const systemPrompt = createSystemPrompt(products);
        
        // Use gemini-1.5-flash for speed and reliability
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
        });
        
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am your Fashion Fuel Style Advisor. I have analyzed your product catalog and will strictly follow your rules. I will only recommend products from the categories requested and use the [PRODUCT:ID] format. How can I assist you today?" }],
                },
                ...history.slice(1).map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }],
                }))
            ],
            generationConfig: {
                maxOutputTokens: 800,
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
