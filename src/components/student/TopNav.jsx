import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

const TopNav = ({ activeSection, setActiveSection }) => {
  const topLink = (section, label) => (
    <span onClick={() => setActiveSection(section)} style={{ color: activeSection === section ? '#0284c7' : 'var(--text-muted)', borderBottom: activeSection === section ? '2px solid #0284c7' : '2px solid transparent', paddingBottom: '1rem', marginBottom: '-1rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 700 }}>
      {label}
    </span>
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2.5rem', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginRight: '1rem', color: 'var(--text-main)' }}>Scholar Stream</h2>
        {topLink('overview', 'Dashboard')}
        {topLink('library', 'Classes')}
        {topLink('assignments', 'Assignments')}
        {topLink('attendance', 'Grades')}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative', width: '250px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search resources..." style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none', fontSize: '0.85rem' }} />
        </div>
        <Bell size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
        <Settings size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
      </div>
    </div>
  );
};
export default TopNav;