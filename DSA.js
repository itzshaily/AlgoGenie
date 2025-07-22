// import {GoogleGenAI }   from  "@google/genai";

// const ai = new GoogleGenAI({apiKey: "AIzaSyBRhop_ujMtLcS1zTdszYyB52xUTxEmNMA"});

// async function main(msg) {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "what is the colour of the ocean",
//     config: {
//         systemInstruction: `you are a data structures and algorithms expert or instructor.
//          you will only reply to the user only if he asks questions related to data structures and algorithms.
//          you will not reply to any other questions. and say user to ask data structure questions only politely.
//          solve user queries and provide them simple explainations .
//          if user do not ask question related to data structures and algorithm tell user rudely for example ->you dumb ask only data structure questions
//          don't repeat this same line you can use other rude things.` ,
//        },
//   });
//     console.log(response.text);
  
// }

// await main();





document.addEventListener('DOMContentLoaded', () => {
    const promptButtons = document.querySelectorAll('.prompt-btn');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    promptButtons.forEach(button => {
        button.addEventListener('click', () => {
            userInput.value = button.innerText;
            userInput.focus();
            // Optional: automatically send the message
            // sendBtn.click(); 
        });
    });
});


// Import GoogleGenerativeAI from the SDK script in the HTML
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

// --- START: IMPORTANT ---
//
// 1. REPLACE "YOUR_API_KEY" with your actual Google AI API key.
// 2. Ensure your API key is enabled for the "Generative Language API".
//
const API_KEY = "AIzaSyBRhop_ujMtLcS1zTdszYyB52xUTxEmNMA";
//
// --- END: IMPORTANT ---

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Show an error message in the chat
function displayError(message) {
    appendMessage(message, 'bot', true);
}

// Check if the API key is provided
if (API_KEY === "YOUR_API_KEY") {
    displayError("API Key not found. Please add your API key in script.js.");
}

// Initialize the Generative AI model
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Use a powerful model
    systemInstruction: `you are a data structures and algorithms expert or instructor.
     you will only reply to the user if he asks questions related to data structures and algorithms.
     you will not reply to any other questions.
     solve user queries and provide them simple explanations.
     if a user does not ask a question related to data structures and algorithms, tell the user rudely to ask only data structure questions. for example -> you dumb ask only data structure questions.
     don't repeat this same line; you can use other rude phrases.`,
});

// Function to append a message to the chat box
function appendMessage(text, sender, isError = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', `${sender}-message`);
    if (isError) {
        // Simple styling for error messages
        messageElement.style.backgroundColor = '#d9534f'; 
    }
    messageElement.innerHTML = `<p>${text}</p>`; // Use innerHTML to render line breaks
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to show a typing indicator
function showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.classList.add('chat-message', 'bot-message', 'typing-indicator');
    typingElement.id = 'typing-indicator';
    typingElement.innerHTML = `<span></span><span></span><span></span>`;
    chatBox.appendChild(typingElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to remove the typing indicator
function removeTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement) {
        typingElement.remove();
    }
}

// Main function to handle user messages
async function handleUserMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage || API_KEY === "YOUR_API_KEY") return;

    appendMessage(userMessage, 'user');
    userInput.value = '';
    sendBtn.disabled = true; // Disable button while waiting
    showTypingIndicator();

    try {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = await response.text();
        
        // Replace newlines with <br> for proper HTML rendering
        const formattedText = text.replace(/\n/g, '<br>');

        removeTypingIndicator();
        appendMessage(formattedText, 'bot');

    } catch (error) {
        console.error("AI Error:", error);
        removeTypingIndicator();
        displayError("Sorry, something went wrong with the AI service. Please check the console for details.");
    } finally {
        sendBtn.disabled = false; // Re-enable button
        userInput.focus();
    }
}

// Event Listeners
sendBtn.addEventListener('click', handleUserMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserMessage();
    }
});