import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { User, CheckCircle, Save, Calendar as CalendarIcon, BookOpen, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [attendance, setAttendance] = useState({});
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);
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
        if (data.length > 0) {
          setSelectedClassId(data[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const selectedClass = classes.find(c => c._id === selectedClassId);
  const students = selectedClass?.enrolledStudents || [];

  const markStudent = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
    setShowSuccess(false);
  };

  const markAllAs = (status) => {
    const updated = {};
    students.forEach((student) => {
      updated[student._id] = status;
    });
    setAttendance(updated);
    setShowSuccess(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formattedRecords = Object.keys(attendance).map(studentId => ({
        studentId,
        status: attendance[studentId]
      }));

      const res = await fetch(`${API_BASE_URL}/api/classes/${selectedClassId}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: targetDate,
          records: formattedRecords
        })
      });
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to save attendance.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error saving attendance.');
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <PopCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800 }}>Mark Daily Attendance</h2>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
              <CalendarIcon size={16} color="var(--text-muted)" />
              <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontWeight: 600 }} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
              <BookOpen size={16} color="var(--text-muted)" />
              {isLoading ? (
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Loading...</span>
              ) : classes.length === 0 ? (
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>No Active Classes</span>
              ) : (
                <select 
                  value={selectedClassId} 
                  onChange={e => {
                    setSelectedClassId(e.target.value);
                    setAttendance({});
                  }} 
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer' }}
                >
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.courseName}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
            <div style={{ width: '2rem', height: '2rem', border: '3px solid var(--border)', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : classes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem var(--border)', color: 'var(--text-muted)' }}>
            <p>You have not created any classes yet.</p>
          </div>
        ) : students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '12px', background: 'var(--bg-main)' }}>
            <Users size={32} style={{ marginBottom: '1rem', opacity: 0.6 }} />
            <h4 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>No Students Enrolled</h4>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>Provide the join code <strong style={{ color: '#0284c7', fontFamily: 'monospace' }}>{selectedClass?.joinCode}</strong> to your students to register.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
              <button onClick={() => markAllAs('present')} style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Mark All Present</button>
              <button onClick={() => markAllAs('absent')} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Mark All Absent</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(students || []).map((student) => {
                const studentId = student?._id || student;
                const studentName = student?.fullName || student?.name || 'Unknown Student';
                const studentEmail = student?.email ? `(${student.email})` : '';
                const status = attendance[studentId];
                return (
                  <div 
                    key={studentId} 
                    style={{ 
                      padding: '1rem 1.5rem', 
                      border: '1px solid', 
                      borderColor: status === 'present' ? '#a7f3d0' : status === 'absent' ? '#fecaca' : 'var(--border)', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      background: status === 'present' ? '#f0fdf4' : status === 'absent' ? '#fef2f2' : 'var(--bg-main)', 
                      transition: 'all 0.2s', 
                      boxShadow: status ? '0 4px 10px rgba(0,0,0,0.02)' : 'none' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <User size={20} color={status === 'present' ? '#10b981' : status === 'absent' ? '#ef4444' : 'var(--text-muted)'} />
                      <div>
                        <span style={{ fontWeight: 750, fontSize: '1.1rem', color: status === 'absent' ? '#991b1b' : 'var(--text-main)' }}>{studentName}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>{studentEmail}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        onClick={() => markStudent(studentId, 'present')} 
                        className="icon-btn" 
                        style={{ 
                          color: status === 'present' ? 'white' : '#10b981', 
                          background: status === 'present' ? '#10b981' : 'transparent', 
                          border: '1px solid #10b981', 
                          padding: '0.5rem', 
                          borderRadius: '50%', 
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button 
                        onClick={() => markStudent(studentId, 'absent')} 
                        className="icon-btn" 
                        style={{ 
                          color: status === 'absent' ? 'white' : '#ef4444', 
                          background: status === 'absent' ? '#ef4444' : 'transparent', 
                          border: '1px solid #ef4444', 
                          padding: '0.5rem', 
                          borderRadius: '50%', 
                          width: '40px', 
                          height: '40px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: 'bold', 
                          transition: 'all 0.2s',
                          cursor: 'pointer' 
                        }}
                      >
                        X
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ marginTop: '2.5rem', position: 'relative' }}>
              <button 
                onClick={handleSave} 
                className="btn primary-btn full-width" 
                style={{ padding: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', cursor: 'pointer', background: '#0284c7', border: 'none', color: 'white', fontWeight: 700, borderRadius: '8px' }} 
                disabled={Object.keys(attendance).length === 0}
              >
                <Save size={20} /> {showSuccess ? 'Records Synchronized!' : 'Save Attendance Record'}
              </button>
              <AnimatePresence>
                {showSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }} 
                    style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '1rem', background: '#10b981', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}
                  >
                    ✅ Attendance saved efficiently strictly for {selectedClass?.courseName}.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </PopCard>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default Attendance;