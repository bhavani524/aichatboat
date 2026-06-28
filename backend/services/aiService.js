const Groq = require("groq-sdk");

if (!process.env.GROQ_API_KEY) {
  console.error("[FATAL] GROQ_API_KEY is not set.");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.AI_MODEL || "llama-3.3-70b-versatile";
const MAX_RETRIES = Number(process.env.AI_MAX_RETRIES || 3);
const SYSTEM_PROMPT =
  process.env.AI_SYSTEM_PROMPT || "You are a helpful assistant.";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toGroqMessages(history, message) {
  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
  ];

  history.forEach((m) => {
    messages.push({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.content,
    });
  });

  messages.push({
    role: "user",
    content: message,
  });

  return messages;
}

async function generateAIResponse(message, history = []) {
  const messages = toGroqMessages(history, message);

  let lastErr;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const reply = completion.choices?.[0]?.message?.content?.trim();

      if (!reply) {
        const e = new Error("Empty AI response");
        e.code = "AI_UNAVAILABLE";
        throw e;
      }

      return reply;
    } catch (err) {
      lastErr = err;

      const status = err.status || err.response?.status;

      if (status === 429 && attempt < MAX_RETRIES) {
        const backoff = Math.min(2 ** attempt * 500, 8000);
        console.warn(
          `[aiService] Rate limited. Retry ${attempt + 1}/${MAX_RETRIES}`
        );
        await sleep(backoff);
        continue;
      }

      if (status === 429) {
        err.code = "AI_RATE_LIMIT";
      } else if (status === 401 || status === 403) {
        err.code = "AI_AUTH";
      } else if (status >= 500) {
        err.code = "AI_UNAVAILABLE";
      }

      throw err;
    }
  }

  throw lastErr;
}

module.exports = { generateAIResponse };