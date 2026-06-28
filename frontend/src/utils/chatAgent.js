// src/utils/chatAgent.js
const API_BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, body, signal) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(body),
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error("Can't reach the server. Check your connection.");
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    const msg = errBody.error || errBody.message || `Request failed (HTTP ${response.status}).`;
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      throw new Error('Your session has expired. Please log in again.');
    }
    if (response.status === 429) {
      console.warn('[chatAgent] 429 source:', msg);
    }
    throw new Error(msg);
  }
  return response.json();
}

export async function chatAgent({ message, conversationId = null, signal } = {}) {
  const data = await request('/chat/message', { message, conversationId }, signal);
  return { reply: data.reply, conversationId: data.conversationId, type: 'text' };
}