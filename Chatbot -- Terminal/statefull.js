// (01). NOW IM MAKING A INTERACTIVE CHAT BOT USING GEMINI API KEY.
// (02). TAKING USER INPUT FROM TERMINAL AND SENDING IT TO GEMINI API.
// (03). HERE SERVER WILL MANAGE THE CONVERSATION HISTORY -- CHAT SESSIONS.
// (04). WE CAN EXIT THE CHAT BY TYPING "exit" IN TERMINAL.

import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function main() {
  console.log("Chat started! Type 'exit' to quit.\n");

  // Create chat session - handles history automatically
  const chat = ai.chats.create({
    model: "gemini-3.6-flash",
  });

  while (true) {
    const userMessage = readlineSync.question("You: ");

    if (userMessage.toLowerCase() === "exit") {
      console.log("Goodbye!");
      break;
    }

    // Send message - history is managed automatically!
    const response = await chat.sendMessage({
      message: userMessage,
    });

    console.log(`AI: ${response.text}\n`);
  }
}

await main();

