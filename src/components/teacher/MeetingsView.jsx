import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Video, Edit2, AlertTriangle } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

const MeetingsView = () => {
  const { meetings, setMeetings } = useContext(AppContext);
  const [newMeeting, setNewMeeting] = useState({ id: null, title: '', date: '', time: '', link: '' });

  const handleSave = (e) => {
    e.preventDefault();
    if (!newMeeting.title) return;
    if (newMeeting.id) setMeetings(meetings.map(m => m.id === newMeeting.id ? newMeeting : m));
    else setMeetings([{ ...newMeeting, id: Date.now() }, ...meetings]);
    setNewMeeting({ id: null, title: '', date: '', time: '', link: '' });
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}><h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Live Classroom Meetings</h1></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.3fr', gap: '2rem' }}>
        <PopCard style={{ height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{newMeeting.id ? 'Edit Meeting' : 'Schedule Meeting'}</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}><input type="text" placeholder="Title" value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} required /><div style={{ display: 'flex', gap: '1rem'}}><input type="date" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', flex: 1 }} required /><input type="time" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', flex: 1 }} required /></div><input type="url" placeholder="Link" value={newMeeting.link} onChange={e => setNewMeeting({...newMeeting, link: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} required /><button type="submit" className="btn primary-btn full-width">{newMeeting.id ? 'Update' : 'Schedule Live'}</button></form>
        </PopCard>
        <motion.div variants={containerVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AnimatePresence>
            {meetings.map(m => (
              <PopCard key={m.id} style={{ display: 'flex', padding: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }} exit={{opacity: 0, y: -20}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}><div style={{ background: '#e0f2fe', padding: '1rem', borderRadius: '12px', color: '#0284c7' }}><Video size={24}/></div><div><h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>{m.title}</h4><p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{m.date} at {m.time}</p></div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><a href={m.link} target="_blank" rel="noopener noreferrer" className="btn primary-btn" style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem' }}>Join Live</a><button onClick={() => setNewMeeting(m)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={18}/></button><button onClick={() => setMeetings(meetings.filter(x => x.id !== m.id))} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><AlertTriangle size={18}/></button></div>
              </PopCard>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default MeetingsView;