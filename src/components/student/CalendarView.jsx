import React from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants, cardVariants } from '../ui/PopCard';
import { Plus } from 'lucide-react';

const CalendarView = () => (
  <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div><h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>October</h1><h2 style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--text-muted)' }}>2024</h2></div>
    </div>
    <motion.div variants={cardVariants} style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '1rem', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--text-muted)' }}>{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => <span key={day} style={{ fontSize: '0.85rem' }}>{day}</span>)}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', textAlign: 'center' }}>
        {[...Array(31)].map((_, i) => { 
          const day = i + 1; const isToday = day === 4; const hasDeadline = [12, 18, 26].includes(day); 
          return ( 
            <motion.div key={day} whileHover={{ scale: 1.05, background: 'var(--bg-main)' }} style={{ minHeight: '90px', padding: '1.5rem 0', borderRadius: '16px', border: isToday ? '2px solid var(--accent)' : '1px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: isToday ? 'var(--accent)' : 'var(--text-main)' }}>{day}</span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', height: '6px' }}>{hasDeadline && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></div>}</div>
            </motion.div> 
          ); 
        })}
      </div>
    </motion.div>
  </motion.div>
);
export default CalendarView;