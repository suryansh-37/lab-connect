import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Users, Zap, Plus, BookOpen, Calendar as CalendarIcon, X, Sparkles, Copy, Check } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const bannerImages = [
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600', // Physics/Abstract
  'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=600', // Bio/Science
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600', // Design/Arts
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=600'  // Poetry/Book
];

const MyClasses = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

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
      console.error('Failed to fetch classes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/classes/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseName })
      });
      if (res.ok) {
        setCourseName('');
        setIsCreateModalOpen(false); // Close the modal
        fetchClasses(); // Dynamically update My Classes list
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to create course');
      }
    } catch (err) {
      console.error('Error creating class:', err);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>My Classes</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>Manage your active streams, course rosters, and student registration.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '2.5rem' }}>
        <div>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <div style={{ width: '2rem', height: '2rem', border: '3px solid var(--border)', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : classes.length === 0 ? (
            <PopCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', background: 'rgba(2, 132, 199, 0.01)', border: '2px dashed var(--border)', borderRadius: '20px', boxShadow: 'none' }}>
              <div style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justify: 'center' }}>
                <Sparkles size={36} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>No classes created yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '380px', lineHeight: '1.6', marginBottom: '1.5rem' }}>Start your first stream by clicking 'Create New Course' in the Quick Actions panel.</p>
            </PopCard>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {classes.map((cls, idx) => {
                const bannerUrl = bannerImages[idx % bannerImages.length];
                const studentCount = cls.enrolledStudents?.length || 0;
                return (
                  <PopCard key={cls._id} style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ position: 'relative', height: '160px' }}>
                      <img src={bannerUrl} alt={cls.courseName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', opacity: 0.35 }} />
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.65)', color: 'white', padding: '0.35rem 0.8rem', borderRadius: '15px', fontSize: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: 600 }}>
                        <Users size={14} /> {studentCount} Enrolled
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{cls.courseName}</h3>
                        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>ACTIVE</span>
                      </div>
                      
                      {/* JOIN CODE COMPONENT */}
                      <div style={{ background: 'var(--bg-main)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>Shareable Join Code</p>
                          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace', letterSpacing: '1px' }}>{cls.joinCode}</span>
                        </div>
                        <button onClick={() => copyToClipboard(cls.joinCode)} style={{ background: 'white', border: '1px solid var(--border)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', transition: 'all 0.2s' }}>
                          <Copy size={13} /> Copy
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                        <div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 0.2rem 0' }}>Avg. Performance</p>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>N/A</span>
                        </div>
                        <button onClick={() => navigate(`/teacher-dashboard/class/${cls._id}`)} className="btn primary-btn" style={{ padding: '0.5rem 1.25rem', borderRadius: '20px', fontSize: '0.85rem', background: '#0284c7', cursor: 'pointer' }}>View Details</button>
                      </div>
                    </div>
                  </PopCard>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <PopCard style={{ background: '#f8fafc' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap color="var(--accent)" size={20} /> Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={() => { setIsCreateModalOpen(true); }} style={{ background: 'white', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#0284c7'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}><Plus size={16} /></div> 
                Create New Course
              </button>
              <button onClick={() => navigate('/teacher-dashboard/grading')} style={{ background: 'white', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#0284c7'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div style={{ background: '#dcfce7', color: '#10b981', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}><BookOpen size={16} /></div> 
                Bulk Grade
              </button>
              <button onClick={() => navigate('/teacher-dashboard/meetings')} style={{ background: 'white', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#0284c7'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}><CalendarIcon size={16} /></div> 
                Schedule Seminar
              </button>
            </div>
          </PopCard>
        </div>
      </div>

      {/* CREATE COURSE MODAL OVERLAY */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999, backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', maxWidth: '480px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', position: 'relative' }}>
              
              <button onClick={() => setIsCreateModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem', borderRadius: '50%' }}>
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Create New Course</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Establish a new course stream. We will automatically generate a unique join code for student enrollment.</p>
              
              <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Course Title</label>
                  <input type="text" placeholder="e.g. Molecular Biology II" value={courseName} onChange={(e) => setCourseName(e.target.value)} style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.95rem' }} required autoFocus />
                </div>
                <button type="submit" className="btn primary-btn" style={{ padding: '0.85rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#0284c7', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                  <Plus size={18} /> Create Course
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default MyClasses;