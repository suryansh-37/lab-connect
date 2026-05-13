import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { FileText, Clock, Trash2, CheckCircle, Edit, Download, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AssignmentCard = ({ assignment, role, onEdit }) => {
  const { assignments, setAssignments } = useContext(AppContext);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [submissionData, setSubmissionData] = useState([]);
  const [submittedFile, setSubmittedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions/${assignment.id || assignment._id}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissionData(data);
      }
    } catch (e) {
      console.error('Failed to fetch submissions', e);
    }
  };

  const toggleSubmissions = () => {
    if (!showSubmissions) fetchSubmissions();
    setShowSubmissions(!showSubmissions);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const payload = {
        assignmentId: assignment._id || assignment.id,
        studentName: 'Alexander (Student)',
        fileName: file.name,
        fileData: reader.result
      };
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) setSubmittedFile(file.name);
      } catch (err) { console.error('Upload failed', err); }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDelete = () => setAssignments(assignments.filter(a => a.id !== (assignment.id || assignment._id)));
  const handleSubmit = () => setAssignments(assignments.map(a => a.id === (assignment.id || assignment._id) ? { ...a, status: 'Submitted' } : a));

  return (
    <motion.div className="auth-card" style={{ padding: '1.5rem', marginBottom: '1rem' }} whileHover={{ y: -4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(41, 128, 185, 0.1)', padding: '0.75rem', borderRadius: '50%', color: 'var(--accent)' }}><FileText size={20} /></div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{assignment.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{assignment.lab || assignment.className}</span>
              {assignment.fileData && (
                <a href={assignment.fileData} download={assignment.fileName || 'Assignment.pdf'} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}>
                  <Download size={14} /> Download Materials
                </a>
              )}
            </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {submittedFile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
                <CheckCircle size={16} /> Submitted: {submittedFile}
              </div>
            ) : null}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: submittedFile ? '#dcfce7' : '#0284c7', color: submittedFile ? '#166534' : 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', transition: 'all 0.2s' }}>
              <Upload size={14} /> {isUploading ? 'Uploading...' : submittedFile ? 'Resubmit' : 'Submit Work'}
              <input type="file" style={{ display: 'none' }} disabled={isUploading} onChange={handleFileUpload} />
            </label>
          </div>
        )}
        {role === 'Teacher' && (
          <button onClick={toggleSubmissions} style={{ background: 'none', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
            {showSubmissions ? 'Hide Submissions' : 'View Submissions'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSubmissions && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginTop: '1rem', borderTop: '1px dashed var(--border)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Submissions</h4>
            {submissionData.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No submissions yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {submissionData.map((sub, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: 'var(--bg-main)', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{sub.studentName}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({sub.fileName})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(sub.submittedAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</span>
                      {sub.fileData && (
                        <a href={sub.fileData} download={sub.fileName} style={{ color: '#0284c7', display: 'flex', alignItems: 'center' }}>
                          <Download size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AssignmentCard;