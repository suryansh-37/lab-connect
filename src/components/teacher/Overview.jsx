import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Zap, TrendingUp, Users, ClipboardList, Lightbulb, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const bannerImages = [
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600', // Physics
  'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=600', // Biology
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600', // Design
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=600'  // Poetry
];

const Overview = ({ setActiveSection, onOpenRoom, profileData }) => {
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
      console.error('Error fetching classes for overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const assignmentsToGrade = profileData?.assignmentsToGrade || 0;
  const classesTodayCount = (classes || []).length;
  const nextClass = (classes || []).length > 0 ? classes[0]?.courseName : "";
  const avgAttendance = profileData?.avgAttendance || 0;
  const avgClassGrade = profileData?.avgClassGrade || "N/A";
  
  // Calculate total students across all live classes
  const activeStudentsCount = (classes || []).reduce((sum, cls) => sum + (cls?.enrolledStudents?.length || 0), 0);
  const fullName = profileData?.fullName || 'Teacher';
  const recentActivity = profileData?.recentActivity || [];
  const hasNoClasses = (classes || []).length === 0;

  return (
  <motion.div variants={containerVariants} initial="hidden" animate="show">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          Welcome back, {fullName}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          You have {assignmentsToGrade} assignments to grade and {classesTodayCount} classes today.
        </p>
      </div>
      {nextClass && (
        <div style={{ background: '#fef3c7', color: '#854d0e', padding: '0.75rem 1.5rem', borderRadius: '25px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18}/> Next Class: {nextClass}
        </div>
      )}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
      <PopCard>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Avg Attendance</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>{avgAttendance}%</span>
          {avgAttendance > 0 && <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>&uarr; 2%</span>}
        </div>
      </PopCard>
      <PopCard>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Avg Class Grade</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>{avgClassGrade}</span>
          <TrendingUp size={16} color="#10b981"/>
        </div>
      </PopCard>
      <PopCard>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Active Students</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>{activeStudentsCount}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total</span>
        </div>
      </PopCard>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <motion.div variants={containerVariants}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>Active Classes</h2>
            <span onClick={() => setActiveSection('my-classes')} style={{ color: '#0284c7', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              View All &rarr;
            </span>
          </div>

          {isLoading ? (
            <PopCard style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 2rem' }}>
              <div style={{ width: '2rem', height: '2rem', border: '3px solid var(--border)', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </PopCard>
          ) : hasNoClasses ? (
            <PopCard
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 2rem',
                textAlign: 'center',
                background: 'rgba(2, 132, 199, 0.02)',
                border: '2px dashed var(--border)',
                borderRadius: '20px',
                boxShadow: 'none',
              }}
            >
              <div
                style={{
                  background: 'rgba(2, 132, 199, 0.1)',
                  color: '#0284c7',
                  padding: '1.25rem',
                  borderRadius: '50%',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(2, 132, 199, 0.15)',
                }}
              >
                <Sparkles size={40} className="pulse-animation" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                No active classes yet
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '420px', lineHeight: '1.6', marginBottom: '2rem' }}>
                Create a class stream, publish assignments, or invite students to start coordinating your lab session.
              </p>
              <button
                onClick={() => setActiveSection('my-classes')}
                style={{
                  background: '#0284c7',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '25px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(2, 132, 199, 0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = '#0274b0';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = '#0284c7';
                }}
              >
                Create a Class Stream
              </button>
            </PopCard>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {(classes || []).map((cls, idx) => {
                const bannerUrl = bannerImages[idx % bannerImages.length];
                const studentCount = cls?.enrolledStudents?.length || 0;
                return (
                  <PopCard key={cls?._id} style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }} onClick={() => onOpenRoom && onOpenRoom('stream', cls?.courseName)}>
                    <div style={{ height: '140px', position: 'relative' }}>
                      <img src={bannerUrl} alt={cls?.courseName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
                      <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', borderRadius: '15px', fontWeight: 700, fontSize: '0.75rem', color: 'white' }}>
                        Join Code: {cls?.joinCode}
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.3rem' }}>{cls?.courseName}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.2rem' }}>{studentCount} Students Enrolled</p>
                      <div style={{ height: '6px', background: 'var(--bg-main)', borderRadius: '3px', width: '100%' }}>
                        <div style={{ height: '100%', width: `0%`, background: '#10b981', borderRadius: '3px' }} />
                      </div>
                    </div>
                  </PopCard>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div variants={containerVariants}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivity.length === 0 ? (
              <PopCard style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No recent activity yet
              </PopCard>
            ) : (
              (recentActivity || []).map((activity) => (
                <PopCard key={activity?.id || activity?._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: activity?.color || '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {(activity?.user || 'A').charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        <span style={{ fontWeight: 700 }}>{activity?.user || ''}</span> {activity?.action || ''}
                      </p>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activity?.time || ''}</span>
                    </div>
                  </div>
                  <button style={{ background: 'rgba(41, 128, 185, 0.1)', color: '#0284c7', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem' }}>
                    {activity?.btn || 'View'}
                  </button>
                </PopCard>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <PopCard style={{ background: 'var(--bg-card)', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Grading Queue</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {hasNoClasses ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
                No assignments pending grade
              </div>
            ) : (
              <>
                <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Biology 101 Finals</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>14 submissions pending review</span>
                </div>
                <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Visual Hierarchy Quiz</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due tomorrow - Grade now</span>
                </div>
              </>
            )}
          </div>
        </PopCard>
        <PopCard style={{ background: '#e0f2fe', color: '#0369a1' }}>
          <Lightbulb size={24} style={{ marginBottom: '0.7rem' }}/>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>Students who submit early tend to score 15% higher. Consider sending a nudge for the next assignment.</p>
        </PopCard>
      </div>
    </div>
    <style>{`
      .pulse-animation {
        animation: pulse 2s infinite ease-in-out;
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.08); opacity: 0.9; }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </motion.div>
  );
};

export default Overview;
