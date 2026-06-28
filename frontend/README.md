# AI Chat Assistant — Frontend (Vite + React)

This is the Vite-based conversion of the original no-build-tool frontend
(plain `index.html` loading React/Babel from a CDN). Same UI, same
components, same Tailwind design — now running on real ES modules with
hot module reload.

## What changed from the original

| Original | Vite version |
|---|---|
| React/Babel loaded via `<script>` CDN tags | `react`, `react-dom` as npm deps |
| JSX compiled in-browser by Babel Standalone | JSX compiled at build/dev time by `@vitejs/plugin-react` |
| Components as global `function X() {}` | Components as ES modules with `export default` |
| `utils/chatAgent.js` set `window.chatAgent` | `chatAgent.js` exports `chatAgent()` / `resetChatAgentConversation()` |
| Tailwind via `cdn.tailwindcss.com` script | Tailwind via PostCSS + `tailwind.config.js` |
| No `package.json` / no install step | Standard `npm install` / `npm run dev` |

The visual design, animations, and behavior are unchanged — this was a
tooling conversion, not a redesign.

## Setup

```bash
cd ai_chatboat_fullstack/frontend
npm install
cp .env.example .env       # point VITE_API_BASE_URL at your backend
npm run dev
```

Opens at `http://localhost:5173`. Make sure the backend (`../backend`) is
running on the URL set in `.env` (default `http://localhost:3001/api`).

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview     # serve the production build locally
```

## Folder structure

```
frontend/
├── index.html              # Vite entry HTML, loads /src/main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── src/
    ├── main.jsx             # mounts <App /> into #root
    ├── App.jsx              # root component (was app.js)
    ├── ErrorBoundary.jsx    # split out of app.js into its own module
    ├── index.css            # Tailwind directives + all custom animations
    ├── components/
    │   ├── AuthScreen.jsx
    │   ├── Sidebar.jsx
    │   ├── WelcomeScreen.jsx
    │   ├── ChatMessage.jsx
    │   ├── ChatInput.jsx
    │   └── BubbleBackground.jsx
    └── utils/
        └── chatAgent.js
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (must be prefixed `VITE_` for Vite to expose it to client code) |
