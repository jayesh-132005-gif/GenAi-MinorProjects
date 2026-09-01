import * as dotenv from 'dotenv';
dotenv.config();
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';


async function indexing() {

    // (01). PDF LOADER
    const pdf_path = './Mastering-Node.js.pdf';
    const pdfLoader = new PDFLoader(pdf_path);
    const rawDocs = await pdfLoader.load();

    // console.log(JSON.stringify(rawDocs, null, 2));
    // console.log(rawDocs.length);


    // (02). TEXT SPLITTER
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    // console.log(JSON.stringify(chunkedDocs.slice(0,2), null, 2));
    // console.log(chunkedDocs.length);


    // Filter out empty or whitespace-only chunks
    const filteredDocs = chunkedDocs.filter(
        (doc) => doc.pageContent && doc.pageContent.trim().length > 0
    );
    console.log(`Total chunks: ${chunkedDocs.length}, After filtering: ${filteredDocs.length}`);


    // (03). INITIALIZING THE EMBEDDING MODEL
    const embeddingModel = new GoogleGenerativeAIEmbeddings({
        model: 'gemini-embedding-001',
        apiKey: process.env.GEMINI_API_KEY,
    });



    // (04). INITIALIZE PINECONE CLIENT
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);



    // // (05). EMBEDDING THE CHUNKS AND UPLOAD TO PINECONE
    // await PineconeStore.fromDocuments(filteredDocs, embeddingModel, {
    //     pineconeIndex,
    //     namespace: 'node-tutor-rag',
    //     textKey: 'text',
    // });

    // -------------------------------------------------------------------------------------------------- 

    // (05). EMBEDDING THE CHUNKS AND UPLOAD TO PINECONE — BATCH WISE WITH DELAY
    const pineconeStore = new PineconeStore(embeddingModel, {
        pineconeIndex,
        namespace: 'node-tutor-rag',
        textKey: 'text',
    });

    const BATCH_SIZE = 20; // chhota rakho taaki rate limit na lage
    const DELAY_MS = 4000; // har batch ke beech 4 second ka gap

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    for (let i = 0; i < filteredDocs.length; i += BATCH_SIZE) {
        const batch = filteredDocs.slice(i, i + BATCH_SIZE);
        let success = false;
        let attempts = 0;

        while (!success && attempts < 3) {
            try {
                await pineconeStore.addDocuments(batch);
                console.log(`Batch ${i / BATCH_SIZE + 1} done (${i + batch.length}/${filteredDocs.length})`);
                success = true;
            } catch (err) {
                attempts++;
                console.error(`Batch ${i / BATCH_SIZE + 1} failed, attempt ${attempts}:`, err.message);
                await sleep(10000); // fail hone par 10 sec ruk ke retry
            }
        }

        await sleep(DELAY_MS); // rate limit se bachne ke liye gap
    }

    console.log("Indexing complete!");


}

// CALLING THE INDEXING FUNCTION
indexing();