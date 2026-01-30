import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function findWorkingModel() {
    if (!API_KEY) {
        console.error("No API key found");
        return;
    }
    const genAI = new GoogleGenerativeAI(API_KEY);
    const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-pro"
    ];

    for (const modelName of modelsToTry) {
        try {
            console.log(`Trying ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            console.log(`SUCCESS with ${modelName}: ${response.text()}`);
            break;
        } catch (error) {
            console.error(`FAILED with ${modelName}: ${error.message}`);
        }
    }
}

findWorkingModel();
