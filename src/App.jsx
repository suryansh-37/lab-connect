import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, LogOut, Hexagon } from 'lucide-react';

import Home from './components/Home';
import AuthPage from './components/AuthPage';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import VideoConference from './components/VideoConference';
import GroupChat from './components/GroupChat';
import ClassStream from './components/ClassStream';
import QuickJoin from './components/QuickJoin';

function App() {
  const [currentView, setCurrentView] = useState(() => sessionStorage.getItem('currentView') || 'home');
  const [userRole, setUserRole] = useState(() => sessionStorage.getItem('userRole') || null);
  const [activeSubject, setActiveSubject] = useState(() => sessionStorage.getItem('activeSubject') || null);
  const [userName, setUserName] = useState(() => sessionStorage.getItem('userName') || '');
  const [isDarkMode, setIsDarkMode] = useState(() => sessionStorage.getItem('isDarkMode') === 'true');

  useEffect(() => {
    sessionStorage.setItem('currentView', currentView);
    if (userRole) sessionStorage.setItem('userRole', userRole); else sessionStorage.removeItem('userRole');
    if (activeSubject) sessionStorage.setItem('activeSubject', activeSubject); else sessionStorage.removeItem('activeSubject');
    if (userName) sessionStorage.setItem('userName', userName); else sessionStorage.removeItem('userName');
    sessionStorage.setItem('isDarkMode', isDarkMode);
  }, [currentView, userRole, activeSubject, userName, isDarkMode]);

  const stateRef = useRef({ currentView, userRole, activeSubject });
  useEffect(() => {
    stateRef.current = { currentView, userRole, activeSubject };
  }, [currentView, userRole, activeSubject]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  useEffect(() => {
    window.history.replaceState({ view: currentView, userRole, activeSubject }, '', `#${currentView}`);
    
    const handlePopState = (event) => {
      if (event.state) {
        const { userRole: prevRole, currentView: prevView, activeSubject: prevSubject } = stateRef.current;
        
        // Prevent accidental logout on browser back button
        if ((prevRole === 'Student' || prevRole === 'Teacher') && !event.state.userRole) {
           const confirmLogout = window.confirm("Are you sure you want to quit and log out?");
           if (!confirmLogout) {
              window.history.pushState({ view: prevView, userRole: prevRole, activeSubject: prevSubject }, '', `#${prevView}`);
              return;
           }
        }
        
        // Prevent accidental exit for Quick Join guest sessions
        if (prevRole === 'Guest' && event.state.view === 'home') {
           const confirmLeave = window.confirm("Are you sure you want to leave this session?");
           if (!confirmLeave) {
              window.history.pushState({ view: prevView, userRole: prevRole, activeSubject: prevSubject }, '', `#${prevView}`);
              return;
           }
        }

        if (event.state.userRole !== undefined) setUserRole(event.state.userRole);
        if (event.state.activeSubject !== undefined) setActiveSubject(event.state.activeSubject);
        setCurrentView(event.state.view || 'home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // Run only on mount

  const updateView = (view, newRole = userRole, newSubject = activeSubject) => {
    setCurrentView(view);
    window.history.pushState({ view, userRole: newRole, activeSubject: newSubject }, '', `#${view}`);
  };

  const handleNavigate = (view) => updateView(view);
  
  const handleLoginSuccess = (role) => {
    setUserRole(role);
    updateView(role === 'Student' ? 'student-dashboard' : 'teacher-dashboard', role, activeSubject);
  };

  const handleOpenRoom = (roomType, subject) => {
    setActiveSubject(subject);
    updateView(roomType, userRole, subject);
  };

  const handleBackToDashboard = () => {
    if (userRole === 'Guest') {
      const confirmLeave = window.confirm("Are you sure you want to leave this session?");
      if (confirmLeave) {
        setUserRole(null);
        setUserName('');
        updateView('home', null, null);
        setActiveSubject(null);
      }
    } else {
      updateView(userRole === 'Student' ? 'student-dashboard' : 'teacher-dashboard', userRole, null);
      setActiveSubject(null);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      setUserRole(null);
      setUserName('');
      updateView('home', null, null);
      setActiveSubject(null);
    }
  };

  const handleQuickJoinSubmit = (name, actualTitle) => {
    setUserRole('Guest');
    setUserName(name);
    setActiveSubject(actualTitle);
    updateView('chat', 'Guest', actualTitle);
  };

  return (
    <div className={`app-container ${currentView !== 'home' ? 'locked' : ''}`}>
      <nav className="navbar">
        <div className="brand" onClick={() => userRole ? handleBackToDashboard() : handleNavigate('home')} 
             style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', height: '40px' }}>
          <img 
            src="/logo.png" 
            alt="LabConnect Logo" 
            style={{ 
              height: '100%', 
              objectFit: 'contain'
            }} 
          />
        </div>
        <div className="nav-actions">
          {!userRole && currentView === 'home' && (
            <button 
              onClick={() => handleNavigate('quick-join')}
              style={{ padding: '0.4rem 1.2rem', background: 'var(--accent)', color: 'white', borderRadius: '20px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', marginRight: '0.5rem' }}>
              Quick Join
            </button>
          )}
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      <div className={`main-wrapper ${currentView !== 'home' ? 'locked' : ''}`}>
        {currentView === 'home' && <div className="centered-view"><Home onNavigate={handleNavigate} /></div>}
        {currentView === 'quick-join' && <QuickJoin onJoin={handleQuickJoinSubmit} onBack={() => handleNavigate('home')} />}
        {currentView === 'student-auth' && <div className="centered-view"><AuthPage role="Student" onBack={() => handleNavigate('home')} onLoginSuccess={handleLoginSuccess} /></div>}
        {currentView === 'teacher-auth' && <div className="centered-view"><AuthPage role="Teacher" onBack={() => handleNavigate('home')} onLoginSuccess={handleLoginSuccess} /></div>}
        
        {currentView === 'student-dashboard' && <StudentDashboard onOpenRoom={handleOpenRoom} onLogout={handleLogout} />}
        {currentView === 'teacher-dashboard' && <TeacherDashboard onOpenRoom={handleOpenRoom} onLogout={handleLogout} />}
        
        {currentView === 'video' && <VideoConference subject={activeSubject} onBack={handleBackToDashboard} />}
        {currentView === 'chat' && <GroupChat subject={activeSubject} userName={userName} userRole={userRole} onBack={handleBackToDashboard} />}
        {currentView === 'stream' && <ClassStream subject={activeSubject} onBack={handleBackToDashboard} onOpenRoom={handleOpenRoom} />}
      </div>
    </div>
  );
}

export default App;