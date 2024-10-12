// functions/execute.js

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { code } = JSON.parse(event.body);

    const response = await fetch('https://api.jdoodle.com/v1/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            script: code,
            language: 'python3',
            versionIndex: '3',
            clientId: process.env.JDOODLE_CLIENT_ID,
            clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        }),
    });

    const data = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify({ output: data.output }),
    };
};
