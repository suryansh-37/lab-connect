import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis'; // Import the smooth scroll library
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, CheckSquare, Trophy, Bell, 
  TrendingUp, Clock, FileText, Upload, Download, MessageCircle, 
  ChevronRight, Star
} from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import type { Assignment, Notification, StudentStats } from '../types';

export const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ASSIGNMENTS' | 'AI_HELP'>('OVERVIEW');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // REF FOR SCROLL CONTAINER
  const dashboardScrollRef = useRef<HTMLDivElement>(null);

  // --- ENABLE SMOOTH SCROLL FOR DASHBOARD ---
  useEffect(() => {
    const scrollContainer = dashboardScrollRef.current;
    if (!scrollContainer) return;

    // Initialize Lenis on the specific container
    const lenis = new Lenis({
      wrapper: scrollContainer, // The fixed-height container
      content: scrollContainer.firstElementChild as HTMLElement, // The content inside
      duration: 1.2, 
      smoothWheel: true,
      gestureOrientation: 'vertical',
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [activeTab]); // Re-run if tab changes to ensure size recalculation

  // MOCK DATA
  const stats: StudentStats = { xp: 1250, streak: 5, completionRate: 88, upcomingDeadlines: 3 };
  
  const assignments: Assignment[] = [
    { id: '1', title: 'Quantum Physics Essay', subject: 'Physics 101', dueDate: 'Today, 11:59 PM', status: 'PENDING' },
    { id: '2', title: 'Organic Molecules Lab', subject: 'Chemistry', dueDate: 'Tomorrow', status: 'PENDING' },
    { id: '3', title: 'Calculus Quiz', subject: 'Math', dueDate: 'Yesterday', status: 'LATE' },
    { id: '4', title: 'History Report', subject: 'History', dueDate: 'Last Week', status: 'GRADED', grade: 'A', feedback: 'Excellent analysis!' },
    { id: '5', title: 'Lab Safety Module', subject: 'General Science', dueDate: 'Next Week', status: 'PENDING' },
    { id: '6', title: 'Mid-Term Reflection', subject: 'Ethics', dueDate: 'Next Month', status: 'SUBMITTED' },
  ];

  const notifications: Notification[] = [
    { id: '1', title: 'New Grade: History Report', time: '2 mins ago', type: 'GRADE', read: false },
    { id: '2', title: 'Assignment Due: Physics', time: '1 hour ago', type: 'ALERT', read: false },
  ];

  return (
    <div className="student-dashboard">
      {/* 1. SIDEBAR NAVIGATION */}
      <nav className="student-sidebar">
        <button className={activeTab === 'OVERVIEW' ? 'active' : ''} onClick={() => setActiveTab('OVERVIEW')}>
          <LayoutDashboard size={20}/> Overview
        </button>
        <button className={activeTab === 'ASSIGNMENTS' ? 'active' : ''} onClick={() => setActiveTab('ASSIGNMENTS')}>
          <CheckSquare size={20}/> Assignments
          {stats.upcomingDeadlines > 0 && <span className="badge-count">{stats.upcomingDeadlines}</span>}
        </button>
        <button className={activeTab === 'AI_HELP' ? 'active' : ''} onClick={() => setActiveTab('AI_HELP')}>
          <Star size={20} className="ai-icon-pulse"/> AI Tutor
        </button>
        <div className="spacer"></div>
        <div className="xp-card">
          <div className="xp-header"><Trophy size={16} color="#fbbf24"/> <span>Lvl 4 Scholar</span></div>
          <div className="xp-bar"><div className="xp-fill" style={{width: '65%'}}></div></div>
          <small>{stats.xp} XP / 2000</small>
        </div>
      </nav>

      {/* 2. MAIN CONTENT AREA */}
      <main className="student-content">
        
        {/* HEADER */}
        <header className="student-header">
          <div>
            <h2>Welcome back, Student! 👋</h2>
            <p className="sub-text">You're on a {stats.streak}-day learning streak!</p>
          </div>
          <div className="header-actions">
            <div className="notif-wrapper">
              <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={20}/>
                <span className="red-dot"></span>
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    className="notif-dropdown"
                    initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}}
                  >
                    <h4>Notifications</h4>
                    {notifications.map(n => (
                      <div key={n.id} className="notif-item">
                        <div className={`notif-icon ${n.type}`}>!</div>
                        <div><strong>{n.title}</strong><br/><small>{n.time}</small></div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* DYNAMIC SCROLL CONTENT */}
        {/* We attach the REF here so Lenis knows what to scroll */}
        <div className="content-scroll" ref={dashboardScrollRef}>
          <div className="scroll-inner-wrapper"> {/* Extra wrapper helps Lenis calculate height */}
            <AnimatePresence mode="wait">
              
              {/* VIEW: OVERVIEW */}
              {activeTab === 'OVERVIEW' && (
                <motion.div key="overview" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="overview-grid">
                  
                  {/* Analytics Cards */}
                  <div className="stat-card">
                    <div className="stat-icon blue"><TrendingUp size={24}/></div>
                    <h3>88%</h3>
                    <p>Average Grade</p>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon green"><CheckSquare size={24}/></div>
                    <h3>12/15</h3>
                    <p>Tasks Completed</p>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon purple"><Clock size={24}/></div>
                    <h3>12h</h3>
                    <p>Study Time</p>
                  </div>

                  {/* Performance Graph */}
                  <div className="graph-card">
                    <h3>Weekly Performance</h3>
                    <div className="simple-bar-chart">
                      {[40, 60, 30, 80, 50, 90, 75].map((h, i) => (
                        <div key={i} className="bar-col">
                          <div className="bar-fill" style={{height: `${h}%`}}></div>
                          <span className="bar-label">{['M','T','W','T','F','S','S'][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Materials */}
                  <div className="materials-card">
                    <h3><BookOpen size={18}/> Recent Materials</h3>
                    <div className="material-item">
                      <div className="file-icon"><FileText size={16}/></div>
                      <div className="file-info"><span>Quantum Notes.pdf</span><small>Physics • 2mb</small></div>
                      <button><Download size={16}/></button>
                    </div>
                    <div className="material-item">
                      <div className="file-icon video"><div className="play-tri"></div></div>
                      <div className="file-info"><span>Lab Safety Video</span><small>Chemistry • 10m</small></div>
                      <button><Download size={16}/></button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* VIEW: ASSIGNMENTS */}
              {activeTab === 'ASSIGNMENTS' && (
                <motion.div key="assignments" initial={{opacity:0}} animate={{opacity:1}} className="assignments-list">
                  {assignments.map(a => (
                    <div key={a.id} className={`assignment-card ${a.status.toLowerCase()}`}>
                      <div className="a-status-stripe"></div>
                      <div className="a-content">
                        <div className="a-header">
                          <span className="subject-tag">{a.subject}</span>
                          {a.status === 'GRADED' && <span className="grade-pill">{a.grade}</span>}
                        </div>
                        <h3>{a.title}</h3>
                        <div className="a-meta">
                          <span><Clock size={14}/> Due: {a.dueDate}</span>
                          <span className={`status-text ${a.status}`}>{a.status}</span>
                        </div>
                        
                        {a.feedback && (
                          <div className="feedback-box">
                            <MessageCircle size={14}/> <strong>Teacher:</strong> "{a.feedback}"
                          </div>
                        )}

                        <div className="a-actions">
                           {a.status === 'PENDING' && (
                             <button className="btn-primary-small"><Upload size={14}/> Submit Work</button>
                           )}
                           <button className="btn-text-small">View Details <ChevronRight size={14}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* VIEW: AI ASSISTANT */}
              {activeTab === 'AI_HELP' && (
                <motion.div key="ai" initial={{opacity:0, scale: 0.95}} animate={{opacity:1, scale:1}}>
                  <AIAssistant />
                </motion.div>
              )}

            </AnimatePresence>
            
            {/* Spacer for bottom scrolling */}
            <div style={{height: '50px'}}></div>
          </div>
        </div>
      </main>
    </div>
  );
};