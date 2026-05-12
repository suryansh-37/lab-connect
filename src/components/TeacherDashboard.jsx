import React, { useState } from 'react';
import Sidebar from './teacher/Sidebar';
import TopNav from './teacher/TopNav';
import Overview from './teacher/Overview';
import MyClasses from './teacher/MyClasses';
import CalendarView from './teacher/CalendarView';
import AssignmentsView from './teacher/AssignmentsView';
import Grading from './teacher/Grading';
import MeetingsView from './teacher/MeetingsView';
import Attendance from './teacher/Attendance';
import { Engagement, Performance } from './teacher/StudentInsights';
import { Analytics, Reports } from './teacher/AnalyticsReports';
import AIAssistant from './teacher/AIAssistant';
import Communications from './teacher/Communications';
import ResourceRoom from './teacher/ResourceRoom';
import TempLabSession from './teacher/TempLabSession';
import GroupChat from './GroupChat';

const TeacherDashboard = ({ onOpenRoom, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview'); 
  const [activeChatSubject, setActiveChatSubject] = useState(null);

  const handleOpenInternalChat = (title) => {
      setActiveChatSubject(title);
      setActiveSection('active-chat');
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'overview': return <Overview setActiveSection={setActiveSection} onOpenRoom={onOpenRoom} />;
      case 'my-classes': return <MyClasses />;
      case 'calendar': return <CalendarView />;
      case 'assignments': return <AssignmentsView />;
      case 'grading': return <Grading setActiveSection={setActiveSection} />;
      case 'meetings': return <MeetingsView />;
      case 'temp-lab': return <TempLabSession onOpenInternalChat={handleOpenInternalChat} />;
      case 'active-chat': return <GroupChat subject={activeChatSubject} userName="Prof. Jenkins" userRole="Teacher" onBack={() => setActiveSection('temp-lab')} isEmbedded={true} />;
      case 'resources': return <ResourceRoom />;
      case 'attendance': return <Attendance />;
      case 'engagement': return <Engagement />;
      case 'performance': return <Performance />;
      case 'analytics': return <Analytics />;
      case 'reports': return <Reports />;
      case 'ai-assistant': return <AIAssistant />;
      case 'communications': return <Communications />;
      default: return <Overview setActiveSection={setActiveSection} onOpenRoom={onOpenRoom} />;
    }
  };

  return (
    <div className="dashboard-layout" style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} />
      
      <main className="dashboard-main" style={{ flex: 1, minHeight: 0, padding: '0', background: 'var(--bg-main)', overflowY: (activeSection === 'communications' || activeSection === 'active-chat') ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column' }}>
        <TopNav activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} />
        
        <div style={{ 
          padding: (activeSection === 'communications' || activeSection === 'active-chat') ? '0' : '2.5rem 2.5rem 6rem 2.5rem', 
          maxWidth: (activeSection === 'communications' || activeSection === 'active-chat') ? '100%' : '1400px', 
          margin: '0 auto',
          width: '100%',
          flex: (activeSection === 'communications' || activeSection === 'active-chat') ? 1 : 'none',
          minHeight: 0,
          display: (activeSection === 'communications' || activeSection === 'active-chat') ? 'flex' : 'block',
          flexDirection: 'column'
        }}>
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;