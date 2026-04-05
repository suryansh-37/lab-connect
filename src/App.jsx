import React, { useState, useEffect } from 'react';
import { Moon, Sun, LogOut, Hexagon } from 'lucide-react';

import Home from './components/Home';
import AuthPage from './components/AuthPage';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import VideoConference from './components/VideoConference';
import GroupChat from './components/GroupChat';
import ClassStream from './components/ClassStream';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [userRole, setUserRole] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const handleNavigate = (view) => setCurrentView(view);
  
  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setCurrentView(role === 'Student' ? 'student-dashboard' : 'teacher-dashboard');
  };

  const handleOpenRoom = (roomType, subject) => {
    setActiveSubject(subject);
    setCurrentView(roomType);
  };

  const handleBackToDashboard = () => {
    setCurrentView(userRole === 'Student' ? 'student-dashboard' : 'teacher-dashboard');
    setActiveSubject(null);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView('home');
    setActiveSubject(null);
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="brand" onClick={() => userRole ? handleBackToDashboard() : handleNavigate('home')} style={{ cursor: 'pointer' }}>
          <Hexagon size={28} />
          <h1>Lab-Connect</h1>
        </div>
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      <div className="main-wrapper">
        {currentView === 'home' && <div className="centered-view"><Home onNavigate={handleNavigate} /></div>}
        {currentView === 'student-auth' && <div className="centered-view"><AuthPage role="Student" onBack={() => handleNavigate('home')} onLoginSuccess={handleLoginSuccess} /></div>}
        {currentView === 'teacher-auth' && <div className="centered-view"><AuthPage role="Teacher" onBack={() => handleNavigate('home')} onLoginSuccess={handleLoginSuccess} /></div>}
        
        {currentView === 'student-dashboard' && <StudentDashboard onOpenRoom={handleOpenRoom} onLogout={handleLogout} />}
        {currentView === 'teacher-dashboard' && <TeacherDashboard onOpenRoom={handleOpenRoom} onLogout={handleLogout} />}
        
        {currentView === 'video' && <VideoConference subject={activeSubject} onBack={handleBackToDashboard} />}
        {currentView === 'chat' && <GroupChat subject={activeSubject} onBack={handleBackToDashboard} />}
        {currentView === 'stream' && <ClassStream subject={activeSubject} onBack={handleBackToDashboard} onOpenRoom={handleOpenRoom} />}
      </div>
    </div>
  );
}

export default App;