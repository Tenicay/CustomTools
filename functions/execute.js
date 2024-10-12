// functions/execute.js

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

        const { code } = JSON.parse(event.body);

        if (!code || code.trim() === '') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No code provided.' }),
            };
        }

        // JDoodle API credentials (Stored in Netlify Environment Variables)
        const clientId = process.env.JDOODLE_CLIENT_ID;
        const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

        // Prepare the payload
        const payload = {
            script: code,
            language: "python3",
            versionIndex: "3", // Adjust based on JDoodle's API documentation
            clientId: clientId,
            clientSecret: clientSecret
        };

        // Call JDoodle API
        const response = await fetch('https://api.jdoodle.com/v1/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*', // Adjust as needed
                },
                body: JSON.stringify({ output: data.output }),
            };
        } else {
            console.error('JDoodle API Error:', data);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to execute code.' }),
            };
        }

    } catch (error) {
        console.error('Error in execute function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
