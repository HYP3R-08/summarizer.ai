import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 3001;
const COHERE_API_KEY = process.env.COHERE_API_KEY;

// Cohere's summarize endpoint has an input limit, so cap the text we send.
const MAX_INPUT_CHARS = 4000;

// Proxy endpoint: the browser sends the extracted text, the AI key stays here.
app.post('/summarize', async (req, res) => {
  const { text } = req.body ?? {};

  if (typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'A non-empty "text" field is required.' });
  }

  if (!COHERE_API_KEY) {
    return res.status(500).json({ error: 'The server is missing its COHERE_API_KEY.' });
  }

  try {
    const response = await fetch('https://api.cohere.ai/v1/summarize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text.slice(0, MAX_INPUT_CHARS),
        length: 'medium',
        format: 'paragraph',
        model: 'command',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.summary) {
      return res
        .status(response.status || 502)
        .json({ error: data.message || 'The summarization provider returned an error.' });
    }

    res.json({ summary: data.summary });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
