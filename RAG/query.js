import * as dotenv from 'dotenv';
dotenv.config();

import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({});
const History = []

async function transformQuery(question){

History.push({
    role:'user',
    parts:[{text:question}]
    })  

const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: History,
    config: {
      systemInstruction: `You are a query rewriting expert. Based on the provided chat history, rephrase the "Follow Up user Question" into a complete, standalone question that can be understood without the chat history. 
    Only output the rewritten QYESTION and nothing else.
      `,
    },
 });
 
 History.pop()
 
 console.log(`LLM Question :
    <----------------------------> 
    <---------------------------->
    <============================>` ,response.text);
 return response.text;

}


async function chatting(question) {

    //convert this question to vector
    const queries = await transformQuery(question);

    const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004',
    });
 
    const queryVector = await embeddings.embedQuery(queries); 
    //query vector


    //connection with pinecone
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const searchResults = await pineconeIndex.query({
    topK: 20,
    vector: queryVector,
    includeMetadata: true,
    });

    // console.log(searchResults);
    
    //top 10 documents: 10 meta data text part

    //create the context for llm.
    const context = searchResults.matches
                   .map(match => match.metadata.text)
                   .join("\n\n---\n\n");


    //Gemini

    History.push({
    role:'user',
    parts:[{text:queries}]
    })  

    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: History,
    config: {
      systemInstruction: `You have to behave like a Data Structure and Algorithm Expert.
    You will be given a context of relevant information and a user question.
    Your task is to answer the user's question based ONLY on the provided context.
    If the answer is not in the context, you must say "I could not find the answer in the provided document."
    Keep your answers clear, concise, and educational.
      
      Context: ${context}
      `,
    },
   });


   History.push({
    role:'model',
    parts:[{text:response.text}]
  })

  console.log("\n");
  console.log(response.text);

    
}

async function main(){
   const userProblem = readlineSync.question("Ask me anything--> ");
   await chatting(userProblem);
   main();
}


main();