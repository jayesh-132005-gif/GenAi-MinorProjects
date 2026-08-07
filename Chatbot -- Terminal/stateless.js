// (01). NOW IM MAKING A INTERACTIVE CHAT BOT USING GEMINI API KEY.
// (02). TAKING USER INPUT FROM TERMINAL AND SENDING IT TO GEMINI API.
// (03). WE ARE MANAGING CONVERSATION HISTORY USING ARRAY.
// (04). WE CAN EXIT THE CHAT BY TYPING "exit" IN TERMINAL.

import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import readlineSync from "readline-sync";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


async function main() {
console.log("Chat started! Type 'exit' to quit.\n");

// STORE CONVERSATION HISTORY IN AN ARRAYS
const history = [];

while (true) {
    // GET USER INPUT
    const userMessage = readlineSync.question("You: ");

    // CHECK IF USER WANTS TO EXIT 
    if (userMessage.toLowerCase() === "exit") {
        console.log("Exiting chat. Goodbye!");
        break;
    }

    // ADD USER INPUT TO HISTORY
    history.push({
        type: "user_input",
        content: [{ type: "text", text: userMessage }]
    });

    // SEND HISTORY TO GEMINI API AND GET RESPONSE 
    const response = await ai.interactions.create({
        model: "gemini-3.6-flash",
        store: false,
        input: history
    });

    // GEMINI KA RESPONSE 
    const aiResponse =  response.steps.at(-1).content[0].text;
    console.log(`AI: ${aiResponse}\n`);

    // ADD AI RESPONSE TO  HISTORY 
    history.push(...response.steps);

}

}

await main();



