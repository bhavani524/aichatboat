# AI Chat Assistant - Premium Edition

A premium, production-ready AI Chat application built with React, TailwindCSS, and Trickle AI integration. Designed to match the look and feel of top-tier AI applications like ChatGPT and Gemini.

## Features
- **Premium UI/UX**: Full-screen responsive layout with a collapsible sidebar and clean typography.
- **Conversational AI**: Uses intelligent prompts to act like an expert developer and assistant.
- **Authentication**: Beautiful login screen with heroic animations and user session management.
- **Rich Media**: Markdown support, syntax highlighting, and real local file attachment selection.
- **Refined Animations**: Smooth transitions, slide-up reveals, ambient backgrounds, and modern typing indicators.

## Project Structure
- `index.html`: Main HTML file with CDN links and dark theme variable configurations.
- `app.js`: Main orchestration logic and layout container.
- `components/Sidebar.js`: Collapsible history and settings panel.
- `components/WelcomeScreen.js`: Start screen with action suggestions.
- `components/ChatInput.js`: Auto-resizing textarea with attachment handling.
- `components/ChatMessage.js`: Renders individual user and AI messages gracefully.
- `utils/chatAgent.js`: Integrates with Trickle's AI agent to get responses.