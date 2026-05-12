import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Send, Bot, Sparkles, BookOpen, HelpCircle, Lightbulb, Copy, Check } from 'lucide-react';

const MarkdownLite = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {lines.map((line, i) => {
        // Code blocks
        if (line.startsWith('```')) return null; 
        
        // Tables (Basic support)
        if (line.trim().startsWith('|') && line.includes('---')) return <hr key={i} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }} />;
        if (line.trim().startsWith('|')) {
          const cells = line.split('|').filter(c => c.trim() !== '');
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: `repeat(${cells.length}, 1fr)`, gap: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
              {cells.map((cell, ci) => <div key={ci} style={{ fontWeight: i === 0 ? 800 : 400 }}>{formatLine(cell.trim())}</div>)}
            </div>
          );
        }

        // Lists
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return <li key={i} style={{ marginLeft: '1.25rem', listStyleType: 'disc' }}>{formatLine(line.trim().substring(2))}</li>;
        }
        if (/^\d+\./.test(line.trim())) {
          return <li key={i} style={{ marginLeft: '1.25rem', listStyleType: 'decimal' }}>{formatLine(line.trim().replace(/^\d+\.\s*/, ''))}</li>;
        }
        
        // Headers
        if (line.startsWith('### ')) return <h4 key={i} style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '1rem', color: '#1e293b' }}>{formatLine(line.substring(4))}</h4>;
        if (line.startsWith('## ')) return <h3 key={i} style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '1.25rem', color: '#0f172a' }}>{formatLine(line.substring(3))}</h3>;

        return <p key={i} style={{ margin: 0, minHeight: line.trim() === '' ? '0.5rem' : '0' }}>{formatLine(line)}</p>;
      })}
    </div>
  );
};

// Typewriter effect component
const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = React.useState('');
  React.useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [text]);
  return <MarkdownLite text={displayedText} />;
};

const formatLine = (line) => {
  const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 800, color: '#0f172a' }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} style={{ background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e11d48' }}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const AIAssistant = () => {
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'AI Assistant', time: 'Just now', text: "Hello! I'm your study assistant. Ask me anything about your courses, assignments, or study tips. I'm here to help! 🎓", isSelf: false },
  ]);

  const quickPrompts = [
    { icon: <BookOpen size={16} />, text: 'Explain a concept', color: '#0284c7' },
    { icon: <HelpCircle size={16} />, text: 'Help with assignment', color: '#8b5cf6' },
    { icon: <Lightbulb size={16} />, text: 'Study tips', color: '#f59e0b' },
    { icon: <Sparkles size={16} />, text: 'Summarize notes', color: '#10b981' },
  ];

  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    const userText = messageInput;
    const userMsg = { id: Date.now(), sender: 'You', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: userText, isSelf: true };
    setChatMessages(prev => [...prev, userMsg]);
    setMessageInput('');
    setIsTyping(true);

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const promptWithSystem = `System: You are an expert AI Study Assistant. Structure your responses clearly with bolding (**text**), bullet points (-) or numbered lists (1.), and headers (## or ###). Keep explanations educational, professional, and clear.
      
      User Question: ${userText}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptWithSystem }] }] })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || `API Error ${response.status}`);
      if (!data.candidates || data.candidates.length === 0) throw new Error("No response generated.");

      const aiText = data.candidates[0].content.parts[0].text;

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'AI Assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiText,
        isSelf: false
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Error:", err);
      const aiMsg = {
        id: Date.now() + 1, sender: 'AI Assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Error: ${err.message}. Please verify Gemini 2.5 Flash access for this key.`,
        isSelf: false
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setMessageInput(promptText);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bot size={32} color="#8b5cf6" /> AI Study Assistant
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Your personal tutor — ask questions, get explanations, and get help with assignments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Chat Area */}
        <PopCard style={{ display: 'flex', flexDirection: 'column', height: '65vh', padding: 0, overflow: 'hidden' }}>
          {/* Chat header */}
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Bot size={20} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>AI Study Assistant</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: isTyping ? '#3b82f6' : '#10b981', fontWeight: 600 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isTyping ? '#3b82f6' : '#10b981', animation: isTyping ? 'pulse 1s infinite' : 'none' }} /> {isTyping ? 'Thinking...' : 'Online'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <AnimatePresence>
              {chatMessages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isSelf ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    background: msg.isSelf ? '#0284c7' : '#ffffff',
                    color: msg.isSelf ? '#ffffff' : 'var(--text-main)',
                    padding: '1.25rem 1.5rem', borderRadius: '18px',
                    borderBottomRightRadius: msg.isSelf ? 0 : '18px',
                    borderBottomLeftRadius: !msg.isSelf ? 0 : '18px',
                    maxWidth: '90%',
                    border: msg.isSelf ? 'none' : '1px solid #e2e8f0',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    position: 'relative'
                  }}>
                    {msg.isSelf ? (
                      <p style={{ fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{msg.text}</p>
                    ) : (
                      <div style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                        {msg.id === chatMessages[chatMessages.length - 1].id ? <TypewriterText text={msg.text} /> : <MarkdownLite text={msg.text} />}
                        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.5rem' }}>
                          <button 
                            onClick={() => { navigator.clipboard.writeText(msg.text); alert("Copied!"); }}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}
                          >
                            <Copy size={12} /> Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.4rem', padding: '0 0.25rem' }}>{msg.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
            <form onSubmit={handleSendMessage} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '24px', display: 'flex', alignItems: 'center', padding: '0.4rem 0.4rem 0.4rem 1.25rem' }}>
              <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Ask me anything about your studies..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.9rem', color: 'var(--text-main)' }} />
              <button type="submit" disabled={!messageInput.trim()} style={{ background: messageInput.trim() ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'var(--text-muted)', border: 'none', color: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: messageInput.trim() ? 'pointer' : 'default', transition: 'all 0.2s' }}>
                <Send size={16} style={{ marginLeft: '-1px' }} />
              </button>
            </form>
          </div>
        </PopCard>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <PopCard style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', color: 'white' }}>
            <Sparkles size={24} style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Quick Prompts</h4>
            <p style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: '1.5' }}>Click a prompt below to get started quickly.</p>
          </PopCard>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {quickPrompts.map((prompt, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleQuickPrompt(prompt.text)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', transition: 'all 0.2s', textAlign: 'left' }}
              >
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: `${prompt.color}15`, color: prompt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {prompt.icon}
                </div>
                {prompt.text}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default AIAssistant;
