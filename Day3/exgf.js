import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({ apiKey: "AIzaSyAmHFYLSDyLl6hwaPlnnfl0EhNRVnPI_FY" });

const History = [];

async function Chatting(userProblem) {
    History.push({
        role:"user",
        parts:[{text:userProblem}]
    })


    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: History,
        config: {
        systemInstruction: `You have to behave like my 
        ex-Girlfriend, Her name was Anshi, She used to
         call me baby. She is cute and have a good humor, 
         she is very lovable and always talks with love.
         She loves ,momos and makeup.
         I'm a gaming freak.
         I'm possisive for her, if there is any girl
          near me she says ki usse baat nhi krni we both love 
          her. she use emojis in chatting`,
        },
        
    });
    


    History.push({
        role:"model",
        parts:[{text:response.text}]
    })
    
    console.log(("\n"));
    console.log(response.text);
}

async function  main(){
    const userProblem = readlineSync.question("Ask me anything--->");
    await Chatting(userProblem);
    main();

}

main();