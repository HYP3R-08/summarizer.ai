# PaperBridge

A web app that turns long PDFs into concise, readable summaries. Sign in, upload a document, and get an AI-generated summary saved to your personal library for later access.

> Also referred to as **summarizer.ai / Paperbridge.ai**.

---

## Features

- **PDF upload & text extraction** — drop in a PDF and extract its text client-side (`react-pdftotext`, `pdfjs-dist`).
- **AI summarization** — the extracted text is condensed into a summary via the Cohere API.
- **Accounts** — email/password authentication with Supabase Auth; the summarizer is gated behind a logged-in session.
- **Personal summary library** — every summary is stored per-user in Supabase and listed in a sidebar, ordered by date.
- **Multi-page UI** — Home, Login, Register and Summarizer views via React Router.

---

## How it works

```
Login (Supabase Auth)
   → upload PDF
   → react-pdftotext extracts the text
   → text sent to the Cohere API → summary
   → summary saved to Supabase (papers table, per user)
   → rendered in the app + listed in the sidebar
```

An optional **Express** service (`src/server.js`) is included as a server-side proxy to the OpenAI API, keeping that provider's key off the client.

---

## Tech stack

| Area | Technologies |
|------|--------------|
| Frontend | React 19, Vite, Tailwind CSS 4 |
| Routing | React Router (react-router-dom 7) |
| Auth & database | Supabase (Auth + PostgreSQL) |
| AI | Cohere API (summaries); optional OpenAI proxy via Express |
| PDF | react-pdftotext, pdfjs-dist, pdf-lib |

---

## Project structure

```
PaperBridge/
├─ src/
│  ├─ App.jsx            # routes: Home, Login, Register, Summarizer
│  ├─ Home.jsx           # landing page
│  ├─ Login.jsx          # sign in
│  ├─ SignIn.jsx         # registration
│  ├─ Summarizer.jsx     # upload, summarize, save, list
│  ├─ FileUploader.jsx   # PDF upload UI
│  ├─ Sidebar.jsx        # summary library
│  ├─ supabaseClient.js  # Supabase client (public anon key)
│  └─ server.js          # optional Express proxy to OpenAI
└─ index.html
```

---

## Configuration

The app reads its keys from environment variables (never commit real keys):

- `VITE_COHERE_API_KEY` — Cohere API key used by the client to generate summaries.
- `OPENAI_KEY` — used only by the optional Express proxy (`server.js`).

The Supabase **anon key** in `supabaseClient.js` is public by design; access is meant to be enforced server-side through Supabase **Row Level Security** policies.

---

## Notes & future work

- Calling the Cohere API directly from the browser exposes the key in the client bundle. For production, route summary requests through a server-side endpoint (like the included Express proxy) so the AI key stays private.
- Ensure Row Level Security is enabled on the `papers` table so each user can only read their own summaries.

---

## Author

Cristian Francesco Pennino — [GitHub](https://github.com/HYP3R-08)
