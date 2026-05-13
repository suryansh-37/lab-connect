import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Users, Paperclip, FileText, Image as ImageIcon, XCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TypingAnimation = () => (
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '8px', padding: '0 4px' }}>
     <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%' }} />
     <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%' }} />
     <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%' }} />
  </div>
);

const GroupChat = ({ subject, userName, userRole, onBack, isEmbedded }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeMembers, setActiveMembers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const chatBottomRef = useRef(null);

  const activeRoomId = subject || 'General';
  const activeSender = userName || (userRole === 'Teacher' ? 'Professor' : 'Student');
  const isHostActive = userRole === 'Teacher';

  const fetchMessages = async () => {
      try {
          const q = new URLSearchParams({ sender: activeSender, isTyping: isTyping.toString(), isHost: isHostActive.toString() });
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/messages/${encodeURIComponent(activeRoomId)}?${q}`);
          if (res.ok) {
              const data = await res.json();
              setMessages(data.messages);
              setActiveMembers(data.members);
          }
      } catch (err) {
          console.error("Failed to fetch messaging logs.");
      }
  };

  // Check if session is still alive (for students/guests)
  const checkSessionAlive = async () => {
      if (isHostActive || sessionEnded) return;
      try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sessions/status/${encodeURIComponent(activeRoomId)}`);
          if (res.ok) {
              const data = await res.json();
              if (!data.active) {
                  setSessionEnded(true);
              }
          }
      } catch (err) {}
  };

  useEffect(() => {
      fetchMessages();
      checkSessionAlive();
      const msgInterval = setInterval(fetchMessages, 2500);
      const aliveInterval = setInterval(checkSessionAlive, 3000);
      return () => { clearInterval(msgInterval); clearInterval(aliveInterval); };
  }, [activeRoomId, isTyping, sessionEnded]); 

  useEffect(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const pushMessageNative = async (payloadOverride) => {
    const defaultPayload = {
        roomId: activeRoomId, sender: activeSender, text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isSystem: false
    };
    
    try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/messages`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...defaultPayload, ...payloadOverride })
        });
        fetchMessages(); 
    } catch(e) {
        console.error("Transmission blocked.");
    }
  };

  const handleTerminateSession = async () => {
      try {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sessions/by-title/${encodeURIComponent(activeRoomId)}`, { method: 'DELETE' });
          setShowTerminateConfirm(false);
          onBack();
      } catch (e) {
          console.error('Failed to terminate session.');
      }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const textOverride = input;
    setInput('');
    pushMessageNative({ text: textOverride });
  };

  const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              pushMessageNative({
                  text: file.type.startsWith('image/') ? 'Shared a photograph.' : 'Shared an attachment.',
                  file: file.name,
                  fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                  fileData: reader.result
              });
          };
          reader.readAsDataURL(file);
          setShowAttachMenu(false);
          e.target.value = '';
      }
  };

  return (
    <motion.div 
      style={{ padding: 0, height: isEmbedded ? '100%' : 'calc(100vh - 72px)', maxHeight: isEmbedded ? '100%' : 'calc(100vh - 72px)', width: '100%', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Session Ended Overlay (for students/guests) */}
      <AnimatePresence>
        {sessionEnded && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15,23,42,0.95)', zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', backdropFilter: 'blur(8px)' }}
          >
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', bounce: 0.4 }} style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '420px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <XCircle size={36} color="#ef4444" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1e293b' }}>Session Ended</h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>The host has terminated this session. All chat messages have been cleared.</p>
              <motion.button onClick={onBack} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '0.9rem 2.5rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}>
                <ArrowLeft size={18} /> Go Back
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminate Confirmation Modal (for teacher/host) */}
      <AnimatePresence>
        {showTerminateConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15,23,42,0.7)', zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowTerminateConfirm(false)}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', bounce: 0.3 }} onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '2.5rem', maxWidth: '400px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <AlertTriangle size={32} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1e293b' }}>Terminate Session?</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>This will permanently end the session and delete all chat messages. All connected students will be disconnected.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <motion.button onClick={() => setShowTerminateConfirm(false)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</motion.button>
                <motion.button onClick={handleTerminateSession} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Terminate</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Overlay */}
      <AnimatePresence>
        {previewImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.92)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}
            onClick={() => setPreviewImage(null)}
          >
             <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>&times;</div>
             <motion.img 
               initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: "spring", bounce: 0.3 }}
               src={previewImage} alt="Fullscreen Preview" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 10px 50px rgba(0,0,0,0.5)' }} 
             />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: '100%', minHeight: 0, maxHeight: '100%', borderRadius: 0, border: 'none', boxShadow: 'none', display: 'flex', flexDirection: 'row', flex: 1, background: '#f8fafc', overflow: 'hidden' }}>
        
        {/* Fixed Sidebar */}
        <aside className="chat-sidebar" style={{ background: 'white', borderRight: '1px solid var(--border)', width: 'clamp(260px, 20%, 350px)' }}>
          <div className="sidebar-header" style={{ borderBottom: '1px solid var(--border)', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 800, margin: 0 }}><Users size={18} color="#0284c7" /> Class Members</h3>
          </div>
          <ul className="participant-list" style={{ padding: '1rem', listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <AnimatePresence>
              {Object.keys(activeMembers)
                .sort((a, b) => {
                    if (activeMembers[a].isHost && !activeMembers[b].isHost) return -1;
                    if (!activeMembers[a].isHost && activeMembers[b].isHost) return 1;
                    if (a === activeSender) return -1;
                    if (b === activeSender) return 1;
                    return a.localeCompare(b);
                })
                .map(memberName => {
                 const memberDetails = activeMembers[memberName];
                 const isMe = memberName === activeSender;
                 return (
                    <motion.li key={memberName} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', borderRadius: '12px', background: isMe ? 'white' : '#f0f9ff', border: isMe ? '1px solid var(--border)' : '1px solid transparent' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: isMe ? '50%' : '10px', background: isMe ? '#10b981' : (memberDetails.isHost ? '#f59e0b' : '#e0f2fe'), color: isMe ? 'white' : (memberDetails.isHost ? 'white' : '#0284c7'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {memberName.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                         <span style={{ fontWeight: isMe ? 600 : 700, fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                             {memberName}
                             {memberDetails.isHost && <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#b45309', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>HOST</span>}
                             {isMe && !memberDetails.isHost && <span style={{ fontSize: '0.65rem', background: '#f1f5f9', color: '#64748b', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>YOU</span>}
                         </span>
                         {memberDetails.isTyping && !isMe && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: '0.75rem', color: '#10b981', fontStyle: 'italic', marginTop: '0.2rem' }}>typing...</motion.span>
                         )}
                      </div>
                    </motion.li>
                 );
              })}
            </AnimatePresence>
          </ul>
        </aside>

        {/* Main Chat Area */}
        <section className="chat-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, maxHeight: '100%', background: 'white' }}>
          
          <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', flexShrink: 0 }}>
            <div className="chat-header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <motion.button onClick={onBack} whileHover={{ scale: 1.05, backgroundColor: "var(--border)" }} whileTap={{ scale: 0.95 }} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <ArrowLeft size={20} color="#475569" />
              </motion.button>
              <div>
                 <h2 style={{ fontWeight: 800, fontSize: '1.15rem', margin: 0 }}>{activeRoomId}</h2>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#10b981', fontWeight: 600, marginTop: '0.2rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 5px rgba(16,185,129,0.5)' }} /> Global Feed
                 </div>
              </div>
            </div>
            {isHostActive && (
              <motion.button onClick={() => setShowTerminateConfirm(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', padding: '0.6rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}>
                <XCircle size={16} /> Terminate Session
              </motion.button>
            )}
          </div>
          
          <div style={{ flex: 1, minHeight: 0, maxHeight: '100%', padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#f8fafc' }}>
            {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}><i>This session log is radically empty. Drop a document block to start securely.</i></div>
            ) : (
             <AnimatePresence>
               {messages.map((msg) => {
                 const isSelf = msg.sender === activeSender;
                 return (
                 <motion.div key={msg._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '1rem', alignSelf: isSelf ? 'flex-end' : 'flex-start', maxWidth: '75%', flexDirection: isSelf ? 'row-reverse' : 'row' }}>
                   <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: isSelf ? '#10b981' : '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                     {isSelf ? 'Y' : msg.sender.charAt(0).toUpperCase()}
                   </div>
                   <div>
                       {!isSelf && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block', marginLeft: '0.5rem' }}>{msg.sender}</span>}
                       <div style={{ background: isSelf ? '#0ea5e9' : 'white', color: isSelf ? 'white' : 'var(--text-main)', padding: '1rem 1.25rem', borderRadius: '18px', borderTopLeftRadius: !isSelf ? 0 : '18px', borderTopRightRadius: isSelf ? 0 : '18px', border: isSelf ? 'none' : '1px solid #e2e8f0', position: 'relative', boxShadow: '0 3px 10px rgba(0,0,0,0.04)' }}>
                         
                         {msg.fileData && msg.fileData.startsWith('data:image/') && (
                            <img onClick={() => setPreviewImage(msg.fileData)} src={msg.fileData} alt="attachment" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '12px', cursor: 'zoom-in', marginBottom: '0.5rem', objectFit: 'contain', background: 'rgba(0,0,0,0.05)', display: 'block' }} />
                         )}

                         <p style={{ fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>{msg.text}</p>
                         
                         {msg.file && (!msg.fileData || !msg.fileData.startsWith('data:image/')) && (
                           <a href={msg.fileData || '#'} download={msg.file} style={{ textDecoration: 'none', color: 'inherit' }}>
                             <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: isSelf ? 'rgba(255,255,255,0.15)' : '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'background 0.2s' }}>
                                <FileText size={20} />
                                <div>
                                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{msg.file}</div>
                                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{msg.fileSize}</div>
                                </div>
                             </div>
                           </a>
                         )}
                         <span style={{ fontSize: '0.7rem', display: 'block', marginTop: '0.5rem', opacity: 0.7, textAlign: 'right' }}>{msg.time}</span>
                       </div>
                   </div>
                 </motion.div>
                 );
               })}

               {Object.keys(activeMembers).map(memberName => {
                   if (memberName !== activeSender && activeMembers[memberName].isTyping) {
                       return (
                         <motion.div key={`typing-${memberName}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }} style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start', maxWidth: '75%', flexDirection: 'row' }}>
                           <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                             {memberName.charAt(0).toUpperCase()}
                           </div>
                           <div>
                               <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block', marginLeft: '0.5rem' }}>{memberName}</span>
                               <div style={{ background: 'white', padding: '1rem 1.25rem', borderRadius: '18px', borderTopLeftRadius: 0, border: '1px solid #e2e8f0', boxShadow: '0 3px 10px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center' }}>
                                 <TypingAnimation />
                               </div>
                           </div>
                         </motion.div>
                       );
                   }
                   return null;
               })}
             </AnimatePresence>
            )}
            <div ref={chatBottomRef}></div>
          </div>

          <div style={{ padding: '1.5rem', background: '#ffffff', borderTop: '1px solid var(--border)', boxShadow: '0 -4px 20px rgba(0,0,0,0.02)', flexShrink: 0 }}>
            <form onSubmit={handleSend} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '30px', display: 'flex', alignItems: 'center', padding: '0.5rem 0.5rem 0.5rem 1rem', gap: '0.5rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
              
              <div style={{ position: 'relative' }}>
                <button type="button" onClick={() => setShowAttachMenu(!showAttachMenu)} style={{ background: 'transparent', border: 'none', color: '#64748b', margin: 0, padding: '0.5rem', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#0284c7'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'} title="Attach Document">
                  <Paperclip size={20} style={{ transform: showAttachMenu ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </button>
                
                <AnimatePresence>
                  {showAttachMenu && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: '10px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '220px', zIndex: 50, border: '1px solid var(--border)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '10px', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} /></div>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>PDF / Doc</span>
                        <input type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={handleFileUpload} />
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '10px', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={18} /></div>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>Media Core</span>
                        <input type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <input 
                 type="text" 
                 value={input} 
                 onChange={(e) => {
                     setInput(e.target.value);
                     setIsTyping(true);
                     clearTimeout(window.activeTypingTimeout);
                     window.activeTypingTimeout = setTimeout(() => setIsTyping(false), 2000);
                 }} 
                 placeholder="Type your broadcast message right here..." 
                 style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '0.5rem', fontSize: '0.95rem', color: 'var(--text-main)' }} 
              />
              
              <motion.button type="submit" disabled={!input.trim()} style={{ background: input.trim() ? '#0ea5e9' : '#cbd5e1', border: 'none', color: 'white', height: '42px', width: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, cursor: input.trim() ? 'pointer' : 'default', transform: input.trim() ? 'scale(1.05)' : 'scale(1)' }} whileHover={{ scale: input.trim() ? 1.1 : 1 }} whileTap={{ scale: 0.9 }}>
                <Send size={18} style={{ marginLeft: '2px' }} />
              </motion.button>
            </form>
          </div>

        </section>
      </div>
    </motion.div>
  );
};
export default GroupChat;