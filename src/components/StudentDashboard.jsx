import React, { useState } from 'react';
import Sidebar from './student/Sidebar';
import TopNav from './student/TopNav';
import Overview from './student/Overview';
import ResourceLibrary from './student/ResourceLibrary';
import AssignmentsView from './student/AssignmentsView';
import Communications from './student/Communications';
import CalendarView from './student/CalendarView';
import MeetingsView from './student/MeetingsView';
import AttendanceInsights from './student/AttendanceInsights';
import HelpCenter from './student/HelpCenter';

const StudentDashboard = ({ onOpenRoom, onLogout }) => {
  const [activeSection, setActiveSection] = useState('library'); 

  const renderSection = () => {
    switch(activeSection) {
      case 'overview': return <Overview setActiveSection={setActiveSection} onOpenRoom={onOpenRoom} />;
      case 'library': return <ResourceLibrary />;
      case 'assignments': return <AssignmentsView />;
      case 'communications': return <Communications />;
      case 'calendar': return <CalendarView />;
      case 'meetings': return <MeetingsView />;
      case 'attendance': return <AttendanceInsights />;
      case 'support': return <HelpCenter />;
      default: return <ResourceLibrary />;
    }
  };

  return (
    <div className="dashboard-layout" style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-main)' }}>
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

export default StudentDashboard;