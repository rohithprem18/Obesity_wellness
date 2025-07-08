import React, { useState, useRef, useEffect } from 'react';

// TODO: Replace with your actual Gemini API key
const GEMINI_API_KEY = 'AIzaSyCuRxausGlkEesNpoc2pwkTlHPjzBtAMfQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY;

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! I am your mental wellness assistant. How are you feeling today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setLoading(true);
    try {
      const res = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
        }),
      });
      const data = await res.json();
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not understand that.';
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, there was an error connecting to Gemini.' }]);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-[60vh] max-h-[500px] bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-2xl max-w-xs ${msg.sender === 'user' ? 'bg-purple-500 text-white ml-auto' : 'bg-gray-200 text-black mr-auto'}`}>{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
        <input
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black bg-white"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-all"
          disabled={loading || !input.trim()}
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}; 