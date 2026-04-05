import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Edit3, Search, SlidersHorizontal, Beaker, Video, Phone, MoreVertical, Paperclip, Smile, Image as ImageIcon, Bold, Send, FileText, Users, Folder, Calendar as CalendarIcon, ClipboardList } from 'lucide-react';

const Communications = () => {
  const [activeChatId, setActiveChatId] = useState('group-a');
  const [messageInput, setMessageInput] = useState('');
  
  const [chatMessages, setChatMessages] = useState({
    'group-a': [
      { id: 1, sender: 'Elena Vance', avatar: 'E', time: '10:42 AM', text: "I've uploaded the lab results for the photosynthesis experiment.", file: 'Lab_Results_Oct24.pdf', fileSize: '2.4 MB' },
      { id: 2, sender: 'You', time: '10:45 AM', text: "Excellent work, Elena.", isSelf: true }
    ],
    'elena-vance': [{ id: 1, sender: 'Elena Vance', avatar: 'E', time: '9:15 AM', text: "Thank you for the extension!" }],
    'marcus-chen': [{ id: 1, sender: 'Marcus Chen', avatar: 'M', time: 'Yesterday', text: "Here is the updated curriculum.", file: 'curriculum_v2.pdf', fileSize: '1.1 MB' }]
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const newMessage = { id: Date.now(), sender: 'You', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: messageInput, isSelf: true };
    setChatMessages({ ...chatMessages, [activeChatId]: [...(chatMessages[activeChatId] || []), newMessage] });
    setMessageInput('');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ height: 'calc(100vh - 200px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Scholar Stream Inbox</h1>
      </div>
      
      <PopCard style={{ padding: 0, display: 'flex', height: '100%', overflow: 'hidden', background: '#f8fafc' }}>
        
        {/* Inbox List */}
        <div style={{ width: '320px', borderRight: '1px solid var(--border)', background: 'white', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Inbox</h2><button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}><Edit3 size={16}/> Compose</button></div>
          <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '1rem' }}>
            <div onClick={() => setActiveChatId('group-a')} style={{ padding: '1.25rem 1.5rem', background: activeChatId === 'group-a' ? '#f0f9ff' : 'transparent', borderLeft: activeChatId === 'group-a' ? '4px solid #0284c7' : '4px solid transparent', display: 'flex', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ position: 'relative' }}><div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#86efac', color: '#14532d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Beaker size={24}/></div></div>
              <div style={{ flex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}><h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Bio 101 - Group A</h4><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>10:42 AM</span></div><p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>Elena: I've uploaded the lab...</p></div>
            </div>
            <div onClick={() => setActiveChatId('elena-vance')} style={{ padding: '1.25rem 1.5rem', background: activeChatId === 'elena-vance' ? '#f0f9ff' : 'transparent', borderLeft: activeChatId === 'elena-vance' ? '4px solid #0284c7' : '4px solid transparent', display: 'flex', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>E</div>
              <div style={{ flex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}><h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Elena Vance</h4><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>9:15 AM</span></div><p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>Thank you for the extension...</p></div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', borderRight: '1px solid var(--border)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{activeChatId === 'group-a' ? 'Group A' : 'Direct Message'}</h4>
          </div>
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#f8fafc' }}>
            <AnimatePresence>
              {(chatMessages[activeChatId] || []).map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '1rem', alignSelf: msg.isSelf ? 'flex-end' : 'flex-start', maxWidth: '75%', flexDirection: msg.isSelf ? 'row-reverse' : 'row' }}>
                  <div style={{ background: msg.isSelf ? '#0284c7' : 'white', color: msg.isSelf ? 'white' : 'var(--text-main)', padding: '1rem 1.25rem', borderRadius: '16px', borderTopLeftRadius: !msg.isSelf ? 0 : '16px', borderTopRightRadius: msg.isSelf ? 0 : '16px', border: msg.isSelf ? 'none' : '1px solid var(--border)' }}><p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{msg.text}</p></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div style={{ padding: '1.25rem', background: 'white', borderTop: '1px solid var(--border)' }}>
            <form onSubmit={handleSendMessage} style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '24px', display: 'flex', alignItems: 'center', padding: '0.5rem 0.5rem 0.5rem 1.5rem', gap: '1rem' }}>
              <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Write a message..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none' }} />
              <button type="submit" disabled={!messageInput.trim()} style={{ background: messageInput.trim() ? '#0284c7' : '#94a3b8', border: 'none', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, cursor: messageInput.trim() ? 'pointer' : 'default' }}>Send <Send size={16} /></button>
            </form>
          </div>
        </div>
      </PopCard>
    </motion.div>
  );
};
export default Communications;