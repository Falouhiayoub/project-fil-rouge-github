import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function debug() {
    console.log("Key starting with:", API_KEY ? API_KEY.substring(0, 7) : "NOT FOUND");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    try {
        const result = await model.generateContent("Hi");
        console.log("Success:", (await result.response).text());
    } catch (e) {
        console.error("FULL ERROR:", e);
    }
}
debug();
