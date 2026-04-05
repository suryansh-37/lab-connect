import React from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Zap, MessageSquare, MoreVertical } from 'lucide-react';
import { students, getScoreColor } from '../../data/mockData';

export const Engagement = () => (
  <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Student Engagement Audit</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {students.map(student => (
        <PopCard key={student.id} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}><div style={{ width: '50px', height: '50px', borderRadius: '50%', background: student.statusBg, color: student.statusColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>{student.avatar}</div><div style={{flex: 1}}><h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{student.name}</h4><span style={{ fontSize: '0.8rem', color: student.lastActive.includes('Now') ? '#10b981' : 'var(--text-muted)', fontWeight: 600 }}>{student.lastActive}</span></div></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-main)', padding: '1.5rem 1rem', borderRadius: '12px', marginBottom: '1.5rem' }}><div style={{textAlign: 'center'}}><Zap size={18} color="#f59e0b" style={{marginBottom:'0.5rem'}}/><h5 style={{fontSize: '1.5rem', fontWeight: 800}}>{student.engagement}%</h5><span style={{fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Activity Score</span></div><div style={{textAlign: 'center'}}><MessageSquare size={18} color="#0284c7" style={{marginBottom:'0.5rem'}}/><h5 style={{fontSize: '1.5rem', fontWeight: 800}}>{student.chat}</h5><span style={{fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Chat Interactions</span></div></div>
          <button style={{ background: '#0284c7', color: 'white', border: 'none', padding: '1rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.95rem', width: '100%', cursor: 'pointer' }}>View Full Timeline</button>
        </PopCard>
      ))}
    </div>
  </motion.div>
);

export const Performance = () => (
  <motion.div variants={containerVariants} initial="hidden" animate="show">
    <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Student Achievement Matrix</h1>
    <PopCard style={{ padding: '0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead><tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}><th style={{ padding: '1.5rem', fontWeight: 700 }}>Student</th><th style={{ padding: '1.5rem 1rem', fontWeight: 700 }}>Average Grade</th><th style={{ padding: '1.5rem 1rem', fontWeight: 700 }}>Assignment Comp.</th><th style={{ padding: '1.5rem 1rem', fontWeight: 700 }}>Subject Mastery</th><th style={{ padding: '1.5rem 1rem', fontWeight: 700 }}>Support Tickets</th><th style={{ padding: '1.5rem', fontWeight: 700 }}>Status</th></tr></thead>
        <tbody>{students.map((student, i) => ( <tr key={student.id} style={{ borderBottom: i !== students.length - 1 ? '1px solid var(--border)' : 'none' }}><td style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}><div style={{ width: '35px', height: '35px', borderRadius: '50%', background: student.statusBg, color: student.statusColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{student.avatar}</div><p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{student.name}</p></td><td style={{ padding: '1.5rem', fontSize: '1rem', fontWeight: 800, color: '#0284c7' }}>{student.grade}</td><td style={{ padding: '1.5rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem'}}><div style={{flex: 1, height: '6px', background: 'var(--bg-main)', borderRadius: '3px'}}><div style={{height: '100%', width: `${student.comp}%`, background: '#10b981', borderRadius: '3px'}}></div></div> <span style={{fontSize: '0.8rem', fontWeight: 600}}>{student.comp}%</span></div></td><td style={{ padding: '1.5rem', fontSize: '0.9rem', fontWeight: 700, color: getScoreColor(student.comp) }}>{student.comp}%</td><td style={{ padding: '1.5rem', fontSize: '1rem', fontWeight: 800, color: student.issues > 1 ? '#ef4444' : 'var(--text-muted)' }}>{student.issues}</td><td style={{ padding: '1.5rem' }}><span style={{ background: student.statusBg, color: student.statusColor, padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>{student.status}</span></td></tr> ))}</tbody>
      </table>
    </PopCard>
  </motion.div>
);