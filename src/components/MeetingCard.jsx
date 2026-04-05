import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Video, Calendar, Clock, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MeetingCard = ({ meeting, role }) => {
  const { meetings, setMeetings } = useContext(AppContext);
  const handleDelete = () => setMeetings(meetings.filter(m => m.id !== meeting.id));

  return (
    <motion.div className="auth-card" style={{ padding: '1.5rem', marginBottom: '1rem' }} whileHover={{ y: -4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Video color="var(--accent)" size={20} /> {meeting.title}</h3>
        {role === 'Teacher' && <button onClick={handleDelete} className="icon-btn" style={{ color: '#ef4444' }}><Trash2 size={18} /></button>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {meeting.date}</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {meeting.time}</p>
      </div>
      <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="btn full-width" style={{ border: '1px solid var(--accent)', color: 'var(--accent)', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
        Join Meeting
      </a>
    </motion.div>
  );
};

export default MeetingCard;