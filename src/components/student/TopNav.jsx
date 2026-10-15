import React, { useContext } from 'react';
import { Search, Bell, Settings, Menu } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

const TopNav = ({ activeSection, setActiveSection, profileData, onToggleSidebar }) => {
  const { currentUser } = useContext(AppContext);
  const displayName = currentUser?.fullName || profileData?.fullName || "Student";
  const initial = displayName.charAt(0).toUpperCase();

  const topLink = (section, label) => (
    <span 
      onClick={() => setActiveSection(section)} 
      style={{ 
        color: activeSection === section ? '#0284c7' : 'var(--text-muted)', 
        borderBottom: activeSection === section ? '2px solid #0284c7' : '2px solid transparent', 
        paddingBottom: '0.5rem', 
        cursor: 'pointer', 
        transition: 'all 0.2s', 
        fontWeight: 700,
        whiteSpace: 'nowrap',
        fontSize: '0.9rem'
      }}
    >
      {label}
    </span>
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem clamp(1rem, 3vw, 2.5rem)', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10, gap: '1rem', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.95rem', alignItems: 'center', minWidth: 0 }}>
        {onToggleSidebar && (
          <button className="mobile-menu-btn" onClick={onToggleSidebar} aria-label="Open sidebar" style={{ display: 'flex' }}>
            <Menu size={20} />
          </button>
        )}
        <h2 style={{ fontWeight: 800, fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', margin: 0, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>Scholar Stream</h2>
        <div style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '2px' }}>
          {topLink('overview', 'Dashboard')}
          {topLink('library', 'Classes')}
          {topLink('assignments', 'Assignments')}
          {topLink('attendance', 'Grades')}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
        <div style={{ position: 'relative', width: 'clamp(130px, 20vw, 220px)' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search..." style={{ width: '100%', padding: '0.4rem 0.75rem 0.4rem 2.2rem', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none', fontSize: '0.85rem' }} />
        </div>
        <Bell size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }} />
        <Settings size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }} />
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>{initial}</div>
      </div>
    </div>
  );
};
export default TopNav;