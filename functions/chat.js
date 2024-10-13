// functions/chat.js

const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    try {
        const body = JSON.parse(event.body);
        const userMessage = body.message;

        const apiKey = process.env.OPENAI_API_KEY;

        const systemPrompt = `
You are a coding assistant specialized in generating Python code that can be executed in the browser using PyScript.

When a user requests functionality, provide the complete HTML and Python code needed, enclosed within appropriate HTML and <py-script> tags. The code should be ready to be injected into a web page and executed.

Important:
- Ensure that you import 'create_proxy' from 'pyodide.ffi', not from 'pyodide'.
- The code must be compatible with Pyodide version 0.21.0 and above.
- Do not include any markdown formatting, code fences, or explanations.
- Provide code that can be directly injected into a web page's container and function correctly.

For example, if the user asks for a colorful calculator, provide the entire code including HTML elements, styling, and ensure compatibility with the current Pyodide version.

`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-2024-05-13', // Use your specified model
                messages: messages,
                max_tokens: 2000,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const assistantReply = data.choices[0].message.content.trim();
            return {
                statusCode: 200,
                body: JSON.stringify({ reply: assistantReply }),
            };
        } else {
            console.error('OpenAI API Error:', data);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: data.error.message || 'An error occurred.' }),
            };
        }
    } catch (error) {
        console.error('Error in chat.js:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
