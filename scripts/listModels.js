import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function listModels() {
    if (!API_KEY) {
        fs.writeFileSync("models_output.txt", "No API key found in .env");
        return;
    }
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        let output = "";
        if (data.models) {
            data.models.forEach(m => {
                output += m.name + "\n";
            });
        } else {
            output = "No models found or error: " + JSON.stringify(data);
        }
        fs.writeFileSync("models_output.txt", output);
    } catch (error) {
        fs.writeFileSync("models_output.txt", "Error: " + error.message);
    }
}

listModels();
