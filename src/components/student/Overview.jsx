import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Award, BookOpen, ChevronRight, Target, Beaker, Sparkles, Plus, Copy, LogIn, Calendar as CalendarIcon, Check } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const bannerImages = [
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600', // Physics/Abstract
  'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=600', // Bio/Science
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600', // Design/Arts
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=600'  // Poetry/Book
];

const Overview = ({ setActiveSection, onOpenRoom, profileData }) => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState(null);

  const fetchEnrolledClasses = async () => {
    try {
      setIsLoadingClasses(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/classes/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Error fetching enrolled classes:', err);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      setIsLoadingAssignments(true);
      const res = await fetch(`${API_BASE_URL}/api/assignments`);
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
    } finally {
      setIsLoadingAssignments(false);
    }
  };

  useEffect(() => {
    fetchEnrolledClasses();
    fetchAssignments();
  }, []);

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    try {
      setIsJoining(true);
      setJoinMessage(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setJoinMessage({ type: 'error', text: 'Authorization token not found. Please log in again.' });
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/classes/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ joinCode: joinCode.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setJoinMessage({ type: 'success', text: `Successfully joined ${data.courseName}!` });
        setJoinCode('');
        fetchEnrolledClasses();
      } else {
        setJoinMessage({ type: 'error', text: data.message || 'Failed to join class.' });
      }
    } catch (err) {
      setJoinMessage({ type: 'error', text: 'Connection error. Please try again.' });
    } finally {
      setIsJoining(false);
    }
  };

  const getLabIcon = (idx) => {
    const icons = [<Target size={24} />, <Beaker size={24} />, <BookOpen size={24} />];
    return icons[idx % icons.length];
  };

  const credits = profileData?.credits || 0;
  const totalCreditsGoal = profileData?.totalCreditsGoal || 120;
  const classRank = profileData?.classRank || 0;
  const totalStudents = profileData?.totalStudents || 450;
  const weeklyStudyProgress = profileData?.weeklyStudyProgress || 0;
  const weeklyStudyGoal = profileData?.weeklyStudyGoal || 25;
  const fullName = profileData?.fullName || 'Student';

  const hasNoCourses = courses.length === 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Welcome back, {fullName}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontStyle: 'italic' }}>
          "The mind is not a vessel to be filled, but a fire to be kindled."
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <PopCard style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <Award size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Class Rank</span>
          </div>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {classRank || 'N/A'}{' '}
            {classRank > 0 && (
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ {totalStudents}</span>
            )}
          </span>
        </PopCard>
        <PopCard style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <BookOpen size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Credits</span>
          </div>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {credits} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ {totalCreditsGoal}</span>
          </span>
        </PopCard>
        <PopCard style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Weekly Study Goal
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.5rem 0' }}>
              {weeklyStudyProgress} / {weeklyStudyGoal} Hours
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {weeklyStudyGoal > 0
                ? `Keep going, you're ${Math.round((weeklyStudyProgress / weeklyStudyGoal) * 100)}% there!`
                : 'No goal set yet'}
            </span>
          </div>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(2, 132, 199, 0.1)',
              border: `6px solid #0284c7`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'var(--text-main)',
            }}
          >
            {weeklyStudyGoal > 0 ? `${Math.round((weeklyStudyProgress / weeklyStudyGoal) * 100)}%` : '0%'}
          </div>
        </PopCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <motion.div variants={containerVariants}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Enrolled Courses</h2>
              <span
                onClick={() => setActiveSection('library')}
                style={{ color: '#0284c7', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                View Library
              </span>
            </div>

            {isLoadingClasses ? (
              <PopCard style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 2rem' }}>
                <div style={{ width: '2rem', height: '2rem', border: '3px solid var(--border)', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              </PopCard>
            ) : hasNoCourses ? (
              <PopCard
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4rem 2rem',
                  textAlign: 'center',
                  background: 'rgba(2, 132, 199, 0.01)',
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
                  }}
                >
                  <Sparkles size={40} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  No active courses yet
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '420px', lineHeight: '1.6', marginBottom: '2rem' }}>
                  You aren't enrolled in any lab courses yet. Enter a join code on the right panel to connect to a course stream.
                </p>
              </PopCard>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {(courses || []).map((lab, idx) => {
                  const bannerUrl = bannerImages[idx % bannerImages.length];
                  return (
                    <PopCard
                      key={lab?._id}
                      style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}
                      onClick={() => onOpenRoom && onOpenRoom('stream', lab?.courseName)}
                    >
                      <div style={{ height: '120px', position: 'relative' }}>
                        <img src={bannerUrl} alt={lab?.courseName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', opacity: 0.3 }} />
                      </div>
                      <div style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div style={{ background: 'rgba(2, 132, 199, 0.1)', padding: '0.6rem', borderRadius: '8px', color: '#0284c7', display: 'flex' }}>
                            {getLabIcon(idx)}
                          </div>
                          <span
                            style={{
                              background: '#e0f2fe',
                              color: '#0369a1',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                            }}
                          >
                            ACTIVE
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem', margin: 0 }}>
                          {lab?.courseName || ''}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.3rem 0 1rem 0' }}>
                          Instructor: {lab?.teacherId?.fullName || 'Academic Faculty'}
                        </p>
                        <div style={{ width: '100%', height: '6px', background: 'var(--bg-main)', borderRadius: '3px', marginBottom: '0.8rem', overflow: 'hidden' }}>
                          <div style={{ width: `0%`, height: '100%', background: '#0284c7' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                          <span>0% COMPLETE</span>
                          <span>CODE: {lab?.joinCode || ''}</span>
                        </div>
                      </div>
                    </PopCard>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* JOIN CLASS PANEL */}
          <PopCard style={{ background: '#f8fafc', border: '1px solid var(--border)' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} color="#0284c7" /> Join Course Stream
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Enter the unique 6-character alphanumeric join code provided by your instructor.
            </p>

            <form onSubmit={handleJoinClass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="e.g. ANSLZH" 
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem', fontWeight: 700, textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase' }}
                required
              />
              <button 
                type="submit" 
                className="btn primary-btn" 
                disabled={isJoining || joinCode.trim().length !== 6}
                style={{ padding: '0.75rem', borderRadius: '8px', background: '#0284c7', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {isJoining ? 'Enrolling...' : <><LogIn size={16} /> Enroll in Class</>}
              </button>
            </form>

            <AnimatePresence>
              {joinMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }} 
                  style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', background: joinMessage.type === 'success' ? '#ecfdf5' : '#fee2e2', color: joinMessage.type === 'success' ? '#047857' : '#b91c1c', border: joinMessage.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fecaca' }}
                >
                  {joinMessage.type === 'success' ? '✅ ' : '❌ '} {joinMessage.text}
                </motion.div>
              )}
            </AnimatePresence>
          </PopCard>

          {/* UPCOMING DEADLINES */}
          <PopCard>
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)', margin: '0 0 1.5rem 0' }}>
              Upcoming Deadlines
            </h3>
            
            {isLoadingAssignments ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <div style={{ width: '1.5rem', height: '1.5rem', border: '2px solid var(--border)', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : (assignments || []).length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem 0' }}>
                🎉 No upcoming deadlines.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {(assignments || []).slice(0, 3).map((assignment) => (
                  <div key={assignment?._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => setActiveSection('assignments')}>
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Due</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Soon</h4>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h5 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', margin: '0 0 0.2rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {assignment?.title || ''}
                      </h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{assignment?.className || ''}</span>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setActiveSection('calendar')}
              style={{
                width: '100%',
                marginTop: '2rem',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                padding: '0.75rem',
                borderRadius: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Open Calendar
            </button>
          </PopCard>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default Overview;