import React from 'react';
import { motion } from 'framer-motion';
import { Home, Calendar, BookOpen, Settings, BarChart2, Video, CheckCircle, Smile, Target, PieChart, Download, BrainCircuit, MessageSquare, LogOut, Beaker, ClipboardList, FolderUp } from 'lucide-react';
import { teachingLabs } from '../../data/mockData';

const Sidebar = ({ activeSection, setActiveSection, onLogout, profileData }) => {
  const navItem = (section, icon, label) => (
    <div onClick={() => setActiveSection(section)} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.75rem 1rem', cursor: 'pointer', fontWeight: 600, borderRadius: '12px', margin: '0.2rem 1rem', transition: 'all 0.2s', fontSize: '0.9rem', color: activeSection === section ? '#0284c7' : 'var(--text-main)', background: activeSection === section ? '#e0f2fe' : 'transparent' }}>
      {icon} {label}
    </div>
  );

  const headerStyle = { padding: '1.25rem 1.5rem 0.4rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' };

  const fullName = profileData?.fullName || 'Teacher';
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <aside className="dashboard-sidebar" style={{ display: 'flex', flexDirection: 'column', width: '280px', borderRight: '1px solid var(--border)', background: 'var(--bg-card)', padding: '0 0 1rem 0', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '2rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>{initial}</div>
        <div><h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{fullName}</h3><p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Instructor Portal</p></div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {navItem('overview', <Home size={18} />, 'Dashboard')}
        {navItem('calendar', <Calendar size={18} />, 'Calendar')}
        
        <div style={headerStyle}>Academia & Tools</div>
        {navItem('assignments', <ClipboardList size={18} />, 'Assignments')}
        {navItem('grading', <BarChart2 size={18} />, 'Grading Queue')}
        {navItem('meetings', <Video size={18} />, 'Zoom Meetings')}
        {navItem('temp-lab', <MessageSquare size={18} />, 'Temp Lab Session')}
        {navItem('resources', <FolderUp size={18} />, 'Resource Bank')}
        {navItem('attendance', <CheckCircle size={18} />, 'Attendance')}
        
        <div style={headerStyle}>Student Insight</div>
        {navItem('engagement', <Smile size={18} />, 'Engagement')}
        {navItem('performance', <Target size={18} />, 'Performance Matrix')}
        
        <div style={headerStyle}>Analytics & Intelligence</div>
        {navItem('analytics', <PieChart size={18} />, 'Class Analytics')}
        {navItem('reports', <Download size={18} />, 'Reports')}
        {navItem('ai-assistant', <BrainCircuit size={18} />, 'AI Assistant')}
        {navItem('communications', <MessageSquare size={18} />, 'Communications')}
      </nav>

      <div style={{ padding: '0 1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <motion.button onClick={(e) => { e.preventDefault(); onLogout(); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '0.75rem 1rem', width: '100%', borderRadius: '12px' }} whileHover={{ backgroundColor: 'var(--bg-main)' }} whileTap={{ scale: 0.95 }}><LogOut size={18} /> Logout</motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;