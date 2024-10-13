// script.js

// Function to append messages to the chat container
function appendMessage(sender, message) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to inject code into the container and display output
function injectPyScript(code) {
    const container = document.getElementById('code-execution-container');

    // Log the code being injected for debugging
    console.log('Injecting code:', code);

    // Clear previous code
    container.innerHTML = '';

    // Inject the code directly into the container
    container.innerHTML = code;
}

// Event listener for the Send button
document.getElementById('send-button').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;
    appendMessage('You', userInput);
    document.getElementById('user-input').value = '';

    // Send the user input to the chatbot's API (Netlify function)
    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        });

        if (response.ok) {
            const data = await response.json();
            const botReply = data.reply;
            appendMessage('Bot', botReply);

            // Log the bot's reply for debugging
            console.log('Bot Reply:', botReply);

            // Inject the bot's reply directly
            injectPyScript(botReply);
        } else {
            const errorData = await response.json();
            appendMessage('Bot', `Error: ${errorData.error || 'Unknown error occurred.'}`);
        }
    } catch (error) {
        console.error('Error communicating with chatbot:', error);
        appendMessage('Bot', 'Error: Unable to communicate with the chatbot.');
    }
});
