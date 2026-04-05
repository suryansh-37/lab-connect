import React, { useState } from 'react';
import { Send, ArrowLeft, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const GroupChat = ({ subject, onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: `Welcome to the ${subject || 'Subject'} Group Chat.`, time: '09:00 AM' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      sender: 'You',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }]);
    setInput('');
  };

  return (
    <motion.div 
      className="centered-view"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="chat-interface">
        
        {/* Fixed Sidebar */}
        <aside className="chat-sidebar">
          <div className="sidebar-header">
            <h3><Users size={18} /> Class Members</h3>
          </div>
          <ul className="participant-list">
            <motion.li className="participant" whileHover={{ x: 5, backgroundColor: "var(--bg-card)" }}>
              <div className="nav-icon-box" style={{ background: 'var(--accent)', color: 'white' }}>P</div>
              <span>Professor (Admin)</span>
            </motion.li>
            <motion.li className="participant" whileHover={{ x: 5, backgroundColor: "var(--bg-card)" }}>
              <div className="nav-icon-box" style={{ background: '#10b981', color: 'white' }}>Y</div>
              <span>You</span>
            </motion.li>
          </ul>
        </aside>

        {/* Main Chat Area */}
        <section className="chat-area">
          <div className="chat-header">
            {/* UPDATED HEADER LAYOUT HERE */}
            <div className="chat-header-left">
              <motion.button 
                className="chat-back-btn" 
                onClick={onBack}
                whileHover={{ scale: 1.05, backgroundColor: "var(--border)" }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={20} />
              </motion.button>
              <h2>{subject || 'Group Chat'}</h2>
            </div>
          </div>
          
          <div className="messages">
            {messages.map(msg => (
              <motion.div 
                key={msg.id} 
                className={`message-row ${msg.isMe ? 'me' : ''} ${msg.sender === 'System' ? 'system' : ''}`}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {msg.sender !== 'System' && <span className="sender">{msg.sender}</span>}
                <div className="bubble">
                  <p>{msg.text}</p>
                  <span className="time">{msg.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <form className="input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Type your question here..."
            />
            <motion.button 
              type="submit" 
              className="btn primary-btn icon-btn send-btn"
              whileHover={{ scale: 1.05, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
            >
              <Send size={18} />
            </motion.button>
          </form>
        </section>
      </div>
    </motion.div>
  );
};

export default GroupChat;