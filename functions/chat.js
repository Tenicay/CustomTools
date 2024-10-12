// functions/chat.js

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { message } = JSON.parse(event.body);

    // OpenAI API Key (Stored in Netlify Environment Variables)
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            prompt: message,
            max_tokens: 150,
        }),
    });

    const data = await response.json();
    const reply = data.choices[0].text.trim();

    return {
        statusCode: 200,
        body: JSON.stringify({ reply: reply }),
    };
};
