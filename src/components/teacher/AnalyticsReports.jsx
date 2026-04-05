import React from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { BarChart2, AlertTriangle, Zap, Download } from 'lucide-react';

export const Analytics = () => (
  <motion.div variants={containerVariants} initial="hidden" animate="show">
    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2.5rem' }}>Advanced Class Intelligence</h1>
    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
      <PopCard><h3 style={{ fontWeight: 700, marginBottom: '2rem' }}>Term Performance Trend</h3><div style={{ height: '300px', background: 'var(--bg-main)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}><BarChart2 size={120} color="#0284c7" style={{opacity: 0.3}}/></div></PopCard>
      <PopCard style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}><h3 style={{ fontWeight: 700 }}>Critical Alerts</h3><div style={{ display: 'flex', gap: '1rem', color: '#ef4444', padding: '1rem', background: '#fee2e2', borderRadius: '12px' }}><AlertTriangle size={24}/><p style={{fontSize: '0.9rem'}}><strong>Attendance Drop:</strong> 4 students fell below 70% attendance this week.</p></div><div style={{ display: 'flex', gap: '1rem', color: '#d97706', padding: '1rem', background: '#fef3c7', borderRadius: '12px' }}><Zap size={24}/><p style={{fontSize: '0.9rem'}}><strong>Low Submission:</strong> Biology 101 homework #3 submissions are at 60%.</p></div></PopCard>
    </div>
  </motion.div>
);

export const Reports = () => (
  <motion.div variants={containerVariants} initial="hidden" animate="show">
    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2.5rem' }}>Automated Reports</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
      {['Term Grades', 'Attendance Audit', 'Engagement Summary', 'Intervention Report'].map(report => (
        <PopCard key={report} style={{ textAlign: 'center', padding: '2.5rem' }}><Download size={48} color="#0284c7" style={{ marginBottom: '1.5rem', margin: '0 auto' }}/><h3 style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '1.3rem' }}>{report}</h3><p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Generated for Q4 - October 2024. Audit ready.</p><button style={{ background: '#e0f2fe', color: '#0284c7', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '25px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>Download PDF</button></PopCard>
      ))}
    </div>
  </motion.div>
);