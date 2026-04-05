import React from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Award, BookOpen, ChevronRight, Target } from 'lucide-react';

const Overview = ({ setActiveSection, onOpenRoom }) => {
  const teachingLabs = [
    { id: 1, title: 'Advanced Physics', code: 'Dr. Aris Thorne • Room 402', session: '04', progress: 65, status: 'A- GRADE', icon: <Target size={24}/>, banner: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600' },
    { id: 2, title: 'Modernist Poetry', code: 'Prof. Elena Vance • Online', session: '02', progress: 42, status: 'B+ GRADE', icon: <BookOpen size={24}/>, banner: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=600' }
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Welcome back, Alexander</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontStyle: 'italic' }}>"The mind is not a vessel to be filled, but a fire to be kindled."</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <PopCard style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}><Award size={18}/><span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Class Rank</span></div>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>12 <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 450</span></span>
        </PopCard>
        <PopCard style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}><BookOpen size={18}/><span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Credits</span></div>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>94 <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 120</span></span>
        </PopCard>
        <PopCard style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div><span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Weekly Study Goal</span><div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.5rem 0' }}>18.5 / 25 Hours</div><span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Keep going, you're 74% there!</span></div>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.1)', border: '6px solid #0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-main)' }}>74%</div>
        </PopCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <motion.div variants={containerVariants}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}><h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>Enrolled Courses</h2><span onClick={() => setActiveSection('library')} style={{ color: '#0284c7', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>View All Schedule</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {teachingLabs.map((lab) => (
                <PopCard key={lab.id} style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }} onClick={() => onOpenRoom && onOpenRoom('stream', lab.title)}>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                      <div style={{ background: 'rgba(2, 132, 199, 0.1)', padding: '0.8rem', borderRadius: '12px', color: '#0284c7' }}>{lab.icon}</div>
                      <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>{lab.status}</span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{lab.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{lab.code}</p>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-main)', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}><div style={{ width: `${lab.progress}%`, height: '100%', background: '#0284c7' }}></div></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}><span>{lab.progress}% COMPLETE</span><span>MODULES LEFT</span></div>
                  </div>
                </PopCard>
              ))}
            </div>
          </motion.div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <PopCard>
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>Upcoming Deadlines</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}><span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Oct</span><h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>24</h4></div>
                <div style={{ flex: 1 }}><h5 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Lab Report: Thermal Dynamics</h5><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Advanced Physics • 4:00 PM</span></div>
                <ChevronRight size={16} color="var(--text-muted)"/>
              </div>
            </div>
            <button onClick={() => setActiveSection('calendar')} style={{ width: '100%', marginTop: '2rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Open Calendar</button>
          </PopCard>
        </div>
      </div>
    </motion.div>
  );
};
export default Overview;