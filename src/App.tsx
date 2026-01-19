import { useState, useEffect, useRef } from 'react';
import type { User, Message, UserRole } from './types';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import { 
  Moon, Sun, Send, Copy, LogOut, 
  FlaskConical, Zap, BookOpen, AlertTriangle,
  Bot, User as UserIcon, Atom, Hexagon,
  Settings, Users, GraduationCap
} from 'lucide-react';

// ✅ Fixes "declared but never read" error by using them below
import { StudentLogin } from './components/StudentLogin';
import { TeacherLogin } from './components/TeacherLogin';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';

import './App.css';

// ✅ POINT TO YOUR RENDER SERVER
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
  const [darkMode, setDarkMode] = useState(false);
  const [appMode, setAppMode] = useState<'LANDING' | 'QUICK_SESSION' | 'CLASSROOM_AUTH' | 'CLASSROOM_DASH'>('LANDING');
  const socketRef = useRef<Socket | null>(null);
  
  // Quick Session State
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
  
  // Classroom State
  const [role, setRole] = useState<UserRole>('STUDENT');

  // --- SOCKET LISTENERS ---
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(BACKEND_URL, { autoConnect: false });
    }
    const socket = socketRef.current;

    socket.on("receive_message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, []);

  // --- HANDLERS ---
  const enterChatSession = async () => {
    const finalSessionId = otp.join("");
    if (!currentUser.name) return alert("Please enter your name.");
    if (finalSessionId.length !== 6) return alert("Invalid Session ID.");

    try {
      if (joinMode === 'JOIN') {
        const res = await axios.get(`${BACKEND_URL}/api/verify-session/${finalSessionId}`);
        if (!res.data.valid) return alert("Session not found!");
      } else {
        await axios.post(`${BACKEND_URL}/api/create-session`, { sessionId: finalSessionId });
      }

      const userWithId = { ...currentUser, id: generateId() };
      setCurrentUser(userWithId);
      setParticipants([userWithId, { id: 'bot', name: 'Lab Assistant', avatar: 'bot' }]); 
      
      socketRef.current?.connect();
      socketRef.current?.emit("join_room", { room: finalSessionId, user: userWithId.name });
      setChatStep('CHAT');
    } catch (err) {
      console.error(err);
      alert("Server Connection Error. Is the backend running?");
    }
  };

  const sendMessage = () => {
    if (!inputText.trim() || !socketRef.current) return;
    const msg: Message = {
      id: generateId(), senderId: currentUser.id, senderName: currentUser.name, text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    socketRef.current.emit("send_message", { room: otp.join(""), ...msg });
    setMessages((prev) => [...prev, msg]);
    setInputText('');
  };

  const confirmLeave = () => {
    socketRef.current?.disconnect();
    setShowLeaveConfirm(false);
    setAppMode('LANDING');
    setChatStep('JOIN');
    setMessages([]); setParticipants([]); setOtp(new Array(6).fill(""));
  };

  const onAuthorizedLogin = (email: string) => {
    const name = email.split('@')[0];
    setCurrentUser({ id: 'user-1', name: name, avatar: 'user' });
    setAppMode('CLASSROOM_DASH');
  };

  // UI Effects
  useEffect(() => { document.body.className = darkMode ? 'dark-theme' : 'light-theme'; }, [darkMode]);
  useEffect(() => {
    if (appMode === 'LANDING') {
      const lenis = new Lenis();
      function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      return () => lenis.destroy();
    }
  }, [appMode]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.toUpperCase();
    if (val && !/^[A-Z0-9]$/.test(val)) return;
    const newOtp = [...otp]; newOtp[index] = val; setOtp(newOtp);
    if (val && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const renderAvatar = (key: string) => { const Icon = AVATAR_MAP[key] || UserIcon; return <Icon size={20} />; };

  return (
    <div className={`app-container ${appMode === 'QUICK_SESSION' && chatStep === 'CHAT' ? 'chat-mode' : ''}`}>
      <nav className="navbar">
        <div className="logo-wrapper" onClick={() => setAppMode('LANDING')} style={{cursor: 'pointer'}}>
          <FlaskConical className="logo-icon" size={28} />
          <div className="logo">Lab<span className="accent">Connect</span></div>
        </div>
        <div className="nav-actions">
          <button onClick={() => setDarkMode(!darkMode)} className="theme-btn icon-btn">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* --- LEAVE CONFIRM MODAL --- */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <div className="modal-overlay">
            <motion.div className="modal-box" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <div className="modal-icon"><AlertTriangle size={32} /></div>
              <h3>Leave Session?</h3>
              <div className="modal-actions">
                <button className="btn-outline" onClick={() => setShowLeaveConfirm(false)}>Stay</button>
                <button className="btn-danger-solid" onClick={confirmLeave}>Leave</button>
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
          <h1 className="hero-title">Your Virtual Science Hub.</h1>
          <div className="mode-cards-container">
            <div className="mode-card" onClick={() => { setAppMode('QUICK_SESSION'); setChatStep('JOIN'); setJoinMode('CREATE'); setOtp(generateId().split("")); }}>
              <div className="mode-icon"><Zap size={32}/></div>
              <h3>Quick Lab</h3>
            </div>
            <div className="mode-card highlight" onClick={() => setAppMode('CLASSROOM_AUTH')}>
              <div className="mode-icon"><BookOpen size={32}/></div>
              <h3>Classroom</h3>
            </div>
          </div>
        </main>
      )}

      {/* --- 2. QUICK SESSION --- */}
      {appMode === 'QUICK_SESSION' && chatStep === 'JOIN' && (
        <main className="form-screen">
          <motion.div className="form-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2>{joinMode === 'CREATE' ? 'Setup Session' : 'Join Session'}</h2>
            <div className="otp-container">
              {otp.map((d, i) => (
                <input key={i} className="otp-input" value={d} maxLength={1} ref={el => inputRefs.current[i] = el} onChange={e => handleOtpChange(e.target, i)} />
              ))}
            </div>
            <div className="input-group"><label>Name</label><input type="text" onChange={e => setCurrentUser({...currentUser, name: e.target.value})}/></div>
            
            <div style={{display:'flex', gap:10, marginTop:10}}>
                 <button className="btn-outline full-width" onClick={() => { setJoinMode(joinMode==='CREATE'?'JOIN':'CREATE'); setOtp(joinMode==='CREATE'? Array(6).fill(""):generateId().split("")); }}>
                   {joinMode==='CREATE' ? 'Switch to Join' : 'Switch to Create'}
                 </button>
                 <button className="btn-primary full-width" onClick={enterChatSession}>Enter Lab</button>
            </div>
          </motion.div>
        </main>
      )}

      {appMode === 'QUICK_SESSION' && chatStep === 'CHAT' && (
        <main className="chat-layout">
          <aside className="sidebar">
            <div className="session-info"><h3>ID: {otp.join("")}</h3></div>
            <div className="participants-list">{participants.map(u => (<div key={u.id} className="participant">{u.name}</div>))}</div>
            <button className="btn-danger-solid" onClick={() => setShowLeaveConfirm(true)}><LogOut size={16}/> Exit</button>
          </aside>
          <section className="chat-area">
            <div className="messages-feed">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message-bubble ${msg.senderId === currentUser.id ? 'my-msg' : ''}`}>
                  <div className="msg-header"><span>{msg.senderName}</span></div>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-input-area">
              <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Message..." />
              <button onClick={sendMessage}><Send size={18}/></button>
            </div>
          </section>
        </main>
      )}

      {/* --- 3. CLASSROOM AUTH (Uses StudentLogin/TeacherLogin) --- */}
      {appMode === 'CLASSROOM_AUTH' && (
        <main className="form-screen">
          <motion.div className="form-card auth-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <button className="back-text-btn" onClick={() => setAppMode('LANDING')}>&larr; Back</button>
            <div className="role-switcher">
              <button className={role === 'STUDENT' ? 'active' : ''} onClick={() => setRole('STUDENT')}>Student</button>
              <button className={role === 'TEACHER' ? 'active' : ''} onClick={() => setRole('TEACHER')}>Teacher</button>
            </div>
            
            {/* ✅ THIS IS WHERE THE COMPONENTS ARE USED */}
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