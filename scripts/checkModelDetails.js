import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function checkModelDetails() {
    if (!API_KEY) {
        fs.writeFileSync("model_detail.txt", "No API key found in .env");
        return;
    }
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest?key=${API_KEY}`);
        const data = await response.json();
        fs.writeFileSync("model_detail.txt", JSON.stringify(data, null, 2));
    } catch (error) {
        fs.writeFileSync("model_detail.txt", "Error: " + error.message);
    }
}

checkModelDetails();
