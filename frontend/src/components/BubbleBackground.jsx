import React from 'react';

function BubbleBackground() {
  try {
    // Generate random bubbles only once on mount
    const bubbles = React.useMemo(() => {
      return Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        size: Math.random() * 60 + 20, // 20px to 80px
        left: Math.random() * 100, // 0% to 100%
        duration: Math.random() * 15 + 10, // 10s to 25s
        delay: Math.random() * 5, // 0s to 5s
      }));
    }, []);

    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" data-name="bubble-background">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute bottom-[-100px] rounded-full bg-blue-500/20 animate-bubble backdrop-blur-3xl"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
            }}
          />
        ))}
      </div>
    );
  } catch (error) {
    console.error('BubbleBackground component error:', error);
    return null;
  }
}

export default BubbleBackground;
