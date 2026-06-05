import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Zap, MessageCircle, AlertTriangle, Users } from 'lucide-react';

const TempLabSession = ({ onOpenInternalChat }) => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newlyGeneratedOtp, setNewlyGeneratedOtp] = useState(null);

  const fetchTempSessions = async () => {
      try {
          const res = await fetch(`${API_BASE_URL}/api/sessions`);
          const data = await res.json();
          if (res.ok) {
              setSessions(Array.isArray(data) ? data : []);
          }
      } catch (err) {
          console.error("Failed to synchronize active sessions.");
      }
  };

  useEffect(() => { fetchTempSessions(); }, []);

  const handleCreateTempSession = async (isChat) => {
    if (!newTitle.trim()) return;
    setIsLoading(true);
    
    try {
        const payload = { 
            title: newTitle, 
            isTempChat: isChat, 
            classGroup: 'General', 
            date: new Date().toLocaleDateString(), 
            time: new Date().toLocaleTimeString(), 
            link: isChat ? 'live-chat-internal' : `https://meet.google.com/sys-${Math.random().toString(36).substring(2,6)}`,
            createdBy: 'Instructor'
        };
        const res = await fetch(`${API_BASE_URL}/api/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (res.ok) {
            setNewTitle('');
            setNewlyGeneratedOtp({ otp: data.otp, title: data.title, isChat, link: payload.link });
            fetchTempSessions();
        }
    } catch(e) {
        console.error("Generation failed.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
      try {
          await fetch(`${API_BASE_URL}/api/sessions/${id}`, { method: 'DELETE' });
          fetchTempSessions();
      } catch(e) {}
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Temporary Lab Sessions</h1>
              <p style={{ color: 'var(--text-muted)' }}>Explicitly provision generic text-chat rooms directly secured via custom 6-digit Native OTP passes allowing unauthenticated students to quickly Quick-Join bypassing security!</p>
          </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* CREATE PORTAL */}
        <PopCard style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}><Zap color="var(--accent)"/> Generate Session</h2>
             {newlyGeneratedOtp && <button onClick={() => setNewlyGeneratedOtp(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Clear</button>}
          </div>

          {newlyGeneratedOtp && (
             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: '#ecfdf5', border: '1px solid #10b981', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                 <p style={{ color: '#047857', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Session Locked Successfully</p>
                 <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', letterSpacing: '8px' }}>{newlyGeneratedOtp.otp}</div>
                 <p style={{ color: '#047857', fontSize: '0.8rem', marginTop: '0.5rem', marginBottom: '1rem', opacity: 0.8 }}>Provide this securely to your students.</p>
                 {newlyGeneratedOtp.isChat ? (
                    <button onClick={() => onOpenInternalChat(newlyGeneratedOtp.title)} className="btn primary-btn" style={{ background: '#0284c7', padding: '0.6rem 1.5rem', fontSize: '0.9rem', width: '100%' }}>Join Chat Room Now &rarr;</button>
                 ) : (
                    <a href={newlyGeneratedOtp.link} target="_blank" rel="noopener noreferrer" className="btn primary-btn" style={{ background: 'var(--accent)', padding: '0.6rem 1.5rem', fontSize: '0.9rem', width: '100%', textDecoration: 'none', display: 'inline-block' }}>Open External Meet &rarr;</a>
                 )}
             </motion.div>
          )}

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
             <input type="text" placeholder="Session Title (e.g. Physics Q&A)" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} required />
             <div style={{ display: 'flex', gap: '1rem' }}>
               <button type="button" onClick={() => handleCreateTempSession(true)} className="btn primary-btn full-width" disabled={isLoading || !newTitle.trim()} style={{ background: '#10b981', margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0.5rem', gap: '0.5rem', flex: 1 }}>
                 <MessageCircle size={22} /> <span style={{ fontSize: '0.85rem' }}>Temp Chat Room</span>
               </button>
               <button type="button" onClick={() => handleCreateTempSession(false)} className="btn full-width" disabled={isLoading || !newTitle.trim()} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-main)', margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0.5rem', gap: '0.5rem', flex: 1 }}>
                 <Zap size={22} color="var(--accent)"/> <span style={{ fontSize: '0.85rem' }}>External Meet Link</span>
               </button>
             </div>
             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5', textAlign: 'center' }}>Creates a tracked 6-digit OTP passcode for students.</span>
          </form>
        </PopCard>

        {/* ACTIVE TEMP CHATS STREAM */}
        <motion.div variants={containerVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {sessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}><i>No temporary lab sessions are currently active globally.</i></div>
          ) : (
             <AnimatePresence>
               {sessions.map(m => (
                 <PopCard key={m._id} style={{ display: 'flex', padding: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }} exit={{opacity: 0, x: -20}}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                       <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '12px', color: '#ef4444', flexShrink: 0 }}><MessageCircle size={24}/></div>
                       <div>
                           <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.6rem' }}>{m.title}</h4>
                           <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '0.4rem 0.8rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>QUICK JOIN OTP:</span>
                              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ef4444', letterSpacing: '2px' }}>{m.otp}</span>
                           </div>
                       </div>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       {m.isTempChat ? (
                           <button onClick={() => onOpenInternalChat(m.title)} className="btn primary-btn" style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={16}/> Enter Host Chat</button>
                       ) : (
                           <a href={m.link} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'var(--accent)', color: 'white', textDecoration: 'none', fontSize: '0.9rem', padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={16}/> Open Fast Meet</a>
                       )}
                       <button onClick={() => handleDelete(m._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><AlertTriangle size={18}/></button>
                   </div>
                 </PopCard>
               ))}
             </AnimatePresence>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
};
export default TempLabSession;
