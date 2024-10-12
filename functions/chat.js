// netlify/functions/chat.js

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

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server configuration error: Missing API key.' }),
            };
        }

        // Prepare the messages array for GPT-4 Chat Completion API
        const messages = [
            { role: 'system', content: 'You are an assistant that provides Python code solutions.' },
            { role: 'user', content: message }
        ];

        // Call OpenAI Chat Completion API with GPT-4
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-2024-05-13',
                messages: messages,
                max_tokens: 3000,
                temperature: 0.5,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const reply = data.choices[0].message.content.trim();
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
