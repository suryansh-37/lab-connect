import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Volume2, Globe } from 'lucide-react';

export const AIAssistant = () => {
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<{sender: 'user' | 'ai', text: string}[]>([
    { sender: 'ai', text: "Hello! I'm Dr. Atom. I can explain complex topics, translate text, or help you brainstorm. I won't do your homework, but I'll help you understand it! 🧠" }
  ]);

  const handleSend = () => {
    if(!query.trim()) return;
    const newChat = [...chat, { sender: 'user' as const, text: query }];
    setChat(newChat);
    setQuery('');
    
    // Mock AI Response
    setTimeout(() => {
      setChat(prev => [...prev, { sender: 'ai', text: "That's a great question! Let's break it down step-by-step..." }]);
    }, 1000);
  };

  return (
    <div className="ai-container">
      <div className="ai-header">
        <div className="ai-avatar-pulse"><Bot size={24} /></div>
        <div>
          <h3>AI Learning Partner</h3>
          <small>Powered by LabConnect Intelligence</small>
        </div>
        <div className="ai-actions">
           <button title="Read Aloud"><Volume2 size={16}/></button>
           <button title="Translate"><Globe size={16}/></button>
        </div>
      </div>

      <div className="ai-messages">
        <AnimatePresence>
          {chat.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`ai-bubble ${msg.sender}`}
            >
              {msg.sender === 'ai' && <Sparkles size={14} className="ai-sparkle"/>}
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="ai-input-area">
        <input 
          type="text" 
          placeholder="Ask for an explanation..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}><Send size={18}/></button>
      </div>
    </div>
  );
};