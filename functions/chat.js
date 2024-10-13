// functions/chat.js

const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    try {
        const body = JSON.parse(event.body);
        const userMessage = body.message;

        const apiKey = process.env.OPENAI_API_KEY;

        const systemPrompt = `
You are a coding assistant specialized in generating Python code that can be executed in the browser using PyScript.

When a user requests functionality, provide only the Python code needed, without any HTML or additional text. The code should be ready to execute in a <py-script> tag.

Do not include any markdown formatting, code fences, or explanations.

For example, if the user asks for a calculator, provide only the Python code that implements the calculator logic, assuming the necessary HTML elements are already present in the page.
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
                model: 'gpt-3.5-turbo', // Use 'gpt-4' if you have access
                messages: messages,
                max_tokens: 500,
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
