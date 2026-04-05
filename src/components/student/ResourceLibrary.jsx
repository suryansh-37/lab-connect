import React from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Folder, MoreVertical, FileText, Video, UploadCloud, SlidersHorizontal, Grid, Plus } from 'lucide-react';

const ResourceLibrary = () => {
  const folders = [
    { title: 'Advanced Physics', code: 'PHY-402 • Sem B', count: 42, updated: 'Updated 2h ago', bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
    { title: 'Modernist Poetry', code: 'LIT-210 • Sem A', count: 18, updated: 'Updated yesterday', bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
    { title: 'Ethics in Design', code: 'DES-301 • Elective', count: 24, updated: 'Updated 1w ago', bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
    { title: 'Microeconomics', code: 'ECO-102 • Sem B', count: 31, updated: 'Updated 4h ago', bg: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Library / <span style={{ color: '#0284c7' }}>Course Folders</span></p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Academic Modules</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>Access and organize your curated subject resources.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: 600, cursor: 'pointer' }}><SlidersHorizontal size={16}/> Filter</button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: 600, cursor: 'pointer' }}><Grid size={16}/> Layout</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {folders.map((folder, idx) => (
          <PopCard key={idx} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ background: folder.bg, color: folder.color, padding: '0.75rem', borderRadius: '12px' }}><Folder size={24}/></div>
              <MoreVertical size={20} color="var(--text-muted)"/>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>{folder.title}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '1rem', display: 'block' }}>{folder.code}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: 'auto' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: folder.color }}>{folder.count}</span><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Resources</span>
            </div>
          </PopCard>
        ))}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>Recent Files</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { name: 'Quantum_Tunneling.pdf', size: '2.4 MB', course: 'PHY-402', time: 'Just now', icon: <FileText size={20} color="#ef4444"/>, bg: 'rgba(239, 68, 68, 0.1)' },
            { name: 'Eliot_Notes.docx', size: '842 KB', course: 'LIT-210', time: '1 hour ago', icon: <FileText size={20} color="#3b82f6"/>, bg: 'rgba(59, 130, 246, 0.1)' }
          ].map((file, idx) => (
            <PopCard key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', background: 'var(--bg-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ background: file.bg, padding: '0.8rem', borderRadius: '12px' }}>{file.icon}</div>
                <div><h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{file.name}</h4><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{file.size}</span></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <span style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>{file.course}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', width: '80px', textAlign: 'right' }}>{file.time}</span>
              </div>
            </PopCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
export default ResourceLibrary;