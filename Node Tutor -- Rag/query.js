import { configDotenv } from 'dotenv';
import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";


const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004"
});



async function chatting(userProblem) {

    // 
    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004",
        apiKey: GEMINI_API_KEY
    });



}
// ASYNCHRONOUS FUNCTION TO GET USER INPUT AND CALL THE CHAT FUNCTION
async function main() {
    const userProblem = readlineSync.question("Ask me anything:-  ");
    await chatting(userProblem);
    main();
}

main();