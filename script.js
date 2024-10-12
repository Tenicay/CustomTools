// script.js

// Initialize CodeMirror editor
const codeEditor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: 'python',
    lineNumbers: true,
    theme: 'default',
    readOnly: true // Initially read-only; becomes editable when user wants to modify
});

// Send Button Event Listener
document.getElementById('send-button').addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput !== '') {
        sendMessage(userInput);
    }
});

// Enter Key Press Event Listener for User Input
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const userInput = document.getElementById('user-input').value.trim();
        if (userInput !== '') {
            sendMessage(userInput);
        }
    }
});

// Function to Send Message to Backend
async function sendMessage(userInput) {
    appendMessage('You', userInput, 'user-message');

    // Clear Input Field
    document.getElementById('user-input').value = '';

    // Display Bot is typing...
    const botMessageElement = appendMessage('Bot', 'Typing...', 'bot-message');

    try {
        // Send POST request to Chat API
        const response = await fetch('/.netlify/functions/chat', { // Relative path for Netlify Functions
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        const botReply = data.reply;

        // Update Bot Message
        botMessageElement.textContent = `Bot: ${botReply}`;

        // If the bot reply contains code, display it in the code editor
        if (isCode(botReply)) {
            codeEditor.setValue(botReply);
            codeEditor.setOption('readOnly', false); // Make editable if user wants to modify
        }

    } catch (error) {
        console.error('Error:', error);
        botMessageElement.textContent = `Bot: Sorry, I encountered an error. Please try again.`;
    }

    // Scroll to Bottom
    scrollToBottom();
}

// Function to Run Code
document.getElementById('run-code-button').addEventListener('click', () => {
    const code = codeEditor.getValue().trim();
    if (code !== '') {
        runCode(code);
    }
});

// Function to Run Code via Backend
async function runCode(code) {
    appendOutput('Running code...');

    try {
        // Send POST request to Execute API
        const response = await fetch('/.netlify/functions/execute', { // Relative path for Netlify Functions
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: code })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        const output = data.output;

        appendOutput(output);

    } catch (error) {
        console.error('Error:', error);
        appendOutput('Error: Unable to execute code. Please try again.');
    }
}

// Utility Function to Append Messages to Conversation
function appendMessage(sender, message, className) {
    const conversation = document.getElementById('conversation');
    const messageElement = document.createElement('div');
    messageElement.classList.add(className);
    messageElement.textContent = `${sender}: ${message}`;
    conversation.appendChild(messageElement);
    scrollToBottom();
    return messageElement; // Return element to update later if needed
}

// Utility Function to Append Output
function appendOutput(message) {
    const outputArea = document.getElementById('output-area');
    outputArea.textContent = message;
    scrollToBottomOutput();
}

// Utility Function to Scroll Conversation to Bottom
function scrollToBottom() {
    const conversation = document.getElementById('conversation');
    conversation.scrollTop = conversation.scrollHeight;
}

// Utility Function to Scroll Output Area to Bottom
function scrollToBottomOutput() {
    const outputArea = document.getElementById('output-area');
    outputArea.scrollTop = outputArea.scrollHeight;
}

// Utility Function to Check if Message Contains Code (Simple Heuristic)
function isCode(message) {
    // Simple check: if message contains 'def ' or 'import ' or has multiple lines
    return message.includes('def ') || message.includes('import ') || message.split('\n').length > 1;
}
// script.js

// ... [Previous Code Remains the Same]

async function sendMessage(userInput) {
    appendMessage('You', userInput, 'user-message');

    // Clear Input Field
    document.getElementById('user-input').value = '';

    // Display Bot is typing...
    const botMessageElement = appendMessage('Bot', 'Typing...', 'bot-message');

    try {
        // Send POST request to Chat API
        const response = await fetch('/.netlify/functions/chat', { // Relative path for Netlify Functions
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        const botReply = data.reply;

        // Update Bot Message
        botMessageElement.textContent = `Bot: ${botReply}`;

        // If reply contains code, display it in code editor
        if (isCode(botReply)) {
            codeEditor.setValue(botReply);
            codeEditor.setOption('readOnly', false); // Make editable if user wants to modify
        }

    } catch (error) {
        console.error('Error:', error);
        botMessageElement.textContent = `Bot: Sorry, I encountered an error. Please try again.`;
    }

    // Scroll to Bottom
    scrollToBottom();
}

// ... [Rest of the Code Remains the Same]

async function runCode(code) {
    appendOutput('Running code...');

    try {
        // Send POST request to Execute API
        const response = await fetch('/.netlify/functions/execute', { // Relative path for Netlify Functions
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: code })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        const output = data.output;

        appendOutput(output);

    } catch (error) {
        console.error('Error:', error);
        appendOutput('Error: Unable to execute code. Please try again.');
    }
}
