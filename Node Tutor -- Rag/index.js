import * as dotenv from 'dotenv';
dotenv.config();
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';


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


    // (03). INITIALIZING THE EMBEDDING MODEL



}

// CALLING THE INDEXING FUNCTION
indexing();