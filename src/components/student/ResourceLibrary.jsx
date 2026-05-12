import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Folder, MoreVertical, FileText, Video, UploadCloud, SlidersHorizontal, Grid, Plus } from 'lucide-react';

const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch(`http://${window.location.hostname}:5000/api/resources`);
        if (res.ok) {
          const data = await res.json();
          setResources(data);
        }
      } catch (err) {
        console.error("Failed to fetch resources");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  const classGroups = ['General', ...new Set(resources.map(r => r.classGroup).filter(c => c !== 'General'))];
  
  const folders = classGroups.map((group, idx) => {
    const count = resources.filter(r => r.classGroup === group).length;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#0ea5e9', '#8b5cf6'];
    const color = colors[idx % colors.length];
    return {
      title: group === 'General' ? 'General Resources' : group,
      code: group === 'General' ? 'Broadcast' : 'Course Module',
      count: count,
      bg: `${color}15`,
      color: color
    };
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Library / <span style={{ color: '#0284c7' }}>Course Folders</span></p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Academic Modules</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>Access and organize your curated subject resources.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: 600, cursor: 'pointer' }}><SlidersHorizontal size={16}/> Filter</button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: 600, cursor: 'pointer' }}><Grid size={16}/> Layout</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {folders.map((folder, idx) => (
          <PopCard key={idx} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ background: folder.bg, color: folder.color, padding: '0.75rem', borderRadius: '12px' }}><Folder size={24}/></div>
              <MoreVertical size={20} color="var(--text-muted)"/>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>{folder.title}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '1rem', display: 'block' }}>{folder.code}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: 'auto' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: folder.color }}>{folder.count}</span><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Resources</span>
            </div>
          </PopCard>
        ))}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>Shared Resources ({resources.length})</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isLoading ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading materials...</p>
          ) : resources.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
               <UploadCloud size={40} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
               <p style={{ color: 'var(--text-muted)' }}>No shared resources available at the moment.</p>
            </div>
          ) : resources.map((file, idx) => (
            <PopCard key={file._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', background: 'var(--bg-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ background: '#3b82f615', padding: '0.8rem', borderRadius: '12px' }}><FileText size={20} color="#3b82f6"/></div>
                <div><h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{file.title}</h4><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{file.description}</span></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <span style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>{file.classGroup}</span>
                <a href={file.url} target="_blank" rel="noreferrer" style={{ background: '#0284c7', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>Open Link</a>
              </div>
            </PopCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
export default ResourceLibrary;