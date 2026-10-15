import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
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
import AIAssistant from './student/AIAssistant';

const StudentDashboard = ({ onOpenRoom, onLogout, onForceLogout }) => {
  const [activeSection, setActiveSection] = useState('overview'); 
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          onForceLogout('Student');
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            onForceLogout('Student');
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

  const renderSection = () => {
    switch(activeSection) {
      case 'overview': return <Overview setActiveSection={setActiveSection} onOpenRoom={onOpenRoom} profileData={profileData} />;
      case 'library': return <ResourceLibrary />;
      case 'assignments': return <AssignmentsView profileData={profileData} />;
      case 'communications': return <Communications profileData={profileData} />;
      case 'calendar': return <CalendarView />;
      case 'meetings': return <MeetingsView />;
      case 'attendance': return <AttendanceInsights />;
      case 'support': return <HelpCenter />;
      case 'ai-assistant': return <AIAssistant />;
      default: return <Overview setActiveSection={setActiveSection} onOpenRoom={onOpenRoom} profileData={profileData} />;
    }
  };

  return (
    <div className="dashboard-layout" style={{ display: 'flex', height: '100%', overflow: 'hidden', background: 'var(--bg-main)' }}>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} profileData={profileData} />
      
      <main className="dashboard-main" style={{ flex: 1, padding: '0', background: 'var(--bg-main)', overflowY: 'auto' }}>
        <TopNav activeSection={activeSection} setActiveSection={setActiveSection} profileData={profileData} />
        <div style={{ padding: '2.5rem 2.5rem 6rem 2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
