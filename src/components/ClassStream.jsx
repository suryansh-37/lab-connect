import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { Video, FileText, Send, MoreVertical, Info, ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClassStream = ({ subject, onBack, onOpenRoom }) => {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [activeTab, setActiveTab] = useState('Stream');
  const [uploadedPosts, setUploadedPosts] = useState([]);
  const [streamPosts, setStreamPosts] = useState([]);
  const [announcementText, setAnnouncementText] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignDesc, setNewAssignDesc] = useState('');
  const [newAssignDueDate, setNewAssignDueDate] = useState('');

  // Retrieve user role from localStorage safely
  const userRole = (localStorage.getItem('role') || localStorage.getItem('userRole') || '')?.toLowerCase();
  const isTeacher = userRole === 'teacher';
  const isStudent = userRole === 'student';

  const loggedInUserJson = localStorage.getItem('user');
  const loggedInUser = loggedInUserJson ? JSON.parse(loggedInUserJson) : null;
  const currentUserId = loggedInUser?.id || loggedInUser?._id;

  // Fetch specific details for this class and its posts/assignments
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      let activeSub = subject;
      let targetClassId = classId;
      const token = localStorage.getItem('token');

      if (classId) {
        const res = await fetch(`${API_BASE_URL}/api/classes/${classId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch class details');
        }
        const data = await res.json();
        setClassData(data);
        activeSub = data?.courseName || subject;
        targetClassId = classId;
      } else if (subject) {
        const res = await fetch(`${API_BASE_URL}/api/classes/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const classes = await res.json();
          const matchingClass = (classes || []).find(c => c?.courseName === subject);
          if (matchingClass) {
            setClassData(matchingClass);
            activeSub = matchingClass.courseName || subject;
            targetClassId = matchingClass._id;
          }
        }
      }

      if (activeSub) {
        // Fetch Announcements
        const announcementsRes = await fetch(`${API_BASE_URL}/api/announcements`);
        let classAnnouncements = [];
        if (announcementsRes.ok) {
          const announcementsData = await announcementsRes.json();
          classAnnouncements = Array.isArray(announcementsData)
            ? announcementsData.filter(a => a?.className === activeSub)
            : [];
        }

        // Fetch Class Assignments (using classId if available, fallback to className)
        let classAssignments = [];
        if (targetClassId) {
          const assignmentsRes = await fetch(`${API_BASE_URL}/api/classes/${targetClassId}/assignments`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (assignmentsRes.ok) {
            classAssignments = await assignmentsRes.json();
          }
        } else {
          // Fallback if targetClassId not resolved
          const assignmentsRes = await fetch(`${API_BASE_URL}/api/assignments`);
          if (assignmentsRes.ok) {
            const assignmentsData = await assignmentsRes.json();
            classAssignments = Array.isArray(assignmentsData)
              ? assignmentsData.filter(a => a?.className === activeSub)
              : [];
          }
        }

        setUploadedPosts(classAssignments.map(a => ({
          id: a?._id,
          author: a?.uploadedBy || 'Instructor',
          date: a?.createdAt ? new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
          text: a?.title || '',
          attachment: a?.fileName || '',
          type: a?.fileType || '',
          fileSize: a?.fileSize || '',
          fileData: a?.fileData || '',
          avatarColor: '#10b981',
          timestamp: a?.createdAt ? new Date(a.createdAt).getTime() : 0,
          isAnnouncement: false,
          submissions: a?.submissions || []
        })));

        setStreamPosts(classAnnouncements.map(a => ({
          id: a?._id,
          author: a?.author || 'Instructor',
          date: a?.createdAt ? new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
          text: a?.text || '',
          avatarColor: a?.avatarColor || '#0284c7',
          timestamp: a?.createdAt ? new Date(a.createdAt).getTime() : 0,
          isAnnouncement: true
        })));
      }
    } catch (err) {
      console.error('Error fetching stream data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [classId, subject]);

  const activeSubject = classData?.courseName || subject || '';

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    const token = localStorage.getItem('token');
    const targetClassId = classId || classData?._id;

    try {
      const res = await axios.post(`${API_BASE_URL}/api/classes/${targetClassId}/announcements`, 
        { text: announcementText.trim() },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (res.status === 200 || res.status === 201) {
        const saved = res.data;
        setStreamPosts(prev => [{
          id: saved._id,
          author: saved.author,
          date: new Date(saved.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          text: saved.text,
          avatarColor: saved.avatarColor,
          timestamp: new Date(saved.createdAt).getTime(),
          isAnnouncement: true
        }, ...prev]);
        setAnnouncementText('');
      }
    } catch (err) {
      console.error('Error posting announcement:', err);
    }
  };

  const handleDeletePost = async (id, isAnnouncement) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const endpoint = isAnnouncement
        ? `${API_BASE_URL}/api/announcements/${id}`
        : `${API_BASE_URL}/api/assignments/${id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        if (isAnnouncement) {
          setStreamPosts(prev => prev.filter(post => post.id !== id));
        } else {
          setUploadedPosts(prev => prev.filter(post => post.id !== id));
        }
      } else {
        alert("Failed to delete post.");
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    const confirmRemove = window.confirm("Are you sure you want to remove this student from this class?");
    if (!confirmRemove) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/classes/${classId}/remove-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentId })
      });
      if (res.ok) {
        const updatedClass = await res.json();
        setClassData(updatedClass);
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to remove student.");
      }
    } catch (err) {
      console.error('Error removing student:', err);
    }
  };

  const handleStudentSubmitWork = async (assignmentId, event) => {
    const file = event.target.files[0];
    console.log('File selected:', event.target.files[0]);
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem('token');
        const payload = {
          fileUrl: reader.result,
          fileName: file.name
        };

        const res = await fetch(`${API_BASE_URL}/api/assignments/${assignmentId}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert("Work submitted successfully!");
          loadData();
        } else {
          const errorData = await res.json();
          alert(errorData.message || "Failed to submit work.");
        }
      } catch (err) {
        console.error('Error submitting student work:', err);
        alert("Error submitting work.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateClassworkAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignTitle.trim()) return;

    const token = localStorage.getItem('token');
    const targetClassId = classId || classData?._id;

    const payload = {
      title: newAssignTitle.trim(),
      description: newAssignDesc.trim(),
      dueDate: newAssignDueDate,
      classId: targetClassId,
      className: classData?.courseName || subject || '',
      fileName: 'Materials.pdf',
      fileType: 'PDF Document',
      fileSize: '0 MB',
      fileData: 'No Data',
      uploadedBy: 'Instructor'
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/assignments/create`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 200 || res.status === 201) {
        const saved = res.data;
        const newAssignObj = {
          id: saved._id,
          author: saved.uploadedBy || 'Instructor',
          date: saved.createdAt ? new Date(saved.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
          text: saved.title || '',
          attachment: saved.fileName || '',
          type: saved.fileType || '',
          fileSize: saved.fileSize || '',
          fileData: saved.fileData || '',
          avatarColor: '#10b981',
          timestamp: saved.createdAt ? new Date(saved.createdAt).getTime() : Date.now(),
          isAnnouncement: false,
          submissions: saved.submissions || []
        };
        
        setUploadedPosts(prev => [newAssignObj, ...prev]);
        setNewAssignTitle('');
        setNewAssignDesc('');
        setNewAssignDueDate('');
        setShowCreateForm(false);
      }
    } catch (err) {
      console.error('Error creating classwork assignment:', err);
    }
  };

  const combinedFeed = [
    ...streamPosts,
    ...uploadedPosts
  ].sort((a, b) => b.timestamp - a.timestamp);

  if (isLoading) return <div className="loading-spinner">Loading portal...</div>;

  if (error) {
    return (
      <div className="error-boundary" style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '1rem' }}>Session Error or Connection Failure</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={onBack} style={{ background: '#0284c7', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '25px', cursor: 'pointer', fontWeight: 700 }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="stream-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Navigation Tabs */}
      <div className="stream-nav" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="stream-nav-left">
          <button className="icon-btn" onClick={onBack} style={{ marginRight: '1rem' }}>
            <ArrowLeft size={24} />
          </button>
          <div className="tabs">
            {(['Stream', 'Classwork', 'People'] || []).map(tab => (
              <button 
                key={tab} 
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="stream-nav-right">
          <button className="icon-btn"><Video size={20} /></button>
        </div>
      </div>

      <div className="stream-content-wrapper" style={{ padding: '2rem 1.5rem' }}>
        {/* Large Header Banner */}
        <div className="stream-banner" style={{ 
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <div className="banner-content">
            <h1 style={{ fontWeight: 800 }}>{activeSubject || 'Loading Class...'}</h1>
            <p style={{ opacity: 0.95 }}>{classData?.courseName || ''}</p>
          </div>
          <button className="info-btn"><Info size={20} /></button>
        </div>

        {/* Tab-Based Render Switch */}
        {activeTab === 'Stream' && (
          <div className="stream-grid">
            
            {/* Left Column (Sidebar) */}
            <div className="stream-sidebar">
              {/* Google Meet Card */}
              <motion.div 
                className="info-card"
                whileHover={{ y: -2 }}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)' }}
              >
                <div className="card-header-flex">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    <Video size={20} color="#0284c7" /> Meet
                  </div>
                  <MoreVertical size={16} color="var(--text-muted)" />
                </div>
                <motion.button 
                  className="btn primary-btn full-width" 
                  whileHover={{ scale: 1.02, background: '#0274b0' }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                     marginTop: '1rem',
                     background: '#0284c7',
                     borderRadius: '20px',
                     padding: '0.55rem 1.25rem',
                     fontSize: '0.85rem',
                     fontWeight: 700,
                     cursor: 'pointer',
                     border: 'none',
                     color: 'white',
                     boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
                  }}
                  onClick={() => {
                    console.log('Join Meet clicked for subject:', activeSubject);
                    onOpenRoom('video', activeSubject);
                  }}
                >
                  Join
                </motion.button>
              </motion.div>

              {/* Upcoming Work Card */}
              <motion.div 
                className="info-card"
                whileHover={{ y: -2 }}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)' }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Upcoming</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Woohoo, no work due soon!
                </p>
                <a href="#" style={{ color: '#0284c7', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                  View all
                </a>
              </motion.div>
            </div>

            {/* Right Column (Feed) */}
            <div className="stream-feed">
              {/* Announce Box (Teachers Only) */}
              {userRole === 'teacher' && (
                <div className="announce-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'stretch', cursor: 'default', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="user-avatar" style={{ backgroundColor: '#10b981', flexShrink: 0 }}>Y</div>
                    <input 
                      type="text" 
                      placeholder="Announce something to your class" 
                      value={announcementText}
                      onChange={e => setAnnouncementText(e.target.value)}
                      style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.95rem', color: 'var(--text-main)' }}
                    />
                  </div>
                  {announcementText.trim() && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button 
                        onClick={() => setAnnouncementText('')} 
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handlePostAnnouncement}
                        style={{ background: '#0284c7', color: 'white', border: 'none', borderRadius: '20px', padding: '0.5rem 1.25rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        Post
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Assignment Section (Teachers Only) */}
              {userRole === 'teacher' && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <input 
                      type="text" 
                      placeholder="Assignment title (e.g. Unit 3 Notes)" 
                      value={assignmentTitle} 
                      onChange={e => setAssignmentTitle(e.target.value)} 
                      style={{ flex: 1, padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none', fontWeight: 600, background: 'var(--bg-main)', color: 'var(--text-main)' }} 
                    />
                    <label 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        padding: '0.5rem 1.25rem', 
                        background: assignmentTitle.trim() ? '#0284c7' : '#94a3b8', 
                        color: 'white', 
                        borderRadius: '20px', 
                        cursor: assignmentTitle.trim() ? 'pointer' : 'default', 
                        fontWeight: 750, 
                        fontSize: '0.85rem', 
                        transition: 'all 0.2s', 
                        opacity: assignmentTitle.trim() ? 1 : 0.7, 
                        whiteSpace: 'nowrap' 
                      }}
                      onMouseOver={(e) => {
                        if (assignmentTitle.trim()) {
                          e.currentTarget.style.background = '#0274b0';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (assignmentTitle.trim()) {
                          e.currentTarget.style.background = '#0284c7';
                        }
                      }}
                      onClick={() => {
                        console.log('Upload Assignment initiated for title:', assignmentTitle);
                      }}
                    >
                      <Upload size={16} /> {isUploading ? 'Uploading...' : 'Upload'}
                      <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xlsx" style={{ display: 'none' }} disabled={!assignmentTitle.trim() || isUploading} onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file || !assignmentTitle.trim()) return;
                        setIsUploading(true);
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                          const fileType = file.type.includes('pdf') ? 'PDF Document' : file.name.endsWith('.docx') || file.name.endsWith('.doc') ? 'Microsoft Word' : file.name.endsWith('.pptx') ? 'PowerPoint' : 'Document';
                           const payload = {
                            title: assignmentTitle,
                            className: activeSubject,
                            classId: classData?._id,
                            fileName: file.name,
                            fileType,
                            fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                            fileData: reader.result,
                            uploadedBy: 'Instructor'
                          };
                          console.log('Upload Assignment payload:', payload);
                          try {
                            const res = await fetch(`${API_BASE_URL}/api/assignments`, {
                              method: 'POST', headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(payload)
                            });
                            if (res.ok) {
                              const saved = await res.json();
                              setUploadedPosts(prev => [{
                                id: saved._id,
                                author: 'Instructor',
                                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                text: assignmentTitle,
                                attachment: file.name,
                                type: fileType,
                                fileSize: payload.fileSize,
                                fileData: reader.result,
                                avatarColor: '#10b981',
                                timestamp: Date.now(),
                                isAnnouncement: false,
                                submissions: saved.submissions || []
                              }, ...prev]);
                              setAssignmentTitle('');
                            }
                          } catch (err) { console.error('Upload failed'); }
                          setIsUploading(false);
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }} />
                    </label>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Enter a title first, then click Upload to attach a PDF or document. Students can see and download it.</p>
                </div>
              )}

              {/* Combined Feed Stream */}
              {combinedFeed.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4rem 2rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)'
                }}>
                  <Info size={40} color="var(--accent)" style={{ marginBottom: '1rem', opacity: 0.7 }} />
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>No announcements yet</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', lineHeight: '1.5' }}>
                    This is where you'll see announcements, assignments, and updates for this class.
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {combinedFeed?.map(post => {
                    if (post.isAnnouncement) {
                      return (
                        <motion.div 
                          className="post-card" 
                          key={post.id} 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)' }}
                        >
                          <div className="post-header" style={{ padding: 0, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="post-author-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div className="user-avatar" style={{ backgroundColor: post.avatarColor || '#0284c7', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifycontent: 'center', color: 'white', fontWeight: 600 }}>
                                {post.author?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{post.author}</h4>
                                <span className="post-date" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{post.date}</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>POST</span>
                              {isTeacher && (
                                <button 
                                  onClick={() => handleDeletePost(post.id, true)} 
                                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', padding: '0.25rem' }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="post-body" style={{ padding: 0 }}>
                            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-main)' }}>{post.text}</p>
                          </div>
                          <div className="post-footer" style={{ borderTop: '1px solid var(--border)', padding: '1rem 0 0 0', marginTop: '1rem' }}>
                            <div className="add-comment">
                              <div className="user-avatar small" style={{ backgroundColor: '#10b981' }}>Y</div>
                              <input type="text" placeholder="Add class comment..." />
                              <button className="icon-btn"><Send size={16} /></button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    } else {
                      const mySubmission = post.submissions?.find(
                        sub => (sub.studentId?._id || sub.studentId) === currentUserId
                      );

                      return (
                        <motion.div 
                          className="post-card" 
                          key={post.id} 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)' }}
                        >
                          <div className="post-header" style={{ padding: 0, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="post-author-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div className="user-avatar" style={{ backgroundColor: post.avatarColor || '#10b981', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifycontent: 'center', color: 'white', fontWeight: 600 }}>
                                {post.author?.charAt(0) || 'I'}
                              </div>
                              <div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{post.author}</h4>
                                <span className="post-date" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{post.date}</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>ASSIGNMENT</span>
                              {isTeacher && (
                                <button 
                                  onClick={() => handleDeletePost(post.id, false)} 
                                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', padding: '0.25rem' }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="post-body" style={{ padding: 0 }}>
                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-main)' }}>{post.text}</p>
                            {post.attachment && (
                              <a href={post.fileData} download={post.attachment} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="attachment-box" style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', maxWidth: '400px', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
                                  <div className="attachment-icon" style={{ width: '80px', display: 'flex', alignItems: 'center', justifycontent: 'center', borderRight: '1px solid var(--border)', background: 'var(--bg-main)' }}><FileText size={24} color="#2563eb" /></div>
                                  <div className="attachment-details" style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', justifycontent: 'center' }}>
                                    <span className="attachment-name" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem' }}>{post.attachment}</span>
                                    <span className="attachment-type" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{post.type} · {post.fileSize}</span>
                                  </div>
                                </div>
                              </a>
                            )}

                            {/* Student Submission Panel */}
                            {isStudent && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start', background: 'var(--bg-main)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)', width: '100%', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                  <span style={{ fontSize: '0.85rem', fontWeight: 650, color: 'var(--text-main)' }}>Your Work</span>
                                  {mySubmission ? (
                                    <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                                      ✓ Submitted
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
                                      Assigned
                                    </span>
                                  )}
                                </div>
                                {mySubmission && (
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    File: <a href={mySubmission.fileUrl} download={mySubmission.fileName || 'Submission.pdf'} style={{ color: '#0284c7', textDecoration: 'underline', fontWeight: 600 }}>{mySubmission.fileName || 'Submission.pdf'}</a>
                                  </div>
                                )}
                                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.45rem 0.85rem', background: '#0284c7', color: 'white', borderRadius: '20px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 750, transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#0274b0'} onMouseOut={e => e.currentTarget.style.background = '#0284c7'}>
                                  <Upload size={14} /> {mySubmission ? 'Resubmit' : 'Choose File & Submit'}
                                  <input 
                                    type="file" 
                                    style={{ display: 'none' }} 
                                    onChange={(e) => handleStudentSubmitWork(post.id, e)} 
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                          <div className="post-footer" style={{ borderTop: '1px solid var(--border)', padding: '1rem 0 0 0', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="add-comment" style={{ flex: 1 }}>
                              <div className="user-avatar small" style={{ backgroundColor: '#10b981' }}>Y</div>
                              <input type="text" placeholder="Add class comment..." />
                              <button className="icon-btn"><Send size={16} /></button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                  })}
                </AnimatePresence>
              )}
            </div>

          </div>
        )}

        {/* Classwork Tab View */}
        {activeTab === 'Classwork' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Classwork Assignments
              </h2>
              {userRole === 'teacher' && (
                <button 
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  style={{ background: '#0284c7', color: 'white', border: 'none', borderRadius: '20px', padding: '0.5rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  {showCreateForm ? 'Cancel' : '+ Create Assignment'}
                </button>
              )}
            </div>

            {userRole === 'teacher' && showCreateForm && (
              <form onSubmit={handleCreateClassworkAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>New Assignment</h3>
                <input 
                  type="text" 
                  placeholder="Assignment Title" 
                  value={newAssignTitle} 
                  onChange={e => setNewAssignTitle(e.target.value)} 
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none' }}
                  required 
                />
                <textarea 
                  placeholder="Instructions / Description" 
                  value={newAssignDesc} 
                  onChange={e => setNewAssignDesc(e.target.value)} 
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none' }}
                  rows="3" 
                  required 
                />
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Due Date:</label>
                  <input 
                    type="date" 
                    value={newAssignDueDate} 
                    onChange={e => setNewAssignDueDate(e.target.value)} 
                    style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none' }}
                    required 
                  />
                </div>
                <button type="submit" style={{ alignSelf: 'flex-start', background: '#10b981', color: 'white', border: 'none', borderRadius: '20px', padding: '0.5rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                  Post Assignment
                </button>
              </form>
            )}

            {(!uploadedPosts || uploadedPosts.length === 0) ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <Info size={40} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No assignments have been assigned yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {uploadedPosts?.map(post => {
                  const mySubmission = post.submissions?.find(
                    sub => (sub.studentId?._id || sub.studentId) === currentUserId
                  );
                  
                  return (
                    <div key={post.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', padding: '0.6rem', borderRadius: '50%', display: 'flex' }}>
                            <FileText size={20} />
                          </div>
                          <div>
                            <h4 style={{ fontWeight: 700, margin: 0, color: 'var(--text-main)', fontSize: '0.95rem' }}>{post.text}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned: {post.date}</span>
                          </div>
                        </div>
                        
                        {isStudent && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {mySubmission ? (
                              <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                                ✓ Submitted
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>
                                Assigned
                              </span>
                            )}
                            <label style={{ background: '#0284c7', color: 'white', border: 'none', borderRadius: '20px', padding: '0.45rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Upload size={14} /> {mySubmission ? 'Resubmit' : 'Submit'}
                              <input 
                                type="file" 
                                style={{ display: 'none' }} 
                                onChange={(e) => handleStudentSubmitWork(post.id, e)} 
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      {post.attachment && (
                        <div style={{ marginLeft: '3.5rem' }}>
                          <a href={post.fileData} download={post.attachment} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.75rem', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg-card)', fontSize: '0.8rem', cursor: 'pointer' }}>
                              <FileText size={14} color="#2563eb" />
                              <span>{post.attachment}</span>
                            </div>
                          </a>
                        </div>
                      )}

                      {isStudent && mySubmission && (
                        <div style={{ marginLeft: '3.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Submitted file: <a href={mySubmission.fileUrl} download={mySubmission.fileName || 'Submission.pdf'} style={{ color: '#0284c7', textDecoration: 'underline' }}>{mySubmission.fileName || 'Submission.pdf'}</a>
                        </div>
                      )}

                      {isTeacher && (
                        <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                          <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            Student Submissions ({post.submissions?.length || 0})
                          </h5>
                          {(!post.submissions || post.submissions.length === 0) ? (
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              No submissions yet.
                            </p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {post.submissions.map((sub, idx) => {
                                const studentName = sub.studentId?.fullName || sub.studentId?.name || 'Unknown Student';
                                const studentEmail = sub.studentId?.email || '';
                                return (
                                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ fontSize: '0.85rem', fontWeight: 650, color: 'var(--text-main)' }}>
                                        {studentName}
                                      </span>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {studentEmail} • Submitted at {new Date(sub.submittedAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <a 
                                      href={sub.fileUrl} 
                                      download={sub.fileName || 'Submission.pdf'} 
                                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', background: '#10b981', color: 'white', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}
                                    >
                                      <FileText size={14} /> Download ({sub.fileName || 'Submission.pdf'})
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* People Tab View */}
        {activeTab === 'People' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)', maxWidth: '800px', margin: '0 auto' }}>
            {/* Teacher section */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Teachers
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                  {classData?.teacherId?.fullName?.charAt(0) || 'T'}
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{classData?.teacherId?.fullName || 'Instructor'}</span>
              </div>
            </div>

            {/* Students section */}
            <div>
              {(() => {
                const loggedInUserJson = localStorage.getItem('user');
                const loggedInUser = loggedInUserJson ? JSON.parse(loggedInUserJson) : null;
                
                let enrolledStudentsList = classData?.enrolledStudents || [];
                
                if (isStudent && loggedInUser) {
                  const isSelfEnrolled = enrolledStudentsList.some(
                    s => s.email === loggedInUser.email || s._id === loggedInUser.id || s._id === loggedInUser._id
                  );
                  
                  if (!isSelfEnrolled) {
                    enrolledStudentsList = [
                      ...enrolledStudentsList,
                      {
                        _id: loggedInUser.id || loggedInUser._id || 'self-id',
                        fullName: loggedInUser.fullName || loggedInUser.name || 'You',
                        name: loggedInUser.name || loggedInUser.fullName || 'You',
                        email: loggedInUser.email || '',
                        isSelf: true
                      }
                    ];
                  }
                }

                return (
                  <>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Classmates</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {enrolledStudentsList.length} students
                      </span>
                    </h2>
                    {enrolledStudentsList.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0' }}>No students enrolled in this class.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {enrolledStudentsList.map(student => {
                          const studentName = student.name || 'Unknown Student';
                          const isSelf = student.isSelf || (isStudent && loggedInUser && (student.email === loggedInUser.email || student._id === loggedInUser.id || student._id === loggedInUser._id));
                          
                          const displayName = isSelf ? `${studentName} (You)` : studentName;
                          const avatarChar = studentName.charAt(0).toUpperCase();

                          return (
                            <div key={student._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                                  {avatarChar || 'S'}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{displayName}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.email}</div>
                                </div>
                              </div>
                              {isTeacher && (
                                <button 
                                  onClick={() => handleRemoveStudent(student._id)}
                                  style={{
                                    background: 'transparent',
                                    color: '#ef4444',
                                    border: '1px solid #fee2e2',
                                    borderRadius: '8px',
                                    padding: '0.35rem 0.75rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseOver={e => { e.currentTarget.style.background = '#fef2f2'; }}
                                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ClassStream;