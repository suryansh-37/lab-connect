import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { BarChart2, TrendingUp, ClipboardList, CheckCircle, Search, BookOpen, Users } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const Grading = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [studentStats, setStudentStats] = useState([]);
  const [classStats, setClassStats] = useState({ classAverageGrade: 'N/A', classAverageAttendance: 'N/A', assignmentVelocity: 'N/A' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/classes/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to retrieve classes.');
      }
      const data = await res.json();
      setClasses(data);
      if (data.length > 0) {
        setSelectedClassId(data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async (classId) => {
    if (!classId) return;
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/classes/${classId}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to retrieve class statistics.');
      }
      const data = await res.json();
      setStudentStats(data.studentStats || []);
      setClassStats(data.classStats || { classAverageGrade: 'N/A', classAverageAttendance: 'N/A', assignmentVelocity: 'N/A' });
    } catch (err) {
      console.error('Error fetching class stats:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchStats(selectedClassId);
    }
  }, [selectedClassId]);

  const selectedClass = classes.find(c => c._id === selectedClassId);

  // Filter student stats by search query
  const filteredStats = studentStats.filter(stat =>
    (stat.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (stat.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="loading-spinner">Loading portal...</div>;

  if (error) {
    return (
      <div className="error-message" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: '#ef4444', fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ fontWeight: 850, fontSize: '1.75rem', marginBottom: '0.75rem' }}>Session Error or Connection Failure</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', lineHeight: '1.6' }}>{error}</p>
        <button onClick={fetchClasses} style={{ background: '#0284c7', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '25px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(2,132,199,0.3)' }}>
          Retry
        </button>
      </div>
    );
  }



  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '-1rem' }}>Classroom Gradebook</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '1.5rem' }}>
        {/* Class Average Grade Card */}
        <PopCard style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <BarChart2 size={120} color="var(--bg-main)" style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Class Average Score</p>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#0284c7', lineHeight: 1, marginBottom: '0.5rem' }}>
            {classStats.classAverageGrade !== 'N/A' ? `${classStats.classAverageGrade}%` : 'N/A'}
          </h2>
          <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <TrendingUp size={14}/> Live Calculated
          </span>
        </PopCard>

        {/* Assignment Velocity / Class Level Metrics */}
        <PopCard style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: 700 }}>Class Level Metrics</p>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Live Stats</span>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span>Recent Assignment Velocity</span>
              <span style={{ color: '#2563eb' }}>
                {classStats.assignmentVelocity !== 'N/A' ? `${classStats.assignmentVelocity}%` : '0%'}
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--bg-main)', borderRadius: '4px' }}>
              <div 
                style={{ 
                  width: `${classStats.assignmentVelocity !== 'N/A' ? classStats.assignmentVelocity : 0}%`, 
                  height: '100%', 
                  background: '#2563eb', 
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} 
              />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span>Class Attendance Rate</span>
              <span style={{ color: '#10b981' }}>
                {classStats.classAverageAttendance !== 'N/A' ? `${classStats.classAverageAttendance}%` : 'N/A'}
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--bg-main)', borderRadius: '4px' }}>
              <div 
                style={{ 
                  width: `${classStats.classAverageAttendance !== 'N/A' ? classStats.classAverageAttendance : 0}%`, 
                  height: '100%', 
                  background: '#10b981', 
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} 
              />
            </div>
          </div>
        </PopCard>

        {/* Dynamic Class Info Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <PopCard style={{ flex: 1, background: '#fef3c7', borderColor: '#fde68a', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 1.5rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.75rem', borderRadius: '12px', color: '#d97706' }}>
              <ClipboardList size={24}/>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#92400e', lineHeight: 1 }}>
                {studentStats.length > 0 ? studentStats.filter(s => s.avgGrade === null).length : 0}
              </h3>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#b45309' }}>Ungraded Students</span>
            </div>
          </PopCard>
          
          <PopCard style={{ flex: 1, background: '#dcfce7', borderColor: '#bbf7d0', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 1.5rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '12px', color: '#059669' }}>
              <CheckCircle size={24}/>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#166534', lineHeight: 1 }}>{studentStats.length}</h3>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#15803d' }}>Students Enrolled</span>
            </div>
          </PopCard>
        </div>
      </div>

      <PopCard style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Detailed Academic Records</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>Manage student performance across all modules.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Live Class Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
              <BookOpen size={14} color="var(--text-muted)" />
              {isLoading ? (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading...</span>
              ) : classes.length === 0 ? (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No Classes Active</span>
              ) : (
                <select 
                  value={selectedClassId} 
                  onChange={e => setSelectedClassId(e.target.value)} 
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.courseName}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Student Search */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search students..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '0.5rem 1rem 0.5rem 2.2rem', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--bg-main)', outline: 'none', fontSize: '0.85rem' }} 
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
            <div style={{ width: '2rem', height: '2rem', border: '3px solid var(--border)', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : classes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Please create a class to manage grading records.
          </div>
        ) : filteredStats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <Users size={32} style={{ marginBottom: '1rem', opacity: 0.6 }} />
            <h4 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>No Students Found</h4>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              {searchQuery ? 'Adjust your search terms.' : `Give join code '${selectedClass?.joinCode}' to students.`}
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>Student Name</th>
                <th style={{ padding: '1.25rem 1rem', fontWeight: 700 }}>Email Address</th>
                <th style={{ padding: '1.25rem 1rem', fontWeight: 700 }}>Attendance Rate</th>
                <th style={{ padding: '1.25rem 1rem', fontWeight: 700 }}>Average Grade</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((stat, i) => {
                const avatar = stat.fullName.charAt(0).toUpperCase();
                
                const attendanceStr = stat.attendanceRate !== null ? `${stat.attendanceRate.toFixed(1)}%` : 'N/A';
                const gradeStr = stat.avgGrade !== null ? `${stat.avgGrade.toFixed(1)}%` : 'N/A';
                
                let status = 'Ungraded / No Data';
                let statusBg = '#f1f5f9';
                let statusColor = '#64748b';
                
                if (stat.avgGrade !== null) {
                  if (stat.avgGrade >= 90) {
                    status = 'Excellent';
                    statusBg = '#d1fae5';
                    statusColor = '#10b981';
                  } else if (stat.avgGrade >= 75) {
                    status = 'On Track';
                    statusBg = '#fef3c7';
                    statusColor = '#d97706';
                  } else {
                    status = 'Needs Improvement';
                    statusBg = '#fee2e2';
                    statusColor = '#ef4444';
                  }
                }
                
                return (
                  <tr key={stat.studentId} style={{ borderBottom: i !== filteredStats.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '1.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {avatar}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', margin: 0 }}>{stat.fullName}</p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{stat.studentId?.substring(18) || stat.studentId}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {stat.email}
                    </td>
                    <td style={{ padding: '1.5rem 1rem', fontSize: '0.9rem', fontWeight: 600 }}>
                      {attendanceStr}
                    </td>
                    <td style={{ padding: '1.5rem 1rem', fontSize: '0.95rem', fontWeight: 800, color: '#0284c7' }}>
                      {gradeStr}
                    </td>
                    <td style={{ padding: '1.5rem 1.5rem' }}>
                      <span style={{ background: statusBg, color: statusColor, padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

export default Grading;