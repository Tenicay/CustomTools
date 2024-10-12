// Function to append messages to the chat container
function appendMessage(sender, message) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to inject PyScript code into the container and display output
function injectPyScript(code) {
    const container = document.getElementById('code-execution-container');
    const outputDiv = document.getElementById('output');
    
    // Log the code being injected for debugging
    console.log('Injecting PyScript code:', code);

    // Clear previous code and output
    container.innerHTML = '';
    outputDiv.textContent = '';

    // Create a new py-script element
    const pyScriptElement = document.createElement('py-script');
    pyScriptElement.setAttribute('output', 'output');
    pyScriptElement.innerHTML = code;

    // Append the py-script element to the container
    container.appendChild(pyScriptElement);
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

            // Extract PyScript code from the bot's reply
            const pyScriptMatch = botReply.match(/<py-script>([\s\S]*?)<\/py-script>/i);
            if (pyScriptMatch) {
                const pyScriptCode = pyScriptMatch[1].trim();
                
                // Log the extracted PyScript code for debugging
                console.log('Extracted PyScript code:', pyScriptCode);

                injectPyScript(pyScriptCode);
            } else if (data.error) {
                appendMessage('Bot', `Error: ${data.error}`);
            } else {
                console.warn('No <py-script> code found and no error message provided.');
            }
        } else {
            const errorData = await response.json();
            appendMessage('Bot', `Error: ${errorData.error || 'Unknown error occurred.'}`);
        }
    } catch (error) {
        console.error('Error communicating with chatbot:', error);
        appendMessage('Bot', 'Error: Unable to communicate with the chatbot.');
    }
});
