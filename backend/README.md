# AI Chat Assistant — Backend

Node.js / Express backend for the AI Chat Assistant frontend you uploaded
(React + Tailwind, served via `index.html`, `app.js`, `components/*`).

## Stack

- **Express** — REST API server
- **MongoDB + Mongoose** — users & conversation persistence
- **JWT (jsonwebtoken)** — stateless authentication
- **bcryptjs** — password hashing
- **@anthropic-ai/sdk** — calls Claude for AI replies
- **helmet / cors / express-rate-limit** — security & abuse protection

## Folder Structure

```
ai_chatbot_backend/
├── server.js                  # App entry point
├── package.json
├── .env.example
├── config/
│   └── db.js                  # MongoDB connection
├── routes/
│   ├── auth.js                 # /api/auth/*
│   ├── chat.js                 # /api/chat/*
│   └── user.js                 # /api/user/*
├── controllers/
│   ├── authController.js
│   ├── chatController.js
│   └── userController.js
├── middleware/
│   ├── auth.js                 # JWT verification
│   ├── validators.js           # request validation
│   ├── errorHandler.js         # global error handler
│   └── logger.js               # request logging
├── models/
│   ├── User.js
│   └── Conversation.js
├── services/
│   └── claudeService.js         # Claude API wrapper
└── frontend-integration/
    ├── chatAgent.js             # drop-in replacement for utils/chatAgent.js
    └── AuthScreen.js            # drop-in replacement for components/AuthScreen.js
```

## Setup

```bash
cd ai_chatbot_backend
npm install
cp .env.example .env       # then fill in your real values
npm run dev                 # nodemon, auto-restarts on changes
# or
npm start
```

Server starts on `http://localhost:3001`.

### Environment Variables (`.env`)

| Variable             | Description                              |
|-----------------------|-------------------------------------------|
| `PORT`                | API port (default 3001)                   |
| `FRONTEND_URL`        | Your frontend origin, for CORS            |
| `ANTHROPIC_API_KEY`   | Your Claude API key                       |
| `JWT_SECRET`          | Long random string for signing tokens     |
| `JWT_EXPIRES_IN`      | Token lifetime, e.g. `7d`                 |
| `MONGODB_URI`         | MongoDB connection string                 |

## API Endpoints

### Auth
| Method | Endpoint              | Body                              | Notes        |
|--------|------------------------|------------------------------------|--------------|
| POST   | `/api/auth/register`  | `{ name, email, password }`        | Returns JWT  |
| POST   | `/api/auth/login`     | `{ email, password }`              | Returns JWT  |
| POST   | `/api/auth/logout`    | —                                  | Protected    |
| POST   | `/api/auth/refresh`   | `{ token }`                        | New JWT      |

### Chat (all protected — require `Authorization: Bearer <token>`)
| Method | Endpoint                              | Body                                   |
|--------|-----------------------------------------|------------------------------------------|
| POST   | `/api/chat/message`                   | `{ message, conversationId?, attachments? }` |
| GET    | `/api/chat/conversations`             | —                                        |
| GET    | `/api/chat/history/:conversationId`   | —                                        |
| DELETE | `/api/chat/conversation/:conversationId` | —                                     |

### User (protected)
| Method | Endpoint               | Body            |
|--------|------------------------|------------------|
| GET    | `/api/user/profile`   | —                |
| PUT    | `/api/user/profile`   | `{ name }`       |
| DELETE | `/api/user/account`   | —                |

## Connecting it to your existing frontend

Your original `utils/chatAgent.js` called a placeholder `invokeAIAgent(...)`
function and your `AuthScreen.js` just faked a login with `setTimeout`. Two
files in `frontend-integration/` are drop-in replacements that call this real
backend instead:

1. Replace `utils/chatAgent.js` with `frontend-integration/chatAgent.js`
2. Replace `components/AuthScreen.js` with `frontend-integration/AuthScreen.js`

Everything else in your frontend (`app.js`, `ChatMessage.js`, `ChatInput.js`,
`Sidebar.js`, `WelcomeScreen.js`, `BubbleBackground.js`) works unchanged.

In `app.js`, also call `window.resetChatAgentConversation()` inside your
`onNewChat` handler so a fresh chat starts a new conversation thread on the
backend:

```js
onNewChat={() => { setMessages([]); window.resetChatAgentConversation(); }}
```

## Security Notes

- Passwords are hashed with bcrypt (12 rounds) and never returned in API responses.
- JWTs are stateless; for true logout/blacklisting, add a Redis-backed denylist.
- Rate limiting: 100 req / 15 min globally, 20 req / min on `/api/chat/*`.
- `helmet` sets standard security headers; CORS is locked to `FRONTEND_URL`.
