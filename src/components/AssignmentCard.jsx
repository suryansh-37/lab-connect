import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FileText, Clock, Trash2, CheckCircle, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

const AssignmentCard = ({ assignment, role, onEdit }) => {
  const { assignments, setAssignments } = useContext(AppContext);

  const handleDelete = () => setAssignments(assignments.filter(a => a.id !== assignment.id));
  const handleSubmit = () => setAssignments(assignments.map(a => a.id === assignment.id ? { ...a, status: 'Submitted' } : a));

  return (
    <motion.div className="auth-card" style={{ padding: '1.5rem', marginBottom: '1rem' }} whileHover={{ y: -4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(41, 128, 185, 0.1)', padding: '0.75rem', borderRadius: '50%', color: 'var(--accent)' }}><FileText size={20} /></div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{assignment.title}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{assignment.lab}</span>
          </div>
        </div>
        {role === 'Teacher' && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => onEdit(assignment)} className="icon-btn" style={{ color: 'var(--accent)' }}><Edit size={18} /></button>
            <button onClick={handleDelete} className="icon-btn" style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
          </div>
        )}
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '1rem 0' }}>{assignment.description}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> Due: {assignment.dueDate}</span>
        {role === 'Student' && (
          assignment.status === 'Submitted' ? (
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}><CheckCircle size={18} /> Submitted</span>
          ) : <button onClick={handleSubmit} className="btn primary-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Submit Work</button>
        )}
      </div>
    </motion.div>
  );
};

export default AssignmentCard;