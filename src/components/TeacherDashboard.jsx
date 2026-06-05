import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
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

const TeacherDashboard = ({ onOpenRoom, onLogout, onForceLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(() => {
    if (window.location.pathname.startsWith('/teacher-dashboard/')) {
      const section = window.location.pathname.split('/teacher-dashboard/')[1];
      if (section) return section;
    }
    return 'overview';
  }); 
  const [activeChatSubject, setActiveChatSubject] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.pathname.startsWith('/teacher-dashboard/')) {
      const section = location.pathname.split('/teacher-dashboard/')[1];
      if (section && section !== activeSection) {
        setActiveSection(section);
      }
    } else if (location.pathname === '/teacher-dashboard' || location.pathname === '/teacher-dashboard/') {
      if (activeSection !== 'overview') {
        setActiveSection('overview');
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const currentPath = `/teacher-dashboard/${activeSection}`;
    if (location.pathname !== currentPath) {
      navigate(currentPath);
    }
  }, [activeSection, navigate, location.pathname]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          onForceLogout('Teacher');
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            onForceLogout('Teacher');
            return;
          }
          throw new Error("Failed to retrieve profile data.");
        }

        const data = await res.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [onForceLogout]);

  if (isLoading) return <div className="loading-spinner">Loading portal...</div>;

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: '#ef4444', fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ fontWeight: 850, fontSize: '1.75rem', marginBottom: '0.75rem' }}>Session Expired or Profile Error</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', lineHeight: '1.6' }}>{error}</p>
        <button onClick={onLogout} style={{ background: '#0284c7', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '25px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(2,132,199,0.3)', transition: 'transform 0.2s' }}>
          Return to Login
        </button>
      </div>
    );
  }

  const handleOpenInternalChat = (title) => {
      setActiveChatSubject(title);
      setActiveSection('active-chat');
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'overview': return <Overview setActiveSection={setActiveSection} onOpenRoom={onOpenRoom} profileData={profileData} />;
      case 'my-classes': return <MyClasses />;
      case 'calendar': return <CalendarView />;
      case 'assignments': return <AssignmentsView profileData={profileData} />;
      case 'grading': return <Grading setActiveSection={setActiveSection} />;
      case 'meetings': return <MeetingsView />;
      case 'temp-lab': return <TempLabSession onOpenInternalChat={handleOpenInternalChat} />;
      case 'active-chat': return <GroupChat subject={activeChatSubject} userName={profileData?.fullName || "Teacher"} userRole="Teacher" onBack={() => setActiveSection('temp-lab')} isEmbedded={true} />;
      case 'resources': return <ResourceRoom />;
      case 'attendance': return <Attendance />;
      case 'engagement': return <Engagement />;
      case 'performance': return <Performance />;
      case 'analytics': return <Analytics />;
      case 'reports': return <Reports />;
      case 'ai-assistant': return <AIAssistant />;
      case 'communications': return <Communications profileData={profileData} />;
      default: return <Overview setActiveSection={setActiveSection} onOpenRoom={onOpenRoom} profileData={profileData} />;
    }
  };

  return (
    <div className="dashboard-layout" style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} profileData={profileData} />
      
      <main className="dashboard-main" style={{ flex: 1, minHeight: 0, padding: '0', background: 'var(--bg-main)', overflowY: (activeSection === 'communications' || activeSection === 'active-chat') ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column' }}>
        <TopNav activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} profileData={profileData} />
        
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