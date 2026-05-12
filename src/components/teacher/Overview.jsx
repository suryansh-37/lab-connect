import React from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Zap, TrendingUp, MoreVertical, Users, ClipboardList, Lightbulb, Upload } from 'lucide-react';
import { teachingLabs, recentActivity } from '../../data/mockData';

const Overview = ({ setActiveSection, onOpenRoom }) => {
  return (
  <motion.div variants={containerVariants} initial="hidden" animate="show">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
      <div><h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome back, Professor Jenkins</h1><p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>You have 12 assignments to grade and 3 classes today.</p></div>
      <div style={{ background: '#fef3c7', color: '#854d0e', padding: '0.75rem 1.5rem', borderRadius: '25px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={18}/> Next Class: Bio 101</div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
      <PopCard><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Avg Attendance</p><div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}><span style={{ fontSize: '2.2rem', fontWeight: 800 }}>94.2%</span><span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>&uarr; 2%</span></div></PopCard>
      <PopCard><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Avg Class Grade</p><div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}><span style={{ fontSize: '2.2rem', fontWeight: 800 }}>B+</span><TrendingUp size={16} color="#10b981"/></div></PopCard>
      <PopCard><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Active Students</p><div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}><span style={{ fontSize: '2.2rem', fontWeight: 800 }}>165</span><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total</span></div></PopCard>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <motion.div variants={containerVariants}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}><h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Active Classes</h2><span onClick={() => setActiveSection('my-classes')} style={{ color: '#0284c7', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>View All &rarr;</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {teachingLabs.map((lab) => (
              <PopCard key={lab.id} style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }} onClick={() => onOpenRoom && onOpenRoom('stream', lab.title)}>
                <div style={{ height: '140px', position: 'relative' }}><img src={lab.banner} alt={lab.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} /><div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', borderRadius: '15px', fontWeight: 700, fontSize: '0.75rem', color: 'white' }}>Session {lab.session}</div></div>
                <div style={{ padding: '1.5rem' }}><h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.3rem' }}>{lab.title}</h3><p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.2rem' }}>{lab.code}</p><div style={{ height: '6px', background: 'var(--bg-main)', borderRadius: '3px', width: '100%' }}><div style={{ height: '100%', width: `${lab.progress}%`, background: '#10b981', borderRadius: '3px' }} /></div></div>
              </PopCard>
            ))}
          </div>
        </motion.div>

        <motion.div variants={containerVariants}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivity.map((activity) => (
              <PopCard key={activity.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><div style={{ width: '45px', height: '45px', borderRadius: '50%', background: activity.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{activity.user.charAt(0)}</div><div><p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}><span style={{ fontWeight: 700 }}>{activity.user}</span> {activity.action}</p><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activity.time}</span></div></div>
                <button style={{ background: 'rgba(41, 128, 185, 0.1)', color: '#0284c7', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem' }}>{activity.btn}</button>
              </PopCard>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <PopCard style={{ background: '#f8fafc', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Grading Queue</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}><h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Biology 101 Finals</h4><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>14 submissions pending review</span></div>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}><h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Visual Hierarchy Quiz</h4><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due tomorrow - Grade now</span></div>
          </div>
        </PopCard>
        <PopCard style={{ background: '#e0f2fe', color: '#0369a1' }}>
          <Lightbulb size={24} style={{ marginBottom: '0.7rem' }}/>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>Students who submit early tend to score 15% higher. Consider sending a nudge for the next assignment.</p>
        </PopCard>
      </div>
    </div>
  </motion.div>
  );
};

export default Overview;