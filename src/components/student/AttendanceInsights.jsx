import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Award, ChevronLeft, ChevronRight, BookOpen, UserCheck } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const getParticipation = (cls) => {
  const charCodeSum = cls.courseName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 85 + (charCodeSum % 16); // Deterministic score between 85% and 100%
};

const AttendanceInsights = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/classes/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      }
    } catch (err) {
      console.error('Error fetching classes for attendance insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const totalParticipation = classes.length > 0 
    ? Math.round(classes.reduce((sum, cls) => sum + getParticipation(cls), 0) / classes.length)
    : 100;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Student Attendance Overview</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Monitoring your academic presence and engagement metrics.</p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div style={{ width: '2rem', height: '2rem', border: '3px solid var(--border)', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <PopCard style={{ background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Academic Presence</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0 0 0' }}>Weekly Engagement Flow</h3>
                </div>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                  {classes.length > 0 ? `${totalParticipation}% Consistent` : '100% Consistent'}
                </span>
              </div>
              <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 2rem', position: 'relative' }}>
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: 0.2, stroke: '#0284c7', strokeWidth: 1, fill: 'none', position: 'absolute', left: 0, bottom: 0 }}><path d="M0 30 Q 20 10, 40 25 T 80 15 T 100 5" /></svg>
                {/* Visual Placeholder for Graph Bars */}
                {[92, 95, 88, 98, 100, 0, 0].map((val, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1 }}>
                    <div style={{ height: `${val * 2}px`, width: '16px', background: '#0284c7', borderRadius: '4px 4px 0 0', opacity: val > 0 ? 0.8 : 0.15, transition: 'all 0.3s' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>
                <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
              </div>
            </PopCard>

            <PopCard style={{ background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Attendance Calendar</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, margin: '0.2rem 0 0 0' }}>June 2026</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}><div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#10b981' }}></div> Present</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}><div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#ef4444' }}></div> Absent</div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem', color: 'var(--text-muted)' }}><ChevronLeft size={20}/><ChevronRight size={20}/></div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', textAlign: 'center' }}>
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <span key={d} style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '0.5rem', borderRadius: '8px' }}>{d}</span>)}
                {[...Array(30)].map((_, i) => {
                  const day = i + 1; 
                  const isSelected = day === 4; 
                  const isAbsent = day === 12;
                  const hasDot = day <= 4; // Mock dots only up to today
                  return (
                    <div key={day} style={{ height: '70px', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', border: isSelected ? '2px solid #0284c7' : '1px solid transparent', borderRadius: '12px', background: 'var(--bg-main)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{day}</span>
                      <div style={{ display: 'flex', gap: '4px', height: '6px' }}>
                        {hasDot && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isAbsent ? '#ef4444' : '#10b981' }}></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </PopCard>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <PopCard style={{ background: '#0284c7', color: 'white', border: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', opacity: 0.9 }}><Award size={20}/><span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>Elite Standing</span></div>
              <h2 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1, margin: 0 }}>{classes.length > 0 ? `${totalParticipation}%` : '100%'}</h2>
              <p style={{ fontSize: '1rem', fontWeight: 600, opacity: 0.9, marginBottom: '2rem', marginTop: '0.5rem' }}>Participation Score</p>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <span>Active Attendance Status</span>
                  <span>On Track</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px' }}>
                  <div style={{ width: `${totalParticipation}%`, height: '100%', background: '#10b981', borderRadius: '3px' }}></div>
                </div>
              </div>
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.9, margin: 0 }}>"Excellence is not an act, but a habit. Your presence defines your progress."</p>
            </PopCard>

            <PopCard style={{ background: 'var(--bg-card)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 1.5rem 0' }}>Course Specifics</h3>
              {classes.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                  Not enrolled in any classes yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {classes.map((cls) => {
                    const score = getParticipation(cls);
                    return (
                      <div key={cls._id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                          <span>{cls.courseName}</span>
                          <span style={{ color: '#10b981' }}>{score}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'var(--bg-main)', borderRadius: '3px' }}>
                          <div style={{ width: `${score}%`, height: '100%', background: '#10b981', borderRadius: '3px' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </PopCard>
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default AttendanceInsights;