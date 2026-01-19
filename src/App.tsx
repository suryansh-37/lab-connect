import { useState, useEffect, useRef } from 'react';
import type { User, Message, UserRole } from './types';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import { 
  Moon, Sun, Send, Copy, LogOut, 
  FlaskConical, ArrowRight, Plus, Monitor, 
  Bot, User as UserIcon, Zap, Atom, Hexagon,
  Settings, Users, FileText, AlertTriangle,
  GraduationCap, BookOpen
} from 'lucide-react';

// --- COMPONENT IMPORTS ---
import { StudentLogin } from './components/StudentLogin';
import { TeacherLogin } from './components/TeacherLogin';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';

import './App.css';

// --- CONFIGURATION ---
const BACKEND_URL = "https://lab-connect.onrender.com"; 

// --- UTILS ---
const generateId = (length = 6) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

const AVATAR_MAP: Record<string, any> = { 'user': UserIcon, 'bot': Bot, 'zap': Zap, 'atom': Atom, 'hex': Hexagon };

export default function App() {
  // --- GLOBAL STATE ---
  const [darkMode, setDarkMode] = useState(false);
  const [appMode, setAppMode] = useState<'LANDING' | 'QUICK_SESSION' | 'CLASSROOM_AUTH' | 'CLASSROOM_DASH'>('LANDING');

  // --- REAL-TIME STATE ---
  const socketRef = useRef<Socket | null>(null);
  
  // --- QUICK SESSION STATE ---
  const [chatStep, setChatStep] = useState<'JOIN' | 'CHAT'>('JOIN');
  const [joinMode, setJoinMode] = useState<'CREATE' | 'JOIN'>('CREATE');
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState<User>({ id: '', name: '', avatar: 'user' });
  const [participants, setParticipants] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'PARTICIPANTS' | 'SETTINGS'>('PARTICIPANTS');
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // --- CLASSROOM STATE ---
  const [role, setRole] = useState<UserRole>('STUDENT');

  // --- EFFECTS ---

  // 1. Socket Listener Setup
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(BACKEND_URL, { autoConnect: false });
    }

    const socket = socketRef.current;

    socket.on("receive_message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_joined", (data: { name: string }) => {
      // Logic to add participant to list if desired
      console.log(`${data.name} joined the lab`);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_joined");
      socket.disconnect();
    };
  }, []);
  
  // 2. Dark Mode Toggle
  useEffect(() => { document.body.className = darkMode ? 'dark-theme' : 'light-theme'; }, [darkMode]);
  
  // 3. Smooth Scroll (Landing Page Only)
  useEffect(() => {
    if (appMode === 'LANDING') {
      const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
      function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      return () => lenis.destroy();
    }
  }, [appMode]);

  // --- HANDLERS: CLASSROOM LOGIN ---
  const onAuthorizedLogin = (email: string) => {
    const name = email.split('@')[0];
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    setCurrentUser({ id: 'user-1', name: displayName, avatar: 'user' });
    setAppMode('CLASSROOM_DASH');
  };

  // --- HANDLERS: QUICK SESSION ---
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value)) && !/^[a-zA-Z]+$/.test(element.value)) return;
    const newOtp = [...otp]; newOtp[index] = element.value.toUpperCase().slice(-1); setOtp(newOtp);
    if (element.value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
      else { const newOtp = [...otp]; newOtp[index] = ""; setOtp(newOtp); }
    }
  };

  const enterChatSession = async () => {
    const finalSessionId = otp.join("");
    if (!currentUser.name) return alert("Please enter your name.");
    if (finalSessionId.length !== 6) return alert("Invalid Session ID.");

    try {
      if (joinMode === 'JOIN') {
        // Verify session exists in MongoDB via Backend API
        const res = await axios.get(`${BACKEND_URL}/api/verify-session/${finalSessionId}`);
        if (!res.data.valid) return alert("Session not found!");
      } else {
        // Create session in MongoDB via Backend API
        await axios.post(`${BACKEND_URL}/api/create-session`, { sessionId: finalSessionId });
      }

      const userWithId = { ...currentUser, id: generateId() };
      setCurrentUser(userWithId);
      setParticipants([userWithId, { id: 'bot', name: 'Lab Assistant', avatar: 'bot' }]); 
      
      // Establish Socket Connection
      socketRef.current?.connect();
      socketRef.current?.emit("join_room", { room: finalSessionId, user: userWithId.name });
      
      setChatStep('CHAT');
    } catch (err) {
      alert("Server Connection Error. Is the backend running?");
    }
  };

  const sendMessage = () => {
    if (!inputText.trim() || !socketRef.current) return;
    
    const messageData: Message = {
      id: generateId(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Emit to others
    socketRef.current.emit("send_message", { 
      room: otp.join(""), 
      ...messageData 
    });

    // Add to local UI
    setMessages([...messages, messageData]);
    setInputText('');
  };

  const confirmLeave = () => {
    socketRef.current?.disconnect();
    setShowLeaveConfirm(false);
    setAppMode('LANDING');
    setChatStep('JOIN');
    setMessages([]); setParticipants([]); setOtp(new Array(6).fill(""));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(otp.join(""));
    alert("Copied!");
  };

  const renderAvatar = (key: string) => { const Icon = AVATAR_MAP[key] || UserIcon; return <Icon size={20} />; };

  return (
    <div className={`app-container ${appMode === 'QUICK_SESSION' && chatStep === 'CHAT' ? 'chat-mode' : ''}`}>
      
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo-wrapper" onClick={() => setAppMode('LANDING')} style={{cursor: 'pointer'}}>
          <motion.div animate={{ rotate: darkMode ? 360 : 0 }} transition={{ type: "spring" }}>
            <FlaskConical className="logo-icon" size={28} />
          </motion.div>
          <div className="logo">Lab<span className="accent">Connect</span></div>
        </div>
        <div className="nav-actions">
          {appMode === 'CLASSROOM_DASH' && (
            <div className="user-profile-pill">
              <span className="role-badge">{role}</span>
              {currentUser.name}
            </div>
          )}
          <button onClick={() => setDarkMode(!darkMode)} className="theme-btn icon-btn">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* MODAL: LEAVE CONFIRMATION */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <div className="modal-overlay">
            <motion.div className="modal-box" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <div className="modal-icon"><AlertTriangle size={32} /></div>
              <h3>Leave Session?</h3>
              <p>You will be logged out and chat history will be cleared.</p>
              <div className="modal-actions">
                <button className="btn-outline" onClick={() => setShowLeaveConfirm(false)}>No, Stay</button>
                <button className="btn-danger-solid" onClick={confirmLeave}>Yes, Leave</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- 1. LANDING PAGE --- */}
      {appMode === 'LANDING' && (
        <main className="landing section">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="hero-icon-bg">
            <GraduationCap size={64} strokeWidth={1} />
          </motion.div>
          <h1 className="hero-title">Your Virtual<br/>Science Hub.</h1>
          <p className="hero-sub">Choose how you want to connect today.</p>
          
          <div className="mode-cards-container">
            <div className="mode-card" onClick={() => { setAppMode('QUICK_SESSION'); setChatStep('JOIN'); setJoinMode('CREATE'); setOtp(generateId().split("")); }}>
              <div className="mode-icon"><Zap size={32}/></div>
              <h3>Quick Lab</h3>
              <p>Instant, temporary chat session. No login required.</p>
              <span className="mode-link">Start Session &rarr;</span>
            </div>
            <div className="mode-card highlight" onClick={() => setAppMode('CLASSROOM_AUTH')}>
              <div className="mode-icon"><BookOpen size={32}/></div>
              <h3>Classroom</h3>
              <p>Persistent courses, assignments, and teacher tools.</p>
              <span className="mode-link">Login to Portal &rarr;</span>
            </div>
          </div>
        </main>
      )}

      {/* --- 2. QUICK SESSION (CHAT) --- */}
      {appMode === 'QUICK_SESSION' && (
        <>
          {chatStep === 'JOIN' && (
             <main className="form-screen">
             <motion.div className="form-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
               <button className="back-text-btn" onClick={() => setAppMode('LANDING')}>&larr; Back to Home</button>
               <h2>{joinMode === 'CREATE' ? 'Setup Session' : 'Join Session'}</h2>
               
               <div className="input-group">
                 <label>Session ID (6-Digits)</label>
                 <div className="otp-container">
                   {otp.map((d, i) => (
                     <motion.input 
                       key={i} 
                       className="otp-input" 
                       value={d} 
                       maxLength={1} 
                       readOnly={joinMode === 'CREATE'}
                       ref={(el) => { inputRefs.current[i] = el }}
                       onChange={e => handleOtpChange(e.target, i)}
                       onKeyDown={e => handleOtpKeyDown(e, i)}
                       whileFocus={{ scale: 1.1, borderColor: "var(--primary)" }}
                     />
                   ))}
                 </div>
                 {joinMode === 'CREATE' && <button className="btn-link" onClick={copyToClipboard} style={{display:'flex',justifyContent:'center',gap:8}}><Copy size={14}/> Copy ID</button>}
               </div>
               
               <div className="input-group"><label>Display Name</label><input type="text" placeholder="Ex: Dr. Smith" onChange={e => setCurrentUser({...currentUser, name: e.target.value})}/></div>
               <div className="input-group"><label>Avatar</label><div className="avatar-select">{Object.keys(AVATAR_MAP).filter(k => k !== 'bot').map(key => (<button key={key} className={currentUser.avatar === key ? 'selected' : ''} onClick={() => setCurrentUser({...currentUser, avatar: key})}>{renderAvatar(key)}</button>))}</div></div>
               
               <div style={{display:'flex', gap:10, marginTop:10}}>
                 <button className="btn-outline full-width" onClick={() => { setJoinMode(joinMode==='CREATE'?'JOIN':'CREATE'); setOtp(joinMode==='CREATE'? Array(6).fill(""):generateId().split("")); }}>
                   {joinMode==='CREATE' ? 'Switch to Join' : 'Switch to Create'}
                 </button>
                 <button className="btn-primary full-width" onClick={enterChatSession}>Enter</button>
               </div>
             </motion.div>
           </main>
          )}

          {chatStep === 'CHAT' && (
             <main className="chat-layout">
                <nav className="nav-rail">
                  <div className="rail-top">
                    <button className={`rail-btn ${activeTab === 'PARTICIPANTS' ? 'active' : ''}`} onClick={() => setActiveTab('PARTICIPANTS')}><Users size={24} /></button>
                    <button className={`rail-btn ${activeTab === 'SETTINGS' ? 'active' : ''}`} onClick={() => setActiveTab('SETTINGS')}><Settings size={24} /></button>
                  </div>
                  <div className="rail-bottom"><button className="rail-btn danger" onClick={() => setShowLeaveConfirm(true)}><LogOut size={24} /></button></div>
                </nav>

                <aside className="sidebar">
                  <AnimatePresence mode="wait">
                    {activeTab === 'PARTICIPANTS' && (
                      <motion.div key="part" initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} className="sidebar-content">
                        <div className="session-info"><small>SESSION ID</small><h3>{otp.join("")}</h3><div className="copy-row" onClick={copyToClipboard}><Copy size={12}/> Copy</div></div>
                        <div className="participants-list"><div className="list-header"><Users size={14}/> Active ({participants.length})</div>{participants.map(u => (<div key={u.id} className="participant"><div className="p-avatar-box">{renderAvatar(u.avatar)}</div><span>{u.name}</span></div>))}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </aside>

                <section className="chat-area">
                  <div className="messages-feed">
                    <AnimatePresence>
                      {messages.map(msg => (
                        <motion.div key={msg.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className={`message-bubble ${msg.senderId === currentUser.id ? 'my-msg' : ''}`}>
                          <div className="msg-header"><span>{msg.senderName}</span><span>{msg.timestamp}</span></div>{msg.text}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="chat-input-area">
                    <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key==='Enter' && sendMessage()} placeholder="Type message..." />
                    <button className="send-btn" onClick={sendMessage}><Send size={18}/></button>
                  </div>
                </section>
             </main>
          )}
        </>
      )}

      {/* --- 3. CLASSROOM AUTH --- */}
      {appMode === 'CLASSROOM_AUTH' && (
        <main className="form-screen">
          <motion.div className="form-card auth-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <button className="back-text-btn" onClick={() => setAppMode('LANDING')}>&larr; Back</button>
            <div className="role-switcher">
              <button className={role === 'STUDENT' ? 'active' : ''} onClick={() => setRole('STUDENT')}>Student</button>
              <button className={role === 'TEACHER' ? 'active' : ''} onClick={() => setRole('TEACHER')}>Teacher</button>
            </div>
            
            <div className="login-component-wrapper">
              {role === 'STUDENT' ? (
                <StudentLogin onLogin={onAuthorizedLogin} />
              ) : (
                <TeacherLogin onLogin={onAuthorizedLogin} />
              )}
            </div>
          </motion.div>
        </main>
      )}

      {/* --- 4. CLASSROOM DASHBOARD --- */}
      {appMode === 'CLASSROOM_DASH' && (
        <>
          {role === 'STUDENT' ? <StudentDashboard /> : <TeacherDashboard />}
        </>
      )}
    </div>
  );
}