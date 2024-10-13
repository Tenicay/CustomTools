// script.js

// Function to append messages to the chat container
function appendMessage(sender, message) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to inject and execute PyScript code
function injectCode(code) {
    const container = document.getElementById('code-execution-container');

    // Log the code being injected for debugging
    console.log('Injecting code:', code);

    // Clear previous content
    container.innerHTML = '';

    // Inject the code directly into the container
    container.innerHTML = code;

    // Re-evaluate PyScript to execute the new code
    if (window.pyscript && window.pyodide) {
        window.pyscript.main();
    } else {
        console.error('PyScript is not loaded.');
    }
}

// Event listener for the Send button
document.getElementById('send-button').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    // Display user's message in the chat
    appendMessage('You', userInput);
    document.getElementById('user-input').value = '';

    try {
        // Send the user's message to the chatbot API
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput }),
        });

        if (response.ok) {
            const data = await response.json();
            const botReply = data.reply;
            console.log('Bot Reply:', botReply);

            // Display a simple message in the chat
            appendMessage('Bot', 'Here is the code for your request.');

            // Inject and execute the bot's code
            injectCode(botReply);
        } else {
            const errorData = await response.json();
            appendMessage('Bot', `Error: ${errorData.error || 'An error occurred.'}`);
        }
    } catch (error) {
        console.error('Error communicating with chatbot:', error);
        appendMessage('Bot', 'Error: Unable to communicate with the chatbot.');
    }
});
