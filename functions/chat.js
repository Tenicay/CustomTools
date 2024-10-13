// functions/chat.js

const fetch = require('node-fetch'); // Use require for CommonJS

exports.handler = async function (event, context) {
    try {
        console.log('Event Body:', event.body);
        const body = JSON.parse(event.body);
        const userMessage = body.message;
        console.log('User Message:', userMessage);

        const apiKey = process.env.OPENAI_API_KEY;

        const systemPrompt = `
You are a coding assistant specialized in generating Python code that can be executed in the browser using PyScript.

When a user requests code, provide only the necessary HTML and Python code that can be directly injected into an HTML container and rendered correctly. Do not include code fences, markdown formatting, or additional explanations. Ensure that the code is syntactically correct and ready to be executed with PyScript.

For example, if the user asks for a script to print "Hello, World!" with a button, you should respond:

<div>
    <button id="hello-button">Say Hello</button>
    <py-script>
        from js import document

        def say_hello(event):
            print("Hello, World!")

        document.getElementById('hello-button').addEventListener('click', say_hello)
    </py-script>
</div>

Do not include any markdown formatting or triple backticks in your response.
`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
        ];

        // Make a POST request to the OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-2024-05-13', // Use 'gpt-4' if you have access
                messages: messages,
                max_tokens: 2000,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('OpenAI API Response:', data);

            const assistantReply = data.choices[0].message.content.trim();
            console.log('Assistant Reply:', assistantReply);

            return {
                statusCode: 200,
                body: JSON.stringify({ reply: assistantReply }),
            };
        } else {
            console.error('OpenAI API Error:', data);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: data.error.message || 'An error occurred while processing your request.' }),
            };
        }
    } catch (error) {
        console.error('Error in chat.js:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'An error occurred while processing your request.' }),
        };
    }
};
