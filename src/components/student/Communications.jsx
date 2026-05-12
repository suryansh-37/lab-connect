import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Edit3, Send, Sparkles, Copy } from 'lucide-react';

const formatLine = (line) => {
  const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} style={{ background: 'rgba(0,0,0,0.05)', padding: '0.1rem 0.3rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.9em' }}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const MarkdownLite = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {lines.map((line, i) => {
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return <li key={i} style={{ marginLeft: '1rem', listStyleType: 'disc' }}>{formatLine(line.trim().substring(2))}</li>;
        }
        return <p key={i} style={{ margin: 0 }}>{formatLine(line)}</p>;
      })}
    </div>
  );
};

const Communications = () => {
  const [activeChatId, setActiveChatId] = useState('global-stream');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/messages/${activeChatId}?sender=Alexander (Student)`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setIsLoading(false);
    }
  };

  const [isTypingAI, setIsTypingAI] = useState(false);

  const suggestAI = async () => {
    if (messages.length === 0) return;
    setIsTypingAI(true);
    const lastMsg = messages[messages.length - 1];
    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: `Suggest a short, professional response to this message: "${lastMsg.text}"` }] }] })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || `API Error ${response.status}`);
      const suggestion = data.candidates[0].content.parts[0].text;
      setMessageInput(suggestion.trim());
    } catch (e) {
      console.error("AI Suggest Error", e);
      alert(`AI Helper Error: ${e.message}. Please check your Google Cloud Console for Gemini 2.5 Flash activation.`);
    }
    setIsTypingAI(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const payload = {
      roomId: activeChatId,
      sender: 'Alexander (Student)',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newMessage = await res.json();
        setMessages([...messages, { ...newMessage, isSelf: true }]);
        setMessageInput('');
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ height: 'calc(100vh - 200px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Scholar Stream Inbox</h1>
      </div>
      
      <PopCard style={{ padding: 0, display: 'flex', height: '100%', overflow: 'hidden', background: 'var(--bg-main)' }}>
        <div style={{ width: '320px', borderRight: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Inbox</h2><button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}><Edit3 size={16}/> Compose</button></div>
          <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '1rem' }}>
            <div onClick={() => setActiveChatId('global-stream')} style={{ padding: '1.25rem 1.5rem', background: activeChatId === 'global-stream' ? 'rgba(2, 132, 199, 0.1)' : 'transparent', borderLeft: activeChatId === 'global-stream' ? '4px solid #0284c7' : '4px solid transparent', display: 'flex', gap: '1rem', cursor: 'pointer' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>GS</div>
              <div style={{ flex: 1 }}><h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Global Stream</h4><p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Class-wide communication</p></div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}><h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>{activeChatId === 'global-stream' ? 'Global Stream' : activeChatId}</h4></div>
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-main)' }}>
            <AnimatePresence>
              {messages.map((msg) => {
                const isSelf = msg.sender === 'Alexander (Student)';
                return (
                  <motion.div key={msg._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '1rem', alignSelf: isSelf ? 'flex-end' : 'flex-start', maxWidth: '75%', flexDirection: isSelf ? 'row-reverse' : 'row' }}>
                    <div style={{ background: isSelf ? '#0284c7' : 'var(--bg-card)', color: isSelf ? 'white' : 'var(--text-main)', padding: '1rem 1.25rem', borderRadius: '16px', borderTopLeftRadius: !isSelf ? 0 : '16px', borderTopRightRadius: isSelf ? 0 : '16px', border: isSelf ? 'none' : '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{msg.text}</p>
                      <span style={{ fontSize: '0.7rem', color: isSelf ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', alignSelf: 'flex-end' }}>{msg.sender} • {msg.time}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
            <form onSubmit={handleSendMessage} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '24px', display: 'flex', alignItems: 'center', padding: '0.5rem 0.5rem 0.5rem 1.5rem', gap: '1rem' }}>
              <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Write a message..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)' }} />
              <button type="button" onClick={suggestAI} disabled={isTypingAI || messages.length === 0} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700 }}>
                <Sparkles size={16} /> {isTypingAI ? '...' : 'AI Suggest'}
              </button>
              <button type="submit" disabled={!messageInput.trim()} style={{ background: messageInput.trim() ? '#0284c7' : 'var(--text-muted)', border: 'none', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, cursor: messageInput.trim() ? 'pointer' : 'default' }}>Send <Send size={16} /></button>
            </form>
          </div>
        </div>
      </PopCard>
    </motion.div>
  );
};
export default Communications;