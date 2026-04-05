import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const Setup = ({ action, onBack, onJoin }) => {
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [sessionId, setSessionId] = useState('');

  // Auto-generate an ID if creating a session
  useEffect(() => {
    if (action === 'create') {
      setSessionId(Math.random().toString(36).substring(2, 8).toUpperCase());
    } else {
      setSessionId('');
    }
  }, [action]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim() || !sessionId.trim()) return;
    
    // Pass the collected data back to the main App
    onJoin({ userName, profilePic, sessionId });
  };

  return (
    <div className="card">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={18} /> Back
      </button>
      <h2>{action === 'create' ? 'Session Setup' : 'Join Workspace'}</h2>
      
      <form onSubmit={handleSubmit} className="setup-form">
        <div className="input-field">
          <label>Your Name</label>
          <input 
            type="text" 
            required 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            placeholder="Enter display name"
          />
        </div>
        <div className="input-field">
          <label>Profile Photo URL (Optional)</label>
          <input 
            type="text" 
            value={profilePic} 
            onChange={(e) => setProfilePic(e.target.value)} 
            placeholder="Paste image link here"
          />
        </div>

        {action === 'join' ? (
          <div className="input-field">
            <label>Session ID</label>
            <input 
              type="text" 
              required 
              maxLength={6}
              value={sessionId} 
              onChange={(e) => setSessionId(e.target.value.toUpperCase())} 
              placeholder="Enter 6-character ID"
            />
          </div>
        ) : (
          <div className="id-display">
            <span>Your Session ID:</span>
            <h3>{sessionId}</h3>
            <p>Share this with your peers</p>
          </div>
        )}
        
        <button type="submit" className="btn primary-btn full-width">Enter Session</button>
      </form>
    </div>
  );
};

export default Setup;