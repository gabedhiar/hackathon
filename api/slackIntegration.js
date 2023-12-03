// api/slackIntegration.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');  // Assuming you're using axios for making HTTP requests

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = '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';

app.post('/slack/integrate', async (req, res) => {
  try {
    // Extract relevant data from the incoming Slack request
    const { text, user_id } = req.body;

    // Your ChatGPT integration logic here
    const chatGptResponse = await generateChatGptResponse(text);

    // Respond back to Slack
    res.json({ text: chatGptResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

async function generateChatGptResponse(inputText) {
  // Make a request to the ChatGPT API
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: inputText }],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  // Extract and return the ChatGPT response
  return response.data.choices[0].message.content;
}

module.exports = app;
