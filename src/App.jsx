import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, LogOut, Hexagon } from 'lucide-react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Home from './components/Home';
import AuthPage from './components/AuthPage';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import VideoConference from './components/VideoConference';
import GroupChat from './components/GroupChat';
import ClassStream from './components/ClassStream';
import QuickJoin from './components/QuickJoin';

function App() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState(() => {
    if (window.location.pathname.startsWith('/teacher-dashboard')) {
      return 'teacher-dashboard';
    }
    if (window.location.pathname.startsWith('/student-dashboard')) {
      return 'student-dashboard';
    }
    return sessionStorage.getItem('currentView') || 'home';
  });
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
    const isDashboard = window.location.pathname.startsWith('/student-dashboard') || window.location.pathname.startsWith('/teacher-dashboard');
    const path = isDashboard ? window.location.pathname : `#${currentView}`;
    window.history.replaceState({ view: currentView, userRole, activeSubject }, '', path);
    
    const handlePopState = (event) => {
      if (event.state) {
        const { userRole: prevRole, currentView: prevView, activeSubject: prevSubject } = stateRef.current;
        
        // Prevent accidental logout on browser back button
        if ((prevRole === 'Student' || prevRole === 'Teacher') && (!event.state || !event.state.userRole)) {
           const confirmLogout = window.confirm("Are you sure you want to quit and log out?");
           if (!confirmLogout) {
              const isDashboardView = prevView === 'student-dashboard' || prevView === 'teacher-dashboard';
              const backPath = isDashboardView ? `/${prevView}` : `#${prevView}`;
              window.history.pushState({ view: prevView, userRole: prevRole, activeSubject: prevSubject }, '', backPath);
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
    const isDashboard = view === 'student-dashboard' || view === 'teacher-dashboard';
    const path = isDashboard ? `/${view}` : `#${view}`;
    window.history.pushState({ view, userRole: newRole, activeSubject: newSubject }, '', path);
  };

  const handleNavigate = (view) => updateView(view);
  
  const handleLoginSuccess = (role) => {
    setUserRole(role);
    const dashboardView = role === 'Student' ? 'student-dashboard' : 'teacher-dashboard';
    const dashboardPath = role === 'Student' ? '/student-dashboard' : '/teacher-dashboard';
    setCurrentView(dashboardView);
    navigate(dashboardPath);
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
        setCurrentView('home');
        setActiveSubject(null);
        navigate('/');
      }
    } else {
      const dashboardView = userRole === 'Student' ? 'student-dashboard' : 'teacher-dashboard';
      const dashboardPath = userRole === 'Student' ? '/student-dashboard' : '/teacher-dashboard';
      setCurrentView(dashboardView);
      setActiveSubject(null);
      navigate(dashboardPath);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      setUserRole(null);
      setUserName('');
      setCurrentView('home');
      setActiveSubject(null);
      navigate('/');
    }
  };

  const handleQuickJoinSubmit = (name, actualTitle) => {
    setUserRole('Guest');
    setUserName(name);
    setActiveSubject(actualTitle);
    updateView('chat', 'Guest', actualTitle);
  };

  const handleForceLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUserRole(null);
    setUserName('');
    setActiveSubject(null);
    setCurrentView('student-auth');
    navigate('/student-auth');
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
        <Routes>
          <Route path="/teacher-dashboard/class/:classId" element={<ClassStream onBack={handleBackToDashboard} onOpenRoom={handleOpenRoom} />} />
          <Route path="*" element={
            <>
              {currentView === 'home' && <div className="centered-view"><Home onNavigate={handleNavigate} /></div>}
              {currentView === 'quick-join' && <QuickJoin onJoin={handleQuickJoinSubmit} onBack={() => handleNavigate('home')} />}
              {currentView === 'student-auth' && <div className="centered-view"><AuthPage role="Student" onBack={() => handleNavigate('home')} onLoginSuccess={handleLoginSuccess} /></div>}
              {currentView === 'teacher-auth' && <div className="centered-view"><AuthPage role="Teacher" onBack={() => handleNavigate('home')} onLoginSuccess={handleLoginSuccess} /></div>}
              
              {currentView === 'student-dashboard' && <StudentDashboard onOpenRoom={handleOpenRoom} onLogout={handleLogout} onForceLogout={handleForceLogout} />}
              {currentView === 'teacher-dashboard' && <TeacherDashboard onOpenRoom={handleOpenRoom} onLogout={handleLogout} onForceLogout={handleForceLogout} />}
              
              {currentView === 'video' && <VideoConference subject={activeSubject} onBack={handleBackToDashboard} />}
              {currentView === 'chat' && <GroupChat subject={activeSubject} userName={userName} userRole={userRole} onBack={handleBackToDashboard} />}
              {currentView === 'stream' && <ClassStream subject={activeSubject} onBack={handleBackToDashboard} onOpenRoom={handleOpenRoom} />}
            </>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;