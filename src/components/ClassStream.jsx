import React, { useState, useEffect } from 'react';
import { Video, FileText, Send, MoreVertical, MessageCircle, Info, ArrowLeft, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClassStream = ({ subject, onBack, onOpenRoom }) => {
  const [activeTab, setActiveTab] = useState('Stream');
  const [uploadedPosts, setUploadedPosts] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch existing assignments from DB
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(`http://${window.location.hostname}:5000/api/assignments`);
        if (res.ok) {
          const data = await res.json();
          const classAssignments = data.filter(a => a.className === subject);
          setUploadedPosts(classAssignments.map(a => ({
            id: a._id,
            author: a.uploadedBy,
            date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            text: a.title,
            attachment: a.fileName,
            type: a.fileType,
            fileSize: a.fileSize,
            fileData: a.fileData,
            avatarColor: '#10b981'
          })));
        }
      } catch (e) { console.error('Failed to fetch assignments'); }
    };
    fetchAssignments();
  }, [subject]);

  // Mock data matching your Google Classroom screenshot
  const posts = [
    {
      id: 1,
      author: 'Nikita Ahuja',
      date: 'Feb 18',
      text: 'UNIT 2 NOTES',
      attachment: 'UNIT-2 NOTES.docx',
      type: 'Microsoft Word',
      avatarColor: '#f97316' // Orange
    },
    {
      id: 2,
      author: 'Nikita Ahuja',
      date: 'Feb 18',
      text: 'assignment 1',
      attachment: 'CN assignment 1.docx',
      type: 'Microsoft Word',
      avatarColor: '#f97316'
    }
  ];

  return (
    <motion.div 
      className="stream-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Navigation Tabs */}
      <div className="stream-nav">
        <div className="stream-nav-left">
          <button className="icon-btn" onClick={onBack} style={{ marginRight: '1rem' }}>
            <ArrowLeft size={24} />
          </button>
          <div className="tabs">
            {['Stream', 'Classwork', 'People'].map(tab => (
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

      <div className="stream-content-wrapper">
        {/* Large Header Banner */}
        <div className="stream-banner">
          <div className="banner-content">
            <h1>{subject}</h1>
            <p>B.Tech ECS - 6th Semester</p>
          </div>
          <button className="info-btn"><Info size={20} /></button>
        </div>

        {/* Main 2-Column Layout */}
        <div className="stream-grid">
          
          {/* Left Column (Sidebar) */}
          <div className="stream-sidebar">
            {/* Google Meet Card */}
            <div className="info-card">
              <div className="card-header-flex">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <Video size={20} color="var(--accent)" /> Meet
                </div>
                <MoreVertical size={16} color="var(--text-muted)" />
              </div>
              <button 
                className="btn primary-btn full-width" 
                style={{ marginTop: '1rem' }}
                onClick={() => onOpenRoom('video', subject)}
              >
                Join
              </button>
            </div>

            {/* Upcoming Work Card */}
            <div className="info-card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Upcoming</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Woohoo, no work due soon!
              </p>
              <a href="#" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                View all
              </a>
            </div>
          </div>

          {/* Right Column (Feed) */}
          <div className="stream-feed">
            {/* Announce Something Box */}
            <div className="announce-box">
              <div className="user-avatar" style={{ backgroundColor: '#10b981' }}>Y</div>
              <input type="text" placeholder="Announce something to your class" />
            </div>

            {/* Upload Assignment Section */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <input 
                  type="text" 
                  placeholder="Assignment title (e.g. Unit 3 Notes)" 
                  value={assignmentTitle} 
                  onChange={e => setAssignmentTitle(e.target.value)} 
                  style={{ flex: 1, padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none', fontWeight: 600 }} 
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', background: assignmentTitle.trim() ? '#0284c7' : '#94a3b8', color: 'white', borderRadius: '8px', cursor: assignmentTitle.trim() ? 'pointer' : 'default', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s', opacity: assignmentTitle.trim() ? 1 : 0.7, whiteSpace: 'nowrap' }}>
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
                        className: subject,
                        fileName: file.name,
                        fileType,
                        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                        fileData: reader.result,
                        uploadedBy: 'Instructor'
                      };
                      try {
                        const res = await fetch(`http://${window.location.hostname}:5000/api/assignments`, {
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
                            avatarColor: '#10b981'
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

            {/* Uploaded Posts */}
            <AnimatePresence>
              {uploadedPosts.map(post => (
                <motion.div className="post-card" key={post.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
                  <div className="post-header">
                    <div className="post-author-info">
                      <div className="user-avatar" style={{ backgroundColor: post.avatarColor }}>{post.author.charAt(0)}</div>
                      <div><h4>{post.author}</h4><span className="post-date">{post.date}</span></div>
                    </div>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>NEW</span>
                  </div>
                  <div className="post-body">
                    <p>{post.text}</p>
                    <a href={post.fileData} download={post.attachment} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="attachment-box" style={{ transition: 'box-shadow 0.2s' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
                        <div className="attachment-icon"><FileText size={24} color="#2563eb" /></div>
                        <div className="attachment-details">
                          <span className="attachment-name">{post.attachment}</span>
                          <span className="attachment-type">{post.type} · {post.fileSize}</span>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="post-footer">
                    <div className="add-comment">
                      <div className="user-avatar small" style={{ backgroundColor: '#10b981' }}>Y</div>
                      <input type="text" placeholder="Add class comment..." />
                      <button className="icon-btn"><Send size={16} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Posts Stream */}
            {posts.map(post => (
              <div className="post-card" key={post.id}>
                <div className="post-header">
                  <div className="post-author-info">
                    <div className="user-avatar" style={{ backgroundColor: post.avatarColor }}>
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h4>{post.author}</h4>
                      <span className="post-date">{post.date}</span>
                    </div>
                  </div>
                  <button className="icon-btn"><MoreVertical size={20} /></button>
                </div>

                <div className="post-body">
                  <p>{post.text}</p>
                  
                  {/* Attachment Box */}
                  <div className="attachment-box">
                    <div className="attachment-icon">
                      <FileText size={24} color="#2563eb" />
                    </div>
                    <div className="attachment-details">
                      <span className="attachment-name">{post.attachment}</span>
                      <span className="attachment-type">{post.type}</span>
                    </div>
                  </div>
                </div>

                <div className="post-footer">
                  <div className="add-comment">
                    <div className="user-avatar small" style={{ backgroundColor: '#10b981' }}>Y</div>
                    <input type="text" placeholder="Add class comment..." />
                    <button className="icon-btn"><Send size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default ClassStream;