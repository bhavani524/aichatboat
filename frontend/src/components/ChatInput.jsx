import React from 'react';

function ChatInput({ onSend, isLoading }) {
  try {
    const [text, setText] = React.useState('');
    const [attachments, setAttachments] = React.useState([]);
    const [isListening, setIsListening] = React.useState(false);
    const [voiceError, setVoiceError] = React.useState('');
    const textareaRef = React.useRef(null);
    const fileInputRef = React.useRef(null);
    const recognitionRef = React.useRef(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isVoiceSupported = !!SpeechRecognition;

    // Set up the recognition instance once on mount
    React.useEffect(() => {
      if (!isVoiceSupported) return;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setText(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceError('Microphone access was blocked. Allow it in your browser settings.');
        } else if (event.error === 'no-speech') {
          setVoiceError('No speech detected. Try again.');
        } else {
          setVoiceError('Voice input failed. Please try again.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      return () => {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.abort();
      };
    }, [isVoiceSupported]);

    const handleMicClick = () => {
      if (!isVoiceSupported) {
        setVoiceError('Voice input is not supported in this browser. Try Chrome or Edge.');
        return;
      }

      setVoiceError('');

      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
        return;
      }

      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Could not start speech recognition:', err);
        setVoiceError('Could not start voice input. Please try again.');
      }
    };

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
      }
    };

    React.useEffect(() => {
      adjustHeight();
    }, [text]);

    const handleSubmit = (e) => {
      if (e) e.preventDefault();
      if ((text.trim() || attachments.length > 0) && !isLoading) {
        onSend(text, attachments);
        setText('');
        setAttachments([]);
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const handleFileChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files).map((f) => {
          let type = 'file';
          if (f.type.startsWith('image/')) type = 'image';
          else if (f.type.startsWith('video/')) type = 'video';
          return { type, name: f.name, raw: f };
        });
        setAttachments([...attachments, ...newFiles]);
      }
      // Reset input so the same file can be selected again if needed
      e.target.value = null;
    };

    return (
      <div className="w-full relative" data-name="chat-input">
        <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
        {voiceError && (
          <div className="mb-2 px-4 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg py-1.5">
            {voiceError}
          </div>
        )}
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-3 px-4">
            {attachments.map((att, i) => (
              <div key={i} className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-lg text-sm">
                <div className={`icon-${att.type === 'image' ? 'image' : 'file'} text-zinc-400`}></div>
                <span className="text-zinc-200">{att.name}</span>
                <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="ml-1 text-zinc-500 hover:text-zinc-300">
                  <div className="icon-x text-sm"></div>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[var(--bg-input)] border border-zinc-700/50 rounded-3xl p-2 shadow-sm focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-600 transition-all flex items-end">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 rounded-full transition-colors mb-0.5"
          >
            <div className="icon-paperclip text-lg"></div>
          </button>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Assistant..."
            className="flex-1 bg-transparent border-0 text-zinc-100 placeholder-zinc-500 focus:ring-0 resize-none py-3 px-3 min-h-[48px] max-h-[200px] text-base leading-relaxed"
            rows={1}
          />

          <div className="flex items-center gap-1 mb-0.5">
            <button
              type="button"
              onClick={handleMicClick}
              title={isListening ? 'Stop recording' : 'Start voice input'}
              className={`p-2 rounded-full transition-colors hidden sm:block ${
                isListening
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
              }`}
            >
              <div className={`icon-${isListening ? 'square' : 'mic'} text-lg`}></div>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || (!text.trim() && attachments.length === 0)}
              className={`p-2 rounded-full transition-colors ${
                (text.trim() || attachments.length > 0) && !isLoading
                  ? 'bg-white text-black hover:bg-zinc-200'
                  : 'bg-zinc-700/50 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? <div className="icon-loader animate-spin text-lg text-white"></div> : <div className="icon-arrow-up text-lg"></div>}
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ChatInput component error:', error);
    return null;
  }
}

export default ChatInput;