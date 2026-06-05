import React, { useState, useContext, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { motion } from 'framer-motion';
import axios from 'axios';
import { PopCard, containerVariants } from '../ui/PopCard';
import { UploadCloud, Image as ImageIcon, FileText, X } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import AssignmentCard from '../AssignmentCard'; // Keep your original path

const AssignmentsView = ({ profileData }) => {
  const { assignments, setAssignments } = useContext(AppContext);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ id: null, title: '', description: '', dueDate: '', lab: '', classId: '' });
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/assignments`);
        if (res.ok) {
          const data = await res.json();
          setAssignments(data);
        }
      } catch (e) {
        console.error('Failed to fetch assignments', e);
      }
    };
    fetchAssignments();
  }, [setAssignments]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/classes/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setTeacherClasses(data);
          if (data.length > 0) {
            setNewAssignment(prev => ({
              ...prev,
              lab: prev.lab || data[0].courseName,
              classId: prev.classId || data[0]._id
            }));
          }
        }
      } catch (e) {
        console.error('Failed to fetch teacher classes', e);
      }
    };
    fetchClasses();
  }, []);

  const handleEdit = (assignment) => {
    setNewAssignment({
      id: assignment._id || assignment.id,
      title: assignment.title || '',
      description: assignment.description || '',
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : '',
      lab: assignment.className || assignment.lab || '',
      classId: assignment.classId || ''
    });
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.title) return;
    
    let fileToUpload = { name: 'Materials.pdf', type: 'PDF Document', size: '0 MB', data: 'No Data' };
    
    if (attachedFiles.length > 0) {
      const file = attachedFiles[0].raw;
      const reader = new FileReader();
      
      const uploadPromise = new Promise((resolve) => {
        reader.onloadend = () => {
          fileToUpload = {
            name: file.name,
            type: file.type.includes('pdf') ? 'PDF Document' : file.name.endsWith('.docx') ? 'Word Document' : 'Document',
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            data: reader.result
          };
          resolve();
        };
        reader.readAsDataURL(file);
      });
      await uploadPromise;
    }

    const payload = {
      title: newAssignment.title,
      className: newAssignment.lab,
      classId: newAssignment.classId,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate,
      fileName: fileToUpload.name,
      fileType: fileToUpload.type,
      fileSize: fileToUpload.size,
      fileData: fileToUpload.data,
      uploadedBy: profileData?.fullName || 'Teacher'
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/assignments/create`, payload);
      if (res.status === 200 || res.status === 201) {
        const saved = res.data;
        setAssignments([saved, ...assignments]);
        setNewAssignment({
          id: null,
          title: '',
          description: '',
          dueDate: '',
          lab: teacherClasses[0]?.courseName || '',
          classId: teacherClasses[0]?._id || ''
        });
        setAttachedFiles([]);
      }
    } catch (err) {
      console.log('Save failed error debug:', err);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB', type: file.type }));
      setAttachedFiles([...attachedFiles, ...newFiles]);
    }
  };
  
  const onFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({ 
        name: file.name, 
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB', 
        type: file.type,
        raw: file
      }));
      setAttachedFiles([...attachedFiles, ...newFiles]);
    }
  };
  const removeFile = (index) => setAttachedFiles(attachedFiles.filter((_, i) => i !== index));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
      <PopCard style={{ height: 'fit-content' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>{newAssignment.id ? 'Edit Assignment' : 'Post Assignment'}</h2>
        <form onSubmit={handleSaveAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="text" placeholder="Title" value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} required />
          <textarea placeholder="Description" value={newAssignment.description} onChange={e => setNewAssignment({...newAssignment, description: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} rows="3" required />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              value={newAssignment.classId} 
              onChange={e => {
                const selectedClass = teacherClasses.find(c => c._id === e.target.value);
                setNewAssignment({
                  ...newAssignment,
                  classId: e.target.value,
                  lab: selectedClass ? selectedClass.courseName : ''
                });
              }}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }} 
              required
            >
              <option value="" disabled>Select Class/Course</option>
              {teacherClasses.map(c => (
                <option key={c._id} value={c._id}>{c.courseName}</option>
              ))}
            </select>
            <input type="date" value={newAssignment.dueDate} onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} required />
          </div>
          
          <div style={{ marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>Attach Materials</p>
            <div 
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={onDrop} onClick={() => fileInputRef.current.click()}
              style={{ border: `2px dashed ${isDragging ? '#0284c7' : 'var(--border)'}`, background: isDragging ? '#e0f2fe' : 'var(--bg-main)', borderRadius: '12px', padding: '2rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
            >
              <UploadCloud size={32} color={isDragging ? '#0284c7' : 'var(--text-muted)'} />
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: isDragging ? '#0284c7' : 'var(--text-main)' }}>Drag & drop files here, or click to browse</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supported: PDF, DOCX, JPG, PNG</p>
              <input type="file" multiple ref={fileInputRef} onChange={onFileSelect} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
            </div>

            {attachedFiles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                {attachedFiles.map((file, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {file.type.includes('image') ? <ImageIcon size={16} color="#10b981"/> : <FileText size={16} color="#2563eb"/>}
                      <div><p style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{file.size}</span><button type="button" onClick={(e) => { e.stopPropagation(); removeFile(idx); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={16}/></button></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="btn primary-btn full-width" style={{ marginTop: '0.5rem' }}>{newAssignment.id ? 'Update' : 'Create Assignment'}</button>
        </form>
      </PopCard>
      <motion.div variants={containerVariants}>
        <h2 style={{ marginBottom: '1.5rem' }}>Active Assignments</h2>
        {assignments.map(a => <PopCard key={a.id || a._id} style={{ padding: '0', marginBottom: '1.5rem' }}><AssignmentCard assignment={a} role="Teacher" onEdit={handleEdit} profileData={profileData} /></PopCard>)}
      </motion.div>
    </motion.div>
  );
};
export default AssignmentsView;
