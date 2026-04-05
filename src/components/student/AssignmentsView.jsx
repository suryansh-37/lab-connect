import React, { useState, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { UploadCloud, FileText, Link2, Send, Clock, X, CheckCircle } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import AssignmentCard from '../AssignmentCard'; 

const AssignmentsView = () => {
  const { assignments = [] } = useContext(AppContext) || {};
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'You', time: '10:42 AM', text: "Professor, should we use the standard Planck constant or the reduced one for the derivation?", isSelf: true },
    { id: 2, sender: 'Prof. Aris Thorne', time: '11:15 AM', text: "Always use the reduced Planck constant (ħ) when dealing with angular frequency. It simplifies the notation.", isSelf: false }
  ]);

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); };
  const onFileSelect = (e) => { if (e.target.files) handleFiles(e.target.files); };
  const handleFiles = (files) => setAttachedFiles([...attachedFiles, ...Array.from(files).map(file => ({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB', type: file.type }))]);
  const removeFile = (index) => setAttachedFiles(attachedFiles.filter((_, i) => i !== index));

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setChatMessages([...chatMessages, { id: Date.now(), sender: 'You', time: 'Now', text: messageInput, isSelf: true }]);
    setMessageInput('');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <motion.div variants={containerVariants}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>In Progress</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}><Clock size={16}/> Due October 28, 11:59 PM</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2, color: 'var(--text-main)' }}>Module 04: Quantum Mechanics Analysis</h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Deep dive into wave-particle duality and the mathematical foundations of the Schrödinger equation within non-linear systems.</p>
          </motion.div>

          <PopCard style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)' }}><FileText size={20} color="#0284c7"/> Assignment Instructions</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.5rem' }}>This module requires a comprehensive analytical report on the observed variance in particle behavior. Focus your attention on the transition between classical and quantum states.</p>
          </PopCard>

          <motion.div variants={containerVariants}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Submission Workspace</h3>
            <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} style={{ border: `2px dashed ${isDragging ? '#0284c7' : 'var(--border)'}`, background: isDragging ? 'rgba(2, 132, 199, 0.05)' : 'transparent', borderRadius: '24px', padding: '3.5rem 2rem', textAlign: 'center', transition: 'all 0.2s' }}>
              <div style={{ background: '#0284c7', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white' }}><UploadCloud size={24} /></div>
              <h4 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Drag and drop your report here</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Supported formats: PDF, DOCX, TEX</p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
                <button onClick={() => fileInputRef.current.click()} style={{ border: '1px solid #0284c7', color: '#0284c7', borderRadius: '25px', padding: '0.6rem 2rem', background: 'transparent', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>Select File</button>
              </div>
              <input type="file" multiple ref={fileInputRef} onChange={onFileSelect} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.tex" />
            </div>

            {attachedFiles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                {attachedFiles.map((file, idx) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'var(--bg-card)', border: '1px solid #10b981', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><CheckCircle size={20} color="#10b981"/><div><p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{file.name}</p><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{file.size} • Ready to submit</span></div></div>
                    <button type="button" onClick={() => removeFile(idx)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16}/></button>
                  </motion.div>
                ))}
                <button className="btn primary-btn" style={{ padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', marginTop: '1rem', width: '100%' }}>Submit Assignment</button>
              </div>
            )}
          </motion.div>
          {assignments.length > 0 && (
            <motion.div variants={containerVariants} style={{marginTop: '2rem'}}>
              <h2 style={{ marginBottom: '1.5rem' }}>Other Assignments</h2>
              {assignments.map(a => <PopCard key={a.id} style={{ padding: '0', marginBottom: '1.5rem' }}><AssignmentCard assignment={a} role="Student" /></PopCard>)}
            </motion.div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}><p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Private Dialogue</p><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              <AnimatePresence>
                {chatMessages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isSelf ? 'flex-end' : 'flex-start' }}>
                    <div style={{ background: msg.isSelf ? '#0284c7' : 'var(--bg-main)', color: msg.isSelf ? '#ffffff' : 'var(--text-main)', padding: '1rem 1.25rem', borderRadius: '16px', borderBottomRightRadius: msg.isSelf ? 0 : '16px', borderBottomLeftRadius: !msg.isSelf ? 0 : '16px', maxWidth: '90%', border: msg.isSelf ? 'none' : '1px solid var(--border)' }}><p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{msg.text}</p></div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{msg.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <form onSubmit={handleSendMessage} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '24px', display: 'flex', alignItems: 'center', padding: '0.4rem 0.4rem 0.4rem 1.25rem' }}>
              <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type a question..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.85rem', color: 'var(--text-main)' }} />
              <button type="submit" disabled={!messageInput.trim()} style={{ background: messageInput.trim() ? '#0284c7' : 'var(--text-muted)', border: 'none', color: 'white', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: messageInput.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}><Send size={14} style={{ marginLeft: '-2px' }}/></button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default AssignmentsView;