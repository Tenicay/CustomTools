// functions/chat.js

const { Configuration, OpenAIApi } = require('openai'); // Use require for CommonJS

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async function (event, context) {
  try {
    console.log('Event Body:', event.body);
    const body = JSON.parse(event.body);
    const userMessage = body.message;
    console.log('User Message:', userMessage);

    const systemPrompt = `
You are a coding assistant specialized in generating Python code that can be executed in the browser using PyScript. When a user requests code, provide only the Python code enclosed within <py-script> and </py-script> tags. Do not include code fences or additional explanations. Ensure that the code is syntactically correct and ready to be executed with PyScript.

If the code requires HTML elements (like input fields or buttons), include them in the response as well.

Do not include any markdown formatting or triple backticks in your response.

For example, if the user asks for a script to print "Hello, World!", you should respond:

<py-script>
print("Hello, World!")
</py-script>
`;

    // Since version 3.x does not support createChatCompletion, use createCompletion
    const response = await openai.createCompletion({
      model: 'gpt-4o-2024-05-13',
      prompt: `${systemPrompt}\nUser: ${userMessage}\nAssistant:`,
      max_tokens: 2000,
      temperature: 0.7,
      stop: null,
    });

    console.log('OpenAI API Response:', response.data);

    const assistantReply = response.data.choices[0].text.trim();
    console.log('Assistant Reply:', assistantReply);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: assistantReply }),
    };
  } catch (error) {
    console.error('Error in chat.js:', error.response ? error.response.data : error.message);

    let errorMessage = 'An error occurred while processing your request.';
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
      errorMessage = error.response.data.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
