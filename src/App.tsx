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
// ✅ Updated to point to your live Render backend
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
      alert("Server Connection Error. Ensure the backend is running.");
    }
  };

  const sendMessage = () => {
    if (!inputText.trim() || !socketRef.current) return;
    const msg: Message = {
      id: generateId(), senderId: currentUser.id, senderName: currentUser.name, text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    socketRef.current.emit("send_message", { room: otp.join(""), ...msg });
    setMessages([...messages, msg]);
    setInputText('');
  };

  const confirmLeave = () => {
    socketRef.current?.disconnect();
    setShowLeaveConfirm(false);
    setAppMode('LANDING');
    setChatStep('JOIN');
    setMessages([]); setParticipants([]); setOtp(new Array(6).fill(""));
  };

  // Re-using your original logic for dark mode and Lenis
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

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
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

      <AnimatePresence>
        {showLeaveConfirm && (
          <div className="modal-overlay">
            <motion.div className="modal-box" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <div className="modal-icon"><AlertTriangle size={32} /></div>
              <h3>Leave Session?</h3>
              <p>Chat history will be cleared.</p>
              <div className="modal-actions">
                <button className="btn-outline" onClick={() => setShowLeaveConfirm(false)}>Stay</button>
                <button className="btn-danger-solid" onClick={confirmLeave}>Leave</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {appMode === 'LANDING' && (
        <main className="landing section">
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

      {appMode === 'QUICK_SESSION' && chatStep === 'JOIN' && (
        <main className="form-screen">
          <motion.div className="form-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2>{joinMode === 'CREATE' ? 'Setup Session' : 'Join Session'}</h2>
            <div className="otp-container">
              {otp.map((d, i) => (
                <input key={i} className="otp-input" value={d} maxLength={1} ref={el => inputRefs.current[i] = el} onChange={e => handleOtpChange(e.target, i)} onKeyDown={e => handleOtpKeyDown(e, i)} />
              ))}
            </div>
            <div className="input-group"><label>Name</label><input type="text" onChange={e => setCurrentUser({...currentUser, name: e.target.value})}/></div>
            <button className="btn-primary full-width" onClick={enterChatSession}>Enter Lab</button>
          </motion.div>
        </main>
      )}

      {appMode === 'QUICK_SESSION' && chatStep === 'CHAT' && (
        <main className="chat-layout">
          <aside className="sidebar">
            <div className="session-info"><h3>ID: {otp.join("")}</h3></div>
            <div className="participants-list">{participants.map(u => (<div key={u.id} className="participant">{u.name}</div>))}</div>
            <button className="btn-danger-solid" onClick={() => setShowLeaveConfirm(true)}>Exit</button>
          </aside>
          <section className="chat-area">
            <div className="messages-feed">
              {messages.map(msg => (
                <div key={msg.id} className={`message-bubble ${msg.senderId === currentUser.id ? 'my-msg' : ''}`}>
                  <strong>{msg.senderName}</strong>: {msg.text}
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

      {/* Auth and Dashboard placeholders */}
      {appMode === 'CLASSROOM_AUTH' && <main className="form-screen"><h2>Classroom Auth</h2><button onClick={() => setAppMode('LANDING')}>Back</button></main>}
    </div>
  );
}