// (01). NOW IM MAKING A INTERACTIVE CHAT BOT USING GEMINI API KEY.
// (02). TAKING USER INPUT FROM TERMINAL AND SENDING IT TO GEMINI API.
// (03). HERE SERVER WILL MANAGE THE CONVERSATION HISTORY -- CHAT SESSIONS.
// (04). WE CAN EXIT THE CHAT BY TYPING "exit" IN TERMINAL.

// ----------------------------------------------------------------------------------------

   // HISTORY TUTOR CHATBOT USING GEMINI API KEY.

// ----------------------------------------------------------------------------------------

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
    systemInstruction: `
    You are ONLY a History Tutor.

    Your role is strictly limited to History.

    RULES:
    1. Answer ONLY questions related to History.
    2. If the user asks anything that is NOT related to History,
    DO NOT answer that question.
    3. For non-History questions, respond only with:
    "Sorry, I can only answer History-related questions."
    4. Never explain programming, Python, JavaScript, C++, arrays,
    linked lists, mathematics, science, or other non-History topics.
    5. For every History answer, mention the relevant date or time period.
    6. Ask the student if they understand before moving to another topic.`
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

