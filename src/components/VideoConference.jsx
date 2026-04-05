import React, { useState } from 'react';
import Sidebar from './teacher/Sidebar';
import TopNav from './teacher/TopNav';
import Overview from './teacher/Overview';
import Communications from './teacher/Communications';
import AssignmentsView from './teacher/AssignmentsView';
// Import your other components similarly...

const TeacherDashboard = ({ onOpenRoom, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview'); 

  const renderSection = () => {
    switch(activeSection) {
      case 'overview': return <Overview setActiveSection={setActiveSection} onOpenRoom={onOpenRoom} />;
      case 'communications': return <Communications />;
      case 'assignments': return <AssignmentsView />;
      // Add cases for 'grading', 'meetings', 'analytics', etc.
      default: return <Overview setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="dashboard-layout" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} />
      
      <main className="dashboard-main" style={{ flex: 1, padding: '0', background: 'var(--bg-main)', overflowY: 'auto' }}>
        <TopNav activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <div style={{ padding: '2.5rem 2.5rem 6rem 2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;