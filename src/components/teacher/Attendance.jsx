import React from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { User, CheckCircle } from 'lucide-react';
import { students } from '../../data/mockData';

const Attendance = () => (
  <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: '900px', margin: '0 auto' }}>
    <PopCard>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Mark Daily Attendance</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {students.map((student, idx) => (
          <div key={idx} style={{ padding: '1.25rem 1.5rem', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><User size={20} color="var(--text-muted)"/><span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{student.name}</span></div>
            <div style={{ display: 'flex', gap: '0.5rem' }}><button className="icon-btn" style={{ color: '#10b981', border: '1px solid #10b981', padding: '0.5rem', borderRadius: '50%' }}><CheckCircle size={20} /></button><button className="icon-btn" style={{ color: '#ef4444', border: '1px solid #ef4444', padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>X</button></div>
          </div>
        ))}
      </div>
      <button className="btn primary-btn full-width" style={{ marginTop: '2.5rem', padding: '1rem', fontSize: '1.1rem' }}>Save Attendance Record</button>
    </PopCard>
  </motion.div>
);
export default Attendance;