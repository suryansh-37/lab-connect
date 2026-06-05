import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Edit3, Search, SlidersHorizontal, Beaker, Video, Phone, MoreVertical, Paperclip, Smile, Image as ImageIcon, Bold, Send, FileText, Users, Folder, Calendar as CalendarIcon, ClipboardList, User, Sparkles } from 'lucide-react';

const Communications = ({ profileData }) => {
  const [activeChatId, setActiveChatId] = useState('global-stream');
  const [messageInput, setMessageInput] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatRooms, setChatRooms] = useState([]);
  const senderName = profileData?.fullName || 'Teacher';

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${activeChatId}?sender=${encodeURIComponent(senderName)}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatRooms = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/sessions`);
      if (res.ok) {
        const data = await res.json();
        setChatRooms(Array.isArray(data) ? data.filter(s => s.isTempChat) : []);
      }
    } catch (err) {
      console.error("Failed to fetch chat rooms", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeChatId]);

  useEffect(() => {
    fetchChatRooms();
    const interval = setInterval(fetchChatRooms, 5000);
    return () => clearInterval(interval);
  }, []);

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
          body: JSON.stringify({ contents: [{ parts: [{ text: `Suggest a short, professional teacher response to this student message: "${lastMsg.text}"` }] }] })
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
      sender: senderName,
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
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
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, maxHeight: '100%' }}>
      <PopCard style={{ padding: 0, display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0, maxHeight: '100%', minWidth: 0, width: '100%', overflow: 'hidden', background: '#f8fafc', border: 'none', borderRadius: 0 }}>
        
        {/* Inbox List */}
        <div style={{ width: 'clamp(260px, 30%, 350px)', height: '100%', flexShrink: 0, borderRight: '1px solid var(--border)', background: 'white', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Inbox</h2><button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}><Edit3 size={16}/> Compose</button></div>
          <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '1rem' }}>
            <div onClick={() => setActiveChatId('global-stream')} style={{ padding: '1.25rem 1.5rem', background: activeChatId === 'global-stream' ? '#f0f9ff' : 'transparent', borderLeft: activeChatId === 'global-stream' ? '4px solid #0284c7' : '4px solid transparent', display: 'flex', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ position: 'relative' }}><div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#86efac', color: '#14532d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Beaker size={24}/></div></div>
              <div style={{ flex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}><h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Global Stream</h4><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Class-wide</span></div><p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>Active classroom communication channel</p></div>
            </div>
            {chatRooms.map(room => (
              <div key={room._id} onClick={() => setActiveChatId(room.title)} style={{ padding: '1.25rem 1.5rem', background: activeChatId === room.title ? '#f0f9ff' : 'transparent', borderLeft: activeChatId === room.title ? '4px solid #0284c7' : '4px solid transparent', display: 'flex', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ position: 'relative' }}><div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={24}/></div></div>
                <div style={{ flex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}><h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{room.title}</h4><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Temp</span></div><p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>Generated Room</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', minWidth: 0, minHeight: 0, maxHeight: '100%' }}>
          <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: activeChatId === 'global-stream' ? '#86efac' : '#e0f2fe', color: activeChatId === 'global-stream' ? '#14532d' : '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                {activeChatId === 'global-stream' ? <Beaker size={24} /> : <Users size={24} />}
              </div>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                  {activeChatId === 'global-stream' ? 'Global Stream' : activeChatId}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#10b981', fontWeight: 600, marginTop: '0.2rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 5px rgba(16,185,129,0.5)' }} /> Active Session
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, maxHeight: '100%', padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#f8fafc' }}>
            <AnimatePresence>
              {messages.map((msg) => {
                const isSelf = msg.sender === senderName;
                return (
                  <motion.div key={msg._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '1rem', alignSelf: isSelf ? 'flex-end' : 'flex-start', maxWidth: '75%', flexDirection: isSelf ? 'row-reverse' : 'row' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: isSelf ? '#0ea5e9' : '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                      {isSelf ? senderName.charAt(0).toUpperCase() : msg.sender.charAt(0)}
                    </div>
                    <div style={{ background: isSelf ? '#0ea5e9' : 'white', color: isSelf ? 'white' : 'var(--text-main)', padding: '1rem 1.25rem', borderRadius: '18px', borderTopLeftRadius: !isSelf ? 0 : '18px', borderTopRightRadius: isSelf ? 0 : '18px', border: isSelf ? 'none' : '1px solid #e2e8f0', position: 'relative', boxShadow: '0 3px 10px rgba(0,0,0,0.04)' }}>
                      <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{msg.text}</p>
                      <span style={{ fontSize: '0.7rem', display: 'block', marginTop: '0.5rem', opacity: 0.7, textAlign: isSelf ? 'right' : 'left' }}>{msg.sender} • {msg.time}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <div style={{ padding: '1.5rem', background: '#ffffff', borderTop: '1px solid var(--border)', boxShadow: '0 -4px 20px rgba(0,0,0,0.02)', flexShrink: 0 }}>
            <form onSubmit={handleSendMessage} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '30px', display: 'flex', alignItems: 'center', padding: '0.5rem 0.5rem 0.5rem 1rem', gap: '0.5rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
              
              {/* Custom WhatsApp-Style Attachment Menu */}
              <div style={{ position: 'relative' }}>
                <button type="button" onClick={() => setShowAttachMenu(!showAttachMenu)} style={{ background: 'transparent', border: 'none', color: '#64748b', margin: 0, padding: '0.5rem', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#0284c7'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'} title="Attach">
                  <Paperclip size={20} style={{ transform: showAttachMenu ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </button>
                
                <AnimatePresence>
                  {showAttachMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: '10px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '220px', zIndex: 50, border: '1px solid var(--border)' }}
                    >
                      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '10px', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} /></div>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>Document</span>
                        <input type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const newMessage = { id: Date.now(), sender: senderName, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: "Here is the requested document.", isSelf: true, file: file.name, fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB' };
                            setMessages([...messages, newMessage]);
                            setShowAttachMenu(false);
                            e.target.value = '';
                          }
                        }} />
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '10px', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={18} /></div>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>Photos & Videos</span>
                        <input type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const newMessage = { id: Date.now(), sender: senderName, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: "Uploaded media file.", isSelf: true, file: file.name, fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB' };
                            setMessages([...messages, newMessage]);
                            setShowAttachMenu(false);
                            e.target.value = '';
                          }
                        }} />
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type your message here..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '0.5rem', fontSize: '0.95rem', color: 'var(--text-main)' }} />
              
              <button type="button" onClick={suggestAI} disabled={isTypingAI || messages.length === 0} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, marginRight: '0.5rem' }}>
                <Sparkles size={16} /> {isTypingAI ? '...' : 'AI Suggest'}
              </button>

              <button type="submit" disabled={!messageInput.trim()} style={{ background: messageInput.trim() ? '#0ea5e9' : '#cbd5e1', border: 'none', color: 'white', height: '42px', width: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, cursor: messageInput.trim() ? 'pointer' : 'default', transform: messageInput.trim() ? 'scale(1.05)' : 'scale(1)' }}><Send size={18} style={{ marginLeft: '2px' }} /></button>
            </form>
          </div>
        </div>
      </PopCard>
    </motion.div>
  );
};
export default Communications;
