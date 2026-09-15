import * as dotenv from 'dotenv';
dotenv.config();
import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Pinecone } from '@pinecone-database/pinecone';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';


// EMBEDDING MODEL AND CHAT MODEL INITIALIZATION
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-embedding-2',
});

// CHAT MODEL INITIALIZATION
const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-3.6-flash',
    temperature: 0.3,
});

// CONNECTING TO PINECONE VECTOR DATABASE
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);




async function chatting(userProblem) {


    // TO GET VECTOR EMBEDDINGS OF USER INPUT
    const queryVector = await embeddings.embedQuery(userProblem);

    // QUERYING PINECONE INDEX FOR RELEVANT DOCUMENTS BASED ON USER INPUT
    const searchResults = await pineconeIndex.query({
        topK: 10,
        vector: queryVector,
        includeMetadata: true,
    });

    // EXTRACTING RELEVANT CONTEXT FROM SEARCH RESULTS
    const context = searchResults.matches
        .map(match => match.metadata.text)
        .join("\n\n---\n\n");

    // SETTING UP PROMPT TEMPLATE
    const promptTemplate = PromptTemplate.fromTemplate(`  
        You are a helpful assistant answering questions based on the provided documentation.

        Context from the documentation:
        {context}

        Question: {question}

        Instructions:
        - Answer the question using ONLY the information from the context above
        - If the answer is not in the context, say "I don't have enough information to answer that question."
        - Be concise and clear
        - Use code examples from the context if relevant

        Answer:
        `);

    // CREATING A RUNNABLE SEQUENCE TO PROCESS THE PROMPT AND GENERATE A RESPONSE    
    const chain = RunnableSequence.from([
        promptTemplate,
        model,
        new StringOutputParser(),
    ]);

    // INVOKING THE CHAIN WITH THE CONTEXT AND USER QUESTION TO GET THE FINAL ANSWER 
    const answer = await chain.invoke({
            context: context,
            question: userProblem,
    }); 

    // LOGGING THE FINAL ANSWER TO THE CONSOLE
    console.log(`AI: ${answer}`);


}
// ASYNCHRONOUS FUNCTION TO GET USER INPUT AND CALL THE CHAT FUNCTION
async function main() {
    const userProblem = readlineSync.question("Ask me anything:-  ");
    await chatting(userProblem);
    main();
}

main();