// functions/chat.js

const openai = require('openai'); // Import the entire openai module

const configuration = new openai.Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this environment variable is set in Netlify
});

const api = new openai.OpenAIApi(configuration); // Instantiate OpenAIApi with the configuration

exports.handler = async function (event, context) {
  try {
    // Parse the incoming request body
    console.log('Event Body:', event.body);
    const body = JSON.parse(event.body);
    const userMessage = body.message;
    console.log('User Message:', userMessage);

    // Define the system prompt to guide the assistant
    const systemPrompt = `
You are a coding assistant specialized in generating Python code that can be executed in the browser using PyScript. When a user requests code, provide only the Python code enclosed within <py-script> and </py-script> tags. Do not include code fences or additional explanations. Ensure that the code is syntactically correct and ready to be executed with PyScript.

If the code requires HTML elements (like input fields or buttons), include them in the response as well.

Do not include any markdown formatting or triple backticks in your response.

For example, if the user asks for a script to print "Hello, World!", you should respond:

<py-script>
print("Hello, World!")
</py-script>
`;

    // Create a chat completion
    const completion = await api.createChatCompletion({
      model: 'gpt-3.5-turbo', // Use 'gpt-4' if you have access
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 2000,
    });

    console.log('OpenAI API Response:', completion.data);

    // Extract the assistant's reply
    const assistantReply = completion.data.choices[0].message.content;
    console.log('Assistant Reply:', assistantReply);

    // Return the reply as JSON
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: assistantReply }),
    };
  } catch (error) {
    console.error('Error in chat.js:', error.response ? error.response.data : error.message);

    // Determine the error message to return
    let errorMessage = 'An error occurred while processing your request.';
    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.message
    ) {
      errorMessage = error.response.data.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Return the error message as JSON
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
