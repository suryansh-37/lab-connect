import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Video } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

const MeetingsView = () => {
  const { meetings = [] } = useContext(AppContext) || {};
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2.5rem', color: 'var(--text-main)' }}>Live Classes</h1>
      <motion.div variants={containerVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <AnimatePresence>
          {meetings.map(meeting => (
            <PopCard key={meeting.id} style={{ display: 'flex', padding: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }} exit={{opacity: 0, y: -20}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}><div style={{ background: 'rgba(2, 132, 199, 0.1)', padding: '1rem', borderRadius: '12px', color: '#0284c7' }}><Video size={24}/></div><div><h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem', color: 'var(--text-main)' }}>{meeting.title}</h4><p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{meeting.date} at {meeting.time}</p></div></div>
              <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="btn primary-btn" style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem' }}>Join Live</a>
            </PopCard>
          ))}
          {meetings.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No live classes scheduled currently.</p>}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
export default MeetingsView;