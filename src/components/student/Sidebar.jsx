import React from 'react';
import { motion } from 'framer-motion';
import { Home, Calendar, BookOpen, Video, Folder, MessageSquare, LogOut, ClipboardList, Target, HelpCircle, UserCheck, Bot } from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, onLogout, profileData }) => {
  const navItem = (section, icon, label) => (
    <div onClick={() => setActiveSection(section)} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.75rem 1rem', cursor: 'pointer', fontWeight: 600, borderRadius: '12px', margin: '0.2rem 1rem', transition: 'all 0.2s', fontSize: '0.9rem', color: activeSection === section ? '#0284c7' : 'var(--text-main)', background: activeSection === section ? 'rgba(2, 132, 199, 0.1)' : 'transparent', borderLeft: activeSection === section ? '4px solid #0284c7' : '4px solid transparent' }}>
      {icon} {label}
    </div>
  );

  const headerStyle = { padding: '1.25rem 1.5rem 0.4rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' };

  const fullName = profileData?.fullName || 'Student';
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <aside className="dashboard-sidebar" style={{ display: 'flex', flexDirection: 'column', width: '280px', borderRight: '1px solid var(--border)', background: 'var(--bg-card)', padding: '0 0 1rem 0', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '2rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>{initial}</div>
        <div><h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>{fullName}</h3><p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Student Portal</p></div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {navItem('overview', <Home size={18} />, 'Dashboard')}
        {navItem('calendar', <Calendar size={18} />, 'Calendar')}
        
        <div style={headerStyle}>My Learning</div>
        {navItem('assignments', <ClipboardList size={18} />, 'Assignments')}
        {navItem('library', <Folder size={18} />, 'Resource Library')}
        {navItem('meetings', <Video size={18} />, 'Live Sessions')}
        
        <div style={headerStyle}>Insights & Connect</div>
        {navItem('attendance', <UserCheck size={18} />, 'Attendance & Progress')}
        {navItem('communications', <MessageSquare size={18} />, 'Communications')}
        {navItem('ai-assistant', <Bot size={18} />, 'AI Assistant')}
        {navItem('support', <HelpCircle size={18} />, 'Help Center')}
      </nav>
      
      <div style={{ padding: '0 1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <motion.button onClick={(e) => { e.preventDefault(); onLogout(); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '0.75rem 1rem', width: '100%', borderRadius: '12px' }} whileHover={{ backgroundColor: 'var(--bg-main)' }} whileTap={{ scale: 0.95 }}><LogOut size={18} /> Logout</motion.button>
      </div>
    </aside>
  );
};
export default Sidebar;