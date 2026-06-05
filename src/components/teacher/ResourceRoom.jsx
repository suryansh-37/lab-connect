import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { motion } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { BookOpen, Link as LinkIcon, Plus, Copy, AlertCircle } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const ResourceRoom = () => {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [classGroup, setClassGroup] = useState('General');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchResources = async () => {
      try {
          const res = await fetch(`${API_BASE_URL}/api/resources`);
          const data = await res.json();
          if (res.ok) setResources(data);
      } catch (err) {
          setErrorMsg("Could not fetch resources from MongoDB database.");
      }
  };

  useEffect(() => {
      fetchResources();
  }, []);

  const handleShare = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
        const payload = { title, description, url, classGroup, uploadedBy: 'Teacher Admin' };
        const res = await fetch(`${API_BASE_URL}/api/resources`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error("Failed to post resource to Database.");
        
        // Reset form
        setTitle(''); setDescription(''); setUrl(''); 
        fetchResources(); // Refresh DB
    } catch (err) {
        setErrorMsg(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Upload Panel */}
      <PopCard>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><BookOpen color="var(--accent)" /> Share Resources</h2>
        
        {errorMsg && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><AlertCircle size={16}/> {errorMsg}</div>}

        <form onSubmit={handleShare} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
               <div style={{ flex: 1, minWidth: '250px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Resource Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Physics Midterm Cheatsheet" style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }} required />
               </div>
               <div style={{ width: '200px' }}>
                   <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Target Class Group</label>
                   <select value={classGroup} onChange={e => setClassGroup(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}>
                        <option value="General">General Broadcast</option>
                        <option value="Bio 101">Bio 101</option>
                        <option value="Chem 201">Chem 201</option>
                   </select>
               </div>
           </div>

           <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Document URL (Web Link, PDF Drop, Video)</label>
                <div style={{ position: 'relative' }}>
                    <LinkIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }} required />
                </div>
           </div>

           <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Context / Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" placeholder="Briefly describe what this resource contains..." style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }} required></textarea>
           </div>

           <button type="submit" disabled={isLoading} className="btn primary-btn" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1 }}><Plus size={18} /> {isLoading ? 'Posting to DB...' : 'Post Resource to Hub'}</button>
        </form>
      </PopCard>

      {/* Vault Roster */}
      <PopCard>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>Resource Vault (MongoDB)</h3>
        
        {resources.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--bg-main)', borderRadius: '12px' }}><i>No resources uploaded to database yet.</i></div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {resources.map((res) => (
                    <motion.div key={res._id} variants={itemVariants} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '0.2rem 0.6rem', borderRadius: '12px', marginBottom: '0.5rem', display: 'inline-block' }}>{res.classGroup}</span>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>{res.title}</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{res.description}</p>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uploaded by {res.uploadedBy} • {new Date(res.createdAt).toLocaleDateString()}</div>
                        </div>
                        <a href={res.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.5rem 0.8rem', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}><Copy size={16} /> Open Link</a>
                    </motion.div>
                ))}
            </div>
        )}
      </PopCard>

    </motion.div>
  );
};

export default ResourceRoom;
