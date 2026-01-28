import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const History = [];
const ai = new GoogleGenAI({ apiKey: "AIzaSyDkZybJ6cmxFyiSSldrl7bLqQg-464vjy8" });


function sum({num1 , num2}){
    return num1+num2;
}

function prime({num}){

    if(num<2)
    return false;

    for(let i = 2; i<= Math.sqrt(num); i++)
    {
        if(num%i == 0)
            return false;
    }

    return true;

}

async function getCryptoPrice({coin}){

    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`)
    const data = await response.json();

    return data;
}

// async function getCryptoPrice({coin}){

//    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`)
//    const data = await response.json();

//    return data;
// }

const sumDeclaration = {
    name : 'sum',
    description : 'Get the sum of two number',
    parameters : {
        type : 'OBJECT',
        properties : {
            num1 : {
                type : 'NUMBER',
                description : 'it will be first number of the addition.'
            },
            num2 : {
                type : 'NUMBER',
                description : 'it will be second number of the addition.'
            },
        },
        required : ['num1' , 'num2']
    }
}

const primeDeclaration = {
    name : 'prime',
    description : 'get if number is prime or not',
    parameters : {
        type : 'OBJECT',
        properties : {
            num : {
                type : 'NUMBER',
                description : 'it will be the number to find if prime or not.'
            },
        },
        required : ['num'],
    },
}

const crypotDeclaration = {
    name : 'getCryptoPrice',
    description : 'get the price of any crypto currency like bitcoin',
    parameters : {
        type : 'OBJECT',
        properties : {
            coin : {
                type : 'STRING',
                description : 'it will be the the crypto currency name , like bitcoin'
            },
        },
        required : ['coin'],
    },
}


const availabeTools = {
    sum : sum,
    prime : prime,
    getCryptoPrice : getCryptoPrice,
};




async function runAgent(userProblem) {

    History.push({
        role : 'user',
        parts:[{text : userProblem}]
    });

    while(true){
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: History,
            config: {
                systemInstruction:`you are and AI Agent, You have access
                 of three tools like to find sum of two number, get crypto 
                 price of any currency and find if a number is prime
                 or not.
                 
                 Use these tools whenever requried to confirm user query.
                 If user ask general question you can answer it directly
                 if you don't need help of these three tools.` ,
                tools: [{
                    functionDeclarations: [sumDeclaration , primeDeclaration, crypotDeclaration]
                }],
            },
        }); 
        
        
        if(response.functionCalls && response.functionCalls.length>0){
           
            console.log(response.functionCalls[0]);
            const {name,args} = response.functionCalls[0];
            
            const funCall = availabeTools[name];
            const result = await funCall(args);
            
            const functionResponsePart = {
                name: name,
                response: {
                    result: result,
                },
            };
            
            //model
            History.push({
                role : "model",
                parts : [
                    {
                        functionCall : response.functionCalls[0] ,
                    },
                ],
                
            });
            
            //result in history
            History.push({
                role : "user",
                parts : [{
                    functionResponse : functionResponsePart,
                },
                ],
            });        
        }


        else{
            History.push({
                role : "model",
                parts : [{text : response.text}]
            })
            console.log(response.text);
            break;
        }

    }
}



async function main() {
    const userProblem = readlineSync.question("Ask me anything--->");
    await runAgent(userProblem);
    main();
}

main();




