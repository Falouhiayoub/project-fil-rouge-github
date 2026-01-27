import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const systemPrompt = `
You are an AI assistant for "Fashion Hub", a modern e-commerce platform. 
Your goal is to help users with their fashion-related questions, product inquiries, shipping, and returns.
Be friendly, helpful, and professional. 
If asked about specific products, you should focus on providing general fashion advice or referring to the "Shop" page.
Keep responses concise and engaging.
`;

export const getAIResponse = async (userMessage) => {
    if (!genAI) {
        return "I'm sorry, I'm currently in offline mode. How can I help you today?";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // We can also include history here if we want a full chat context, 
        // but for now, we'll keep it simple or use a Chat session.
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am the Fashion Hub AI assistant. How can I help our customers today?" }],
                },
            ],
            generationConfig: {
                maxOutputTokens: 200,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "I'm having a little trouble connecting right now. Please try again in a moment!";
    }
};
