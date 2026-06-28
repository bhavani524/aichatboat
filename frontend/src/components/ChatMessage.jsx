import React from 'react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="flex gap-3 max-w-[85%]">
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">🤖</div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-100'
          }`}
        >
          {message.type === 'image' && message.mediaUrl ? (
            <div>
              <img src={message.mediaUrl} alt={message.content} className="rounded-lg max-w-full mb-2" />
              <p className="text-xs text-zinc-400">{message.content}</p>
            </div>
          ) : message.type === 'video' && message.mediaUrl ? (
            <div>
              <video src={message.mediaUrl} controls className="rounded-lg max-w-full mb-2" />
              <p className="text-xs text-zinc-400">{message.content}</p>
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}