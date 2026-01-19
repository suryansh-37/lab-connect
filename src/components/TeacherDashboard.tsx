import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, BookOpen, BarChart2, Settings, 
  Plus, Search, MoreVertical, FileText, CheckCircle, 
  Download, Mic, PieChart, ShieldAlert, School, ChevronDown, Trash2, Edit3, Copy
} from 'lucide-react';
import type { TeacherStats, Classroom, Submission } from '../types';

// Mock function to generate ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const TeacherDashboard = () => {
  // --- STATE ---
  // Added 'CLASSES' to the activeTab state
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CLASSES' | 'STUDENTS' | 'ASSIGNMENTS' | 'ANALYTICS'>('OVERVIEW');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isClassMenuOpen, setIsClassMenuOpen] = useState(true); // Toggle sidebar menu

  // --- CLASS DATA STATE ---
  const [classes, setClasses] = useState<Classroom[]>([
    { id: '1', name: 'Physics 101', subject: 'Quantum Mechanics', teacherName: 'You', code: 'PHY101', themeColor: '#3282B8' },
    { id: '2', name: 'Chemistry Lab', subject: 'Organic Compounds', teacherName: 'You', code: 'CHM202', themeColor: '#059669' },
    { id: '3', name: 'Adv. Mathematics', subject: 'Calculus II', teacherName: 'You', code: 'MTH303', themeColor: '#7c3aed' }
  ]);
  
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0].id);
  const [newClassInput, setNewClassInput] = useState({ name: '', subject: '' });

  // DERIVED STATE (Current Context)
  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];

  // Mock Stats - In a real app, these would fetch based on selectedClassId
  const stats: TeacherStats = { 
    totalStudents: selectedClassId === '1' ? 142 : selectedClassId === '2' ? 85 : 60, 
    assignmentsActive: 3, 
    papersToGrade: selectedClassId === '1' ? 12 : 5, 
    classAverage: selectedClassId === '1' ? 84 : 91 
  };
  
  const recentSubmissions: Submission[] = [
    { id: '1', studentName: 'Alex Johnson', avatar: 'user', submittedDate: '2 hrs ago', status: 'PENDING', plagiarismScore: 2, aiScore: 5 },
    { id: '2', studentName: 'Sam Smith', avatar: 'zap', submittedDate: '5 hrs ago', status: 'PENDING', plagiarismScore: 15, aiScore: 88 },
    { id: '3', studentName: 'Taylor Doe', avatar: 'atom', submittedDate: '1 day ago', status: 'GRADED', grade: 92, plagiarismScore: 0, aiScore: 0 },
  ];

  // --- HANDLERS ---
  const handleCreateClass = () => {
    if (!newClassInput.name || !newClassInput.subject) return;
    const newClass: Classroom = {
      id: generateId(),
      name: newClassInput.name,
      subject: newClassInput.subject,
      teacherName: 'You',
      code: generateId().toUpperCase().slice(0, 6),
      themeColor: ['#3282B8', '#059669', '#7c3aed', '#db2777'][Math.floor(Math.random() * 4)]
    };
    setClasses([...classes, newClass]);
    setSelectedClassId(newClass.id); // Switch to new class immediately
    setShowCreateModal(false);
    setNewClassInput({ name: '', subject: '' });
    setActiveTab('OVERVIEW'); // Go to overview of new class
  };

  const handleDeleteClass = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure? This will remove all students and data for this class.")) {
      const updatedClasses = classes.filter(c => c.id !== id);
      setClasses(updatedClasses);
      // If we deleted the active class, switch to the first available one
      if (selectedClassId === id && updatedClasses.length > 0) {
        setSelectedClassId(updatedClasses[0].id);
      }
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Class code ${code} copied!`);
  };

  return (
    <div className="teacher-dashboard">
      {/* 1. SIDEBAR NAVIGATION */}
      <nav className="teacher-sidebar">
        <div className="sidebar-header">
          <h3>Instructor Hub</h3>
        </div>

        {/* QUICK CLASS SWITCHER */}
        <div className="class-selector-wrapper">
          <button className="class-toggle-btn" onClick={() => setIsClassMenuOpen(!isClassMenuOpen)}>
            <span><School size={18}/> {currentClass ? currentClass.name : 'Select Class'}</span>
            <ChevronDown size={16} style={{ transform: isClassMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}/>
          </button>
          
          <AnimatePresence>
            {isClassMenuOpen && (
              <motion.div 
                className="class-list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                {classes.map(cls => (
                  <div 
                    key={cls.id} 
                    className={`class-list-item ${selectedClassId === cls.id ? 'active' : ''}`}
                    onClick={() => { setSelectedClassId(cls.id); setActiveTab('OVERVIEW'); }}
                  >
                    <div className="class-dot" style={{ background: cls.themeColor }}></div>
                    <div className="cls-info">
                      <span className="cls-name">{cls.name}</span>
                    </div>
                  </div>
                ))}
                <button className="add-class-btn" onClick={() => setShowCreateModal(true)}>
                  <Plus size={14}/> Create New Class
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="nav-divider"></div>

        {/* MENU LINKS */}
        <button className={activeTab === 'OVERVIEW' ? 'active' : ''} onClick={() => setActiveTab('OVERVIEW')}>
          <LayoutDashboard size={20}/> Dashboard
        </button>
        {/* NEW: MY CLASSES TAB */}
        <button className={activeTab === 'CLASSES' ? 'active' : ''} onClick={() => setActiveTab('CLASSES')}>
          <School size={20}/> Manage Classes
        </button>
        <button className={activeTab === 'STUDENTS' ? 'active' : ''} onClick={() => setActiveTab('STUDENTS')}>
          <Users size={20}/> Students & Roster
        </button>
        <button className={activeTab === 'ASSIGNMENTS' ? 'active' : ''} onClick={() => setActiveTab('ASSIGNMENTS')}>
          <BookOpen size={20}/> Assignments
          {stats.papersToGrade > 0 && <span className="badge-count orange">{stats.papersToGrade}</span>}
        </button>
        <button className={activeTab === 'ANALYTICS' ? 'active' : ''} onClick={() => setActiveTab('ANALYTICS')}>
          <BarChart2 size={20}/> Reports
        </button>
        
        <div className="spacer"></div>
        <button className="settings-btn"><Settings size={20}/> Settings</button>
      </nav>

      {/* 2. MAIN CONTENT */}
      <main className="teacher-content">
        <header className="teacher-header">
          <div>
            <motion.h2 
              key={currentClass.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {activeTab === 'CLASSES' ? 'All Classes' : currentClass.name}
            </motion.h2>
            <p className="sub-text">
              {activeTab === 'CLASSES' 
                ? 'Manage your semesters and subjects' 
                : `${currentClass.subject} • Code: ${currentClass.code}`}
            </p>
          </div>
          <div className="header-actions">
            {activeTab === 'CLASSES' ? (
               <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                 <Plus size={16}/> Add Class
               </button>
            ) : (
               <button className="btn-outline"><Download size={16}/> Export Data</button>
            )}
          </div>
        </header>

        <div className="content-scroll">
          <AnimatePresence mode="wait">
            
            {/* --- TAB: OVERVIEW --- */}
            {activeTab === 'OVERVIEW' && (
              <motion.div key="overview" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="overview-grid">
                
                {/* Stats Row */}
                <div className="stat-card t-card">
                  <div className="stat-icon blue"><Users size={24}/></div>
                  <h3>{stats.totalStudents}</h3>
                  <p>Enrolled Students</p>
                </div>
                <div className="stat-card t-card">
                  <div className="stat-icon orange"><FileText size={24}/></div>
                  <h3>{stats.papersToGrade}</h3>
                  <p>Pending Review</p>
                </div>
                <div className="stat-card t-card">
                  <div className="stat-icon green"><PieChart size={24}/></div>
                  <h3>{stats.classAverage}%</h3>
                  <p>Avg. Performance</p>
                </div>

                {/* AI & Plagiarism Alert Section */}
                <div className="alert-section">
                  <div className="section-header">
                    <h3><ShieldAlert size={18} /> Integrity Alerts</h3>
                    <small>Recent detections</small>
                  </div>
                  {recentSubmissions.filter(s => s.aiScore > 50 || s.plagiarismScore > 20).map(s => (
                    <div key={s.id} className="integrity-row">
                      <span>{s.studentName}</span>
                      <div className="badges">
                        {s.aiScore > 50 && <span className="badge ai">AI: {s.aiScore}%</span>}
                        {s.plagiarismScore > 20 && <span className="badge plag">Plag: {s.plagiarismScore}%</span>}
                      </div>
                      <button className="btn-text-small">Review</button>
                    </div>
                  ))}
                </div>

                {/* Grading Queue */}
                <div className="grading-queue">
                   <h3>Pending Grading</h3>
                   {recentSubmissions.filter(s => s.status === 'PENDING').map(s => (
                     <div key={s.id} className="grading-item">
                       <div className="student-info">
                         <div className="avatar-circle">{s.studentName[0]}</div>
                         <div><strong>{s.studentName}</strong><br/><small>{s.submittedDate}</small></div>
                       </div>
                       <div className="grading-actions">
                         <button className="icon-btn" title="Voice Feedback"><Mic size={16}/></button>
                         <button className="btn-primary-small">Grade</button>
                       </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {/* --- TAB: MANAGE CLASSES --- */}
            {activeTab === 'CLASSES' && (
              <motion.div key="classes" initial={{opacity:0}} animate={{opacity:1}} className="class-grid-manager">
                {classes.map(cls => (
                  <div key={cls.id} className="class-manage-card" onClick={() => { setSelectedClassId(cls.id); setActiveTab('OVERVIEW'); }}>
                    <div className="manage-card-header" style={{backgroundColor: cls.themeColor}}>
                      <School size={24} color="white" />
                      <div className="manage-actions">
                        <button onClick={(e) => { e.stopPropagation(); /* Edit logic */ }}><Edit3 size={16} color="white"/></button>
                        <button onClick={(e) => handleDeleteClass(e, cls.id)}><Trash2 size={16} color="white"/></button>
                      </div>
                    </div>
                    <div className="manage-card-body">
                      <h3>{cls.name}</h3>
                      <p>{cls.subject}</p>
                      <div className="code-row" onClick={(e) => { e.stopPropagation(); copyCode(cls.code); }}>
                        <span>Code: <strong>{cls.code}</strong></span>
                        <Copy size={12}/>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add New Card */}
                <div className="class-manage-card add-new" onClick={() => setShowCreateModal(true)}>
                  <div className="add-content">
                    <Plus size={32}/>
                    <p>Add New Class</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- OTHER TABS --- */}
            {activeTab === 'STUDENTS' && (
              <motion.div key="students" initial={{opacity:0}} animate={{opacity:1}} className="empty-state">
                <Users size={48} opacity={0.2}/>
                <h3>Student Roster</h3>
                <p>Manage {stats.totalStudents} students in {currentClass.name}</p>
              </motion.div>
            )}
            
            {activeTab === 'ASSIGNMENTS' && (
              <motion.div key="assignments" initial={{opacity:0}} animate={{opacity:1}} className="empty-state">
                <BookOpen size={48} opacity={0.2}/>
                <h3>Assignments</h3>
                <p>3 Active Assignments for {currentClass.name}</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* CREATE CLASS MODAL */}
      {showCreateModal && (
        <div className="modal-overlay">
          <motion.div className="modal-box" initial={{scale:0.95}} animate={{scale:1}}>
            <h3>Create New Class</h3>
            <div className="input-group">
              <label>Class Name</label>
              <input 
                type="text" 
                placeholder="e.g. Physics 101" 
                value={newClassInput.name}
                onChange={e => setNewClassInput({...newClassInput, name: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Subject</label>
              <input 
                type="text" 
                placeholder="e.g. Science"
                value={newClassInput.subject}
                onChange={e => setNewClassInput({...newClassInput, subject: e.target.value})}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateClass}>Create Class</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};