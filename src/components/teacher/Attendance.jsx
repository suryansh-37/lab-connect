import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { User, CheckCircle, Save, Calendar as CalendarIcon, BookOpen } from 'lucide-react';
import { students } from '../../data/mockData';

const Attendance = () => {
  const [attendance, setAttendance] = useState({});
  const [classFilter, setClassFilter] = useState('Bio 101');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  const markStudent = (idx, status) => {
    setAttendance((prev) => ({ ...prev, [idx]: status }));
    setShowSuccess(false);
  };

  const markAllAs = (status) => {
    const updated = {};
    students.forEach((_, idx) => { updated[idx] = status; });
    setAttendance(updated);
    setShowSuccess(false);
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
  <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: '900px', margin: '0 auto' }}>
    <PopCard>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Mark Daily Attendance</h2>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
            <CalendarIcon size={16} color="var(--text-muted)" />
            <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontWeight: 600 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
             <BookOpen size={16} color="var(--text-muted)" />
             <select value={classFilter} onChange={e => setClassFilter(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontWeight: 600 }}>
                <option value="Bio 101">Bio 101</option>
                <option value="Chem 201">Chem 201</option>
                <option value="CS 101">CS 101</option>
             </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
         <button onClick={() => markAllAs('present')} style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Mark All Present</button>
         <button onClick={() => markAllAs('absent')} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Mark All Absent</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {students.map((student, idx) => (
          <div key={idx} style={{ padding: '1rem 1.5rem', border: '1px solid', borderColor: attendance[idx] === 'present' ? '#a7f3d0' : attendance[idx] === 'absent' ? '#fecaca' : 'var(--border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: attendance[idx] === 'present' ? '#f0fdf4' : attendance[idx] === 'absent' ? '#fef2f2' : 'var(--bg-main)', transition: 'all 0.2s', boxShadow: attendance[idx] ? '0 4px 10px rgba(0,0,0,0.02)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><User size={20} color={attendance[idx] === 'present' ? '#10b981' : attendance[idx] === 'absent' ? '#ef4444' : 'var(--text-muted)'} /><span style={{ fontWeight: 700, fontSize: '1.1rem', color: attendance[idx] === 'absent' ? '#991b1b' : 'var(--text-main)' }}>{student.name}</span></div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => markStudent(idx, 'present')} className="icon-btn" style={{ color: attendance[idx] === 'present' ? 'white' : '#10b981', background: attendance[idx] === 'present' ? '#10b981' : 'transparent', border: '1px solid #10b981', padding: '0.5rem', borderRadius: '50%', transition: 'all 0.2s' }}><CheckCircle size={20} /></button>
                <button onClick={() => markStudent(idx, 'absent')} className="icon-btn" style={{ color: attendance[idx] === 'absent' ? 'white' : '#ef4444', background: attendance[idx] === 'absent' ? '#ef4444' : 'transparent', border: '1px solid #ef4444', padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', transition: 'all 0.2s' }}>X</button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '2.5rem', position: 'relative' }}>
          <button onClick={handleSave} className="btn primary-btn full-width" style={{ padding: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={Object.keys(attendance).length === 0}><Save size={20} /> {showSuccess ? 'Records Synchronized!' : 'Save Attendance Record'}</button>
          <AnimatePresence>
             {showSuccess && (
                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '1rem', background: '#10b981', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>✅ Attendance saved efficiently strictly for {classFilter}.</motion.div>
             )}
          </AnimatePresence>
      </div>
    </PopCard>
  </motion.div>
  );
};
export default Attendance;