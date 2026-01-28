import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDkZybJ6cmxFyiSSldrl7bLqQg-464vjy8"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "What is a Array",
    config: {
      systemInstruction: `You are a Data Structure Algorithm instructor,
       you'll only reply to the problem related to Data Structure Algorithm
       in the simplest way and smoothly.

      IF user asks any question which is not related to the Data Structure Algorithm
      then response to him in a very rude manner.`,
    },
  });
  console.log(response.text);
}

main();