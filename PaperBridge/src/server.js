import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '4mb' }));

const PORT = process.env.PORT || 3001;
const COHERE_API_KEY = process.env.COHERE_API_KEY;

// Cohere's summarize endpoint caps the input length and needs a minimum amount
// of text to work with, so we summarize long documents in fixed-size chunks and
// then summarize the combined result (map-reduce).
const CHUNK_SIZE = 3800;
const MIN_CHARS = 250;
const MAX_CHUNKS = 8;

function chunkText(text, size) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

async function cohereSummarize(text) {
  // Too short to summarize: return it as-is rather than erroring.
  if (text.length < MIN_CHARS) return text.trim();

  const response = await fetch('https://api.cohere.ai/v1/summarize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      length: 'medium',
      format: 'paragraph',
      model: 'command',
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.summary) {
    throw new Error(data.message || 'The summarization provider returned an error.');
  }

  return data.summary;
}

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
    const clean = text.replace(/\s+/g, ' ').trim();
    const allChunks = chunkText(clean, CHUNK_SIZE);
    const chunks = allChunks.slice(0, MAX_CHUNKS);

    const partials = [];
    for (const chunk of chunks) {
      partials.push(await cohereSummarize(chunk));
    }

    let summary = partials.join(' ');
    if (partials.length > 1) {
      summary = await cohereSummarize(summary.slice(0, CHUNK_SIZE));
    }

    res.json({ summary, truncated: allChunks.length > MAX_CHUNKS });
  } catch (err) {
    console.error('Server error:', err);
    res.status(502).json({ error: err.message || 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
