import React from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';

const AttendanceInsights = () => (
  <motion.div variants={containerVariants} initial="hidden" animate="show">
    <div style={{ marginBottom: '2.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Student Attendance Overview</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Monitoring your academic presence and engagement metrics.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <PopCard style={{ background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div><span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Academic Presence</span><h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Weekly Engagement Flow</h3></div>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>98% Consistent</span>
          </div>
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 2rem' }}>
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: 0.2, stroke: '#0284c7', strokeWidth: 1, fill: 'none' }}><path d="M0 30 Q 20 10, 40 25 T 80 15 T 100 5" /></svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>
        </PopCard>
        <PopCard style={{ background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div><h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Attendance Calendar</h3><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>October 2024</p></div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}><div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#10b981' }}></div> Present</div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}><div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#ef4444' }}></div> Absent</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem', color: 'var(--text-muted)' }}><ChevronLeft size={20}/><ChevronRight size={20}/></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', textAlign: 'center' }}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <span key={d} style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '0.5rem', borderRadius: '8px' }}>{d}</span>)}
            {[...Array(31)].map((_, i) => {
              const day = i + 1; const isSelected = day === 6; const isAbsent = day === 12;
              return (
                <div key={day} style={{ height: '70px', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', border: isSelected ? '2px solid #0284c7' : '1px solid transparent', borderRadius: '12px', background: 'var(--bg-main)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{day}</span>
                  <div style={{ display: 'flex', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isAbsent ? '#ef4444' : '#10b981' }}></div></div>
                </div>
              )
            })}
          </div>
        </PopCard>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <PopCard style={{ background: '#0284c7', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', opacity: 0.9 }}><Award size={20}/><span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>Elite Standing</span></div>
          <h2 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1 }}>94.8%</h2>
          <p style={{ fontSize: '1rem', fontWeight: 600, opacity: 0.9, marginBottom: '2rem' }}>Participation Score</p>
          <div style={{ marginBottom: '2rem' }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}><span>Active Discussions</span><span>24/25</span></div><div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px' }}><div style={{ width: '96%', height: '100%', background: '#10b981', borderRadius: '3px' }}></div></div></div>
          <p style={{ fontStyle: 'italic', fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.9 }}>"Excellence is not an act, but a habit. Your presence defines your progress."</p>
        </PopCard>
        <PopCard style={{ background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Course Specifics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}><span>Advanced UI Principles</span><span style={{ color: '#10b981' }}>98%</span></div><div style={{ width: '100%', height: '6px', background: 'var(--bg-main)', borderRadius: '3px' }}><div style={{ width: '98%', height: '100%', background: '#10b981', borderRadius: '3px' }}></div></div></div>
            <div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}><span>Architectural Theory IV</span><span style={{ color: '#10b981' }}>92%</span></div><div style={{ width: '100%', height: '6px', background: 'var(--bg-main)', borderRadius: '3px' }}><div style={{ width: '92%', height: '100%', background: '#10b981', borderRadius: '3px' }}></div></div></div>
            <div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}><span>Visual Anthropology</span><span style={{ color: '#f59e0b' }}>84%</span></div><div style={{ width: '100%', height: '6px', background: 'var(--bg-main)', borderRadius: '3px' }}><div style={{ width: '84%', height: '100%', background: '#f59e0b', borderRadius: '3px' }}></div></div></div>
          </div>
        </PopCard>
      </div>
    </div>
  </motion.div>
);
export default AttendanceInsights;