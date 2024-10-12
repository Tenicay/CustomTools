// script.js

// Send Button Event Listener
document.getElementById('send-button').addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== '') {
        sendMessage(userInput);
    }
});

// Function to Send Message
function sendMessage(userInput) {
    // Display User Message
    const conversation = document.getElementById('conversation');
    const userMessage = document.createElement('div');
    userMessage.textContent = `You: ${userInput}`;
    userMessage.classList.add('user-message');
    conversation.appendChild(userMessage);

    // Clear Input Field
    document.getElementById('user-input').value = '';

    // Placeholder for Bot Response
    const botMessage = document.createElement('div');
    botMessage.textContent = 'Bot: Thinking...';
    botMessage.classList.add('bot-message');
    conversation.appendChild(botMessage);

    // Scroll to Bottom
    conversation.scrollTop = conversation.scrollHeight;

    // Simulate API Call (Replace with actual API call later)
    setTimeout(() => {
        botMessage.textContent = 'Bot: This is a placeholder response.';
    }, 1000);
}

// Run Code Button Event Listener
document.getElementById('run-code-button').addEventListener('click', () => {
    const code = document.getElementById('code-editor').value;
    if (code.trim() !== '') {
        runCode(code);
    }
});

// Function to Run Code
function runCode(code) {
    const outputArea = document.getElementById('output-area');
    outputArea.textContent = 'Running code...';

    // Simulate Code Execution (Replace with actual code execution later)
    setTimeout(() => {
        outputArea.textContent = 'Output:\nThis is where the code output will appear.';
    }, 1000);
}
