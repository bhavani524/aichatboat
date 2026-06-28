import React from 'react';

function WelcomeScreen({ onSuggestionClick }) {
  try {
    const suggestions = [
      { icon: 'code', text: 'Write a python script to analyze CSV data' },
      { icon: 'pen-tool', text: 'Draft an email requesting a deadline extension' },
      { icon: 'lightbulb', text: 'Brainstorm marketing ideas for a new app' },
      { icon: 'compass', text: 'Plan a 3-day trip to Tokyo' },
    ];

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-3xl animate-slide-up" data-name="welcome-screen">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
          <div className="icon-sparkles text-3xl"></div>
        </div>
        <h1 className="text-3xl font-semibold mb-12 text-center text-zinc-100">How can I help you today?</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSuggestionClick(item.text)}
              className="flex flex-col items-start text-left p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all group"
            >
              <div className="text-zinc-400 group-hover:text-blue-400 mb-2 transition-colors">
                <div className={`icon-${item.icon} text-xl`}></div>
              </div>
              <span className="text-sm text-zinc-300">{item.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('WelcomeScreen component error:', error);
    return null;
  }
}

export default WelcomeScreen;
