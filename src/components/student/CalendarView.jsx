import React from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants, cardVariants } from '../ui/PopCard';
import { Plus } from 'lucide-react';

const CalendarView = () => (
  <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
      <div><h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-main)' }}>October</h1><h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 300, color: 'var(--text-muted)' }}>2024</h2></div>
    </div>
    <motion.div variants={cardVariants} className="calendar-card">
      <div className="calendar-grid" style={{ marginBottom: '1.25rem' }}>{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => <span key={day} className="calendar-day-header">{day}</span>)}</div>
      <div className="calendar-grid">
        {[...Array(31)].map((_, i) => { 
          const day = i + 1; const isToday = day === 4; const hasDeadline = [12, 18, 26].includes(day); 
          return ( 
            <motion.div key={day} whileHover={{ scale: 1.04, background: 'var(--bg-main)' }} className={`calendar-day-cell ${isToday ? 'today' : ''}`}>
              <span className="calendar-day-num" style={{ color: isToday ? 'var(--accent)' : 'var(--text-main)' }}>{day}</span>
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px', height: '6px' }}>{hasDeadline && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></div>}</div>
            </motion.div> 
          ); 
        })}
      </div>
    </motion.div>
  </motion.div>
);
export default CalendarView;