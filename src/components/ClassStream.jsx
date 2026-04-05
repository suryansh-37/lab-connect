import React, { useState } from 'react';
import { Video, FileText, Send, MoreVertical, MessageCircle, Info, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ClassStream = ({ subject, onBack, onOpenRoom }) => {
  const [activeTab, setActiveTab] = useState('Stream');

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