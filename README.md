# AI Chat Assistant — Full Stack

A complete AI chat application: a Vite + React frontend and a Node.js +
Express + MongoDB backend powered by the Claude API.

```
ai_chatboat_fullstack/
├── frontend/      ← Vite + React app (see frontend/README.md)
└── backend/       ← Express API + MongoDB + Claude (see backend/README.md)
```

## Quick start

**1. Backend**

```bash
cd ai_chatboat_fullstack/backend
npm install
cp .env.example .env
# edit .env: set MONGODB_URI, ANTHROPIC_API_KEY, JWT_SECRET
npm run dev
```

Runs on `http://localhost:3001`.

**2. Frontend** (in a separate terminal)

```bash
cd ai_chatboat_fullstack/frontend
npm install
cp .env.example .env
# default VITE_API_BASE_URL=http://localhost:3001/api already matches the backend
npm run dev
```

Opens on `http://localhost:5173`.

**3. Use it**

Open `http://localhost:5173` in your browser. Register a new account on
the auth screen, then start chatting — messages are sent to your backend,
which calls the Claude API and persists the conversation in MongoDB.

## Why two separate `npm install`s?

The frontend and backend are independent Node projects with their own
`package.json` — this is standard for a decoupled frontend/backend setup
and lets you deploy, scale, or restart them independently (e.g. frontend
on Vercel/Netlify, backend on Render/Railway/a VPS).

## Troubleshooting

- **Blank page / nothing renders** — open the browser console (F12). A real
  error there will point to the exact problem; this setup uses real ES
  modules so build errors surface immediately in `npm run dev`'s terminal
  output too.
- **CORS errors in the console** — make sure `backend/.env`'s `FRONTEND_URL`
  matches the URL the frontend is actually running on (default `5173`).
- **"Failed to fetch" on login/chat** — the backend isn't running, or
  `frontend/.env`'s `VITE_API_BASE_URL` doesn't match the backend's actual
  port.
- **MongoDB connection errors** — make sure MongoDB is running locally, or
  `MONGODB_URI` points at a valid MongoDB Atlas connection string.
