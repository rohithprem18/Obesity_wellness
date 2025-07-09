import React, { useState, useRef } from 'react';
import Sentiment from 'sentiment';

// Custom lexicon for mental wellness
const customLexicon: { [key: string]: number } = {
  anxious: -4,
  anxiety: -4,
  depressed: -5,
  depression: -5,
  hopeless: -4,
  sad: -3,
  lonely: -3,
  stressed: -3,
  overwhelmed: -3,
  tired: -2,
  exhausted: -3,
  panic: -4,
  suicidal: -10,
  worthless: -6,
  empty: -3,
  lost: -2,
  scared: -2,
  worried: -2,
  calm: 3,
  hopeful: 4,
  supported: 3,
  loved: 4,
  happy: 3,
  energetic: 3,
  motivated: 3,
  grateful: 3,
  peaceful: 3,
  relaxed: 3,
  strong: 2,
  resilient: 3,
  safe: 2,
  proud: 2,
  confident: 2,
  joy: 3,
  joyful: 3,
  content: 2,
  positive: 2,
  negative: -2,
  pain: -3,
  painfree: 2,
  healing: 2,
  progress: 2,
  growth: 2,
  therapy: 2,
  therapist: 2,
  medication: 1,
  support: 2,
  friend: 2,
  friends: 2,
  family: 2,
  alone: -2,
  isolated: -3,
  burnout: -4,
  burnt: -3,
  attack: -2,
  crisis: -4,
  help: 1,
  unsafe: -3,
  sleep: 1,
  insomnia: -3,
  nightmare: -3,
  rest: 2,
  restful: 2,
  fatigue: -2,
  unfocused: -2,
  distracted: -2,
  clear: 1,
  unclear: -1,
  foggy: -2,
  sharp: 1,
  dull: -1,
};

const sentiment = new Sentiment();

const positiveResponses = [
  "That's wonderful to hear! Keep embracing the positivity.",
  "You sound upbeat! Remember to celebrate your wins.",
  "Glad you're feeling good. Stay motivated!",
  "Your positive energy is inspiring!",
  "Keep up the great mood!"
];
const negativeResponses = [
  "I'm sorry you're feeling this way. You're not alone—consider reaching out to someone you trust.",
  "It can be tough sometimes. Remember, support is available if you need it.",
  "Your feelings are valid. Take care of yourself and don't hesitate to seek help.",
  "If things feel overwhelming, talking to a professional can help.",
  "Remember, it's okay to ask for help."
];
const neutralResponses = [
  "Thank you for sharing. Let me know if you'd like to talk more.",
  "I'm here to listen whenever you need.",
  "Feel free to share anything on your mind.",
  "I'm always here to support you.",
  "Let me know how I can help."
];

// Mental health keyword detector
const mentalHealthKeywords = [
  'anxious', 'anxiety', 'depressed', 'depression', 'hopeless', 'sad', 'lonely', 'stressed', 'overwhelmed', 'tired', 'exhausted', 'panic', 'suicidal', 'worthless', 'empty', 'lost', 'scared', 'worried', 'burnout', 'crisis', 'insomnia', 'nightmare', 'fatigue', 'unfocused', 'distracted', 'foggy', 'unsafe', 'isolated', 'alone',
  'calm', 'hopeful', 'supported', 'loved', 'happy', 'energetic', 'motivated', 'grateful', 'peaceful', 'relaxed', 'strong', 'resilient', 'safe', 'proud', 'confident', 'joy', 'joyful', 'content', 'positive', 'healing', 'progress', 'growth', 'therapy', 'therapist', 'support', 'friend', 'friends', 'family', 'rest', 'restful', 'focus', 'clear', 'sharp',
];

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatbotProps {
  mode?: 'floating' | 'panel';
  onSentiment?: (sentimentScore: number, sentimentLabel: 'Positive' | 'Negative' | 'Neutral') => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ mode = 'floating', onSentiment }) => {
  const [open, setOpen] = useState(mode === 'panel');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      // Use Sentiment with custom lexicon
      const result = sentiment.analyze(userMessage.text, { extras: customLexicon });
      let sentimentLabel: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
      if (result.score > 0) sentimentLabel = 'Positive';
      else if (result.score < 0) sentimentLabel = 'Negative';
      if (onSentiment) onSentiment(result.score, sentimentLabel);

      // Keyword detection
      const detectedKeywords = mentalHealthKeywords.filter(word =>
        userMessage.text.toLowerCase().includes(word)
      );

      let keywordMsg = '';
      if (detectedKeywords.length > 0) {
        keywordMsg = `\n\nDetected mental health keywords: ${detectedKeywords.join(', ')}`;
        // Add extra empathy for negative keywords
        if (detectedKeywords.some(word => customLexicon[word as keyof typeof customLexicon] && customLexicon[word as keyof typeof customLexicon] < 0)) {
          keywordMsg += '\nIf you are struggling, consider reaching out to a trusted person or professional.';
        }
        // Add encouragement for positive keywords
        if (detectedKeywords.some(word => customLexicon[word as keyof typeof customLexicon] && customLexicon[word as keyof typeof customLexicon] > 0)) {
          keywordMsg += '\nIt’s great to see positive words! Keep it up!';
        }
      }

      let botText = '';
      if (sentimentLabel === 'Positive') botText = getRandom(positiveResponses);
      else if (sentimentLabel === 'Negative') botText = getRandom(negativeResponses);
      else botText = getRandom(neutralResponses);
      setMessages((prev) => [...prev, { sender: 'bot', text: `${sentimentLabel}: ${botText}` }]);
    } catch (e) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error analyzing your message.' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  const chatUI = (
    <div style={{ width: mode === 'panel' ? '100%' : 340, height: mode === 'panel' ? 480 : 440, background: 'white', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: '#2563eb', color: 'white', padding: '12px 16px', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Mental Wellness Chatbot
        {mode === 'floating' && (
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer' }}>&times;</button>
        )}
      </div>
      <div style={{ flex: 1, padding: 16, overflowY: 'auto', background: '#f9fafb' }}>
        {messages.length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>How are you feeling today? Share your thoughts.</div>}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 12, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <div style={{ display: 'inline-block', background: msg.sender === 'user' ? '#2563eb' : '#e5e7eb', color: msg.sender === 'user' ? 'white' : '#222', borderRadius: 16, padding: '8px 14px', maxWidth: 220, wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: 12, borderTop: '1px solid #eee', background: '#fff', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={loading ? 'Analyzing...' : 'Type your message...'}
          disabled={loading}
          style={{ flex: 1, border: '1px solid #ddd', borderRadius: 8, padding: '8px 12px', marginRight: 8 }}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
          Send
        </button>
      </div>
    </div>
  );

  if (mode === 'panel') {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>{chatUI}</div>;
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
      {open ? (
        chatUI
      ) : (
        <button onClick={() => setOpen(true)} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '50%', width: 64, height: 64, fontSize: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.18)', cursor: 'pointer' }}>
          💬
        </button>
      )}
    </div>
  );
};

export default Chatbot;
export const ChatbotPanel = (props: Omit<ChatbotProps, 'mode'>) => <Chatbot {...props} mode="panel" />; 