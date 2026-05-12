import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { Search, Filter, BookOpen } from 'lucide-react';
import AssignmentCard from '../AssignmentCard';

const AssignmentsView = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('All');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(`http://${window.location.hostname}:5000/api/assignments`);
        if (res.ok) {
          const data = await res.json();
          setAssignments(data);
        }
      } catch (e) {
        console.error('Failed to fetch assignments');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const classNames = ['All', ...new Set(assignments.map(a => a.className))];

  const filtered = assignments.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = filterClass === 'All' || a.className === filterClass;
    return matchSearch && matchClass;
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Assignments & Materials</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Documents and assignments uploaded by your instructors.</p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.75rem 1.25rem' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search assignments..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: 'var(--text-main)' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.5rem 0.75rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
            {classNames.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: '32px', height: '32px', border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', margin: '0 auto 1rem' }} />
          Loading assignments...
        </div>
      ) : filtered.length === 0 ? (
        <PopCard style={{ textAlign: 'center', padding: '4rem' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
          <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            {assignments.length === 0 ? 'No Assignments Yet' : 'No Results Found'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {assignments.length === 0 ? 'Your instructors haven\'t uploaded any assignments yet. Check back later!' : 'Try adjusting your search or filter.'}
          </p>
        </PopCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {filtered.map((assignment, idx) => (
              <AssignmentCard key={assignment._id} assignment={assignment} role="Student" />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
export default AssignmentsView;