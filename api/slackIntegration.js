// api/slackIntegration.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/slack/integrate', async (req, res) => {
  try {
    const { text } = req.body;
    const chatGptResponse = await generateChatGptResponse(text);
    res.json({ text: chatGptResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

async function generateChatGptResponse(inputText) {
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

  return response.data.choices[0].message.content;
}

module.exports = app;
