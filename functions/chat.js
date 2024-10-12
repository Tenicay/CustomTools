// functions/chat.js

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    try {
        // Only allow POST requests
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers: { 'Allow': 'POST' },
                body: JSON.stringify({ error: 'Method Not Allowed' }),
            };
        }

        const { message } = JSON.parse(event.body);

        if (!message || message.trim() === '') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No message provided.' }),
            };
        }

        // OpenAI API Key (Stored in Netlify Environment Variables)
        const apiKey = process.env.OPENAI_API_KEY;

        // Prepare the prompt (You can customize this as needed)
        const prompt = `You are an intelligent assistant. Provide a Python code solution to the following request:\n\n${message}`;

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: prompt,
                max_tokens: 300,
                temperature: 0.5,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const reply = data.choices[0].text.trim();
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*', // Adjust as needed
                },
                body: JSON.stringify({ reply: reply }),
            };
        } else {
            console.error('OpenAI API Error:', data);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to fetch response from OpenAI.' }),
            };
        }

    } catch (error) {
        console.error('Error in chat function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
