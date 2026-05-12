import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Video, Edit2, AlertTriangle, AlertCircle } from 'lucide-react';

const MeetingsView = () => {
  const [meetings, setMeetings] = useState([]);
  const [newMeeting, setNewMeeting] = useState({ _id: null, title: '', classGroup: 'Bio 101 - Group A', date: '', time: '', link: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchMeetings = async () => {
      try {
          const res = await fetch(`http://${window.location.hostname}:5000/api/sessions`);
          const data = await res.json();
          if (res.ok) setMeetings(data);
      } catch (err) {
          setErrorMsg("Failed to synchronize active sessions from backend server.");
      }
  };

  useEffect(() => {
      fetchMeetings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newMeeting.title) return;
    setIsLoading(true);
    
    try {
        if (newMeeting._id) {
            // Technically just local array update since backend PUT wasn't built yet, but we will mock update for now
            setMeetings(meetings.map(m => m._id === newMeeting._id ? newMeeting : m));
        } else {
            const res = await fetch(`http://${window.location.hostname}:5000/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newMeeting, createdBy: 'Class Admin' })
            });
            if (res.ok) fetchMeetings();
        }
        setNewMeeting({ _id: null, title: '', classGroup: 'Bio 101 - Group A', date: '', time: '', link: '' });
    } catch(e) {
        setErrorMsg("Failed to communicate session to MongoDB.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
      try {
          const res = await fetch(`http://${window.location.hostname}:5000/api/sessions/${id}`, { method: 'DELETE' });
          if (res.ok) fetchMeetings();
      } catch(e) {
          setErrorMsg("Could not delete from database.");
      }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Live Classroom Meetings</h1>
      </div>

      {errorMsg && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><AlertCircle size={18}/> {errorMsg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.3fr', gap: '2rem' }}>
        
        {/* CREATE PORTAL */}
        <PopCard style={{ height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{newMeeting._id ? 'Edit Meeting' : 'Schedule Meeting'}</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
             <input type="text" placeholder="Title" value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} required />
             
             <select value={newMeeting.classGroup} onChange={e => setNewMeeting({...newMeeting, classGroup: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'white' }}>
               <option value="General">Global / General</option>
               <option value="Bio 101 - Group A">Bio 101 - Group A</option>
               <option value="Bio 101 - Group B">Bio 101 - Group B</option>
               <option value="Chem 201 - Advanced">Chem 201 - Advanced</option>
             </select>

             <div style={{ display: 'flex', gap: '1rem'}}>
               <input type="date" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', flex: 1 }} required />
               <input type="time" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', flex: 1 }} required />
             </div>
             
             <input type="url" placeholder="Direct Zoom/Meet Link" value={newMeeting.link} onChange={e => setNewMeeting({...newMeeting, link: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} required />
             
             <button type="submit" className="btn primary-btn full-width" disabled={isLoading}>{isLoading ? 'Saving...' : (newMeeting._id ? 'Update' : 'Schedule Live')}</button>
          </form>
        </PopCard>

        {/* ACTIVE MEETINGS STREAM */}
        <motion.div variants={containerVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {meetings.filter(m => !m.isTempChat).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}><i>No active zoom meetings currently mapped to database.</i></div>
          ) : (
             <AnimatePresence>
               {meetings.filter(m => !m.isTempChat).map(m => (
                 <PopCard key={m._id} style={{ display: 'flex', padding: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }} exit={{opacity: 0, x: 20}}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                       <div style={{ background: '#e0f2fe', padding: '1rem', borderRadius: '12px', color: '#0284c7', flexShrink: 0 }}><Video size={24}/></div>
                       <div>
                           <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.4rem' }}>{m.title}</h4>
                           <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '6px', color: '#475569', marginRight: '0.6rem' }}>{m.classGroup || 'General'}</span>
                           <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.date} at {m.time}</span>
                           <div style={{ marginTop: '0.4rem', background: '#f8fafc', border: '1px solid var(--border)', padding: '0.3rem 0.6rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>GUEST PASS:</span>
                              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0284c7', letterSpacing: '1px' }}>{m.otp}</span>
                           </div>
                       </div>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <a href={m.link} target="_blank" rel="noopener noreferrer" className="btn primary-btn" style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem' }}>Join Live</a>
                       <button onClick={() => setNewMeeting(m)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={18}/></button>
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
export default MeetingsView;