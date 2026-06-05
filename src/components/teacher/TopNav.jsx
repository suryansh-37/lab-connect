import React, { useState } from 'react';
import { Bell, Settings, Video, CheckCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TopNav = ({ activeSection, setActiveSection, onLogout, profileData }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState(() => profileData?.notifications || []);

  const topLink = (section, label) => (
    <span onClick={() => setActiveSection(section)} style={{ color: activeSection === section ? '#0284c7' : 'var(--text-muted)', borderBottom: activeSection === section ? '2px solid #0284c7' : '2px solid transparent', paddingBottom: '1rem', marginBottom: '-1rem', cursor: 'pointer', transition: 'all 0.2s' }}>
      {label}
    </span>
  );

  const fullName = profileData?.fullName || 'Teacher';
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2.5rem', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 9999 }}>
      <div style={{ display: 'flex', gap: '2rem', fontWeight: 600, fontSize: '0.95rem' }}>
        {topLink('overview', 'Portal')}
        {topLink('my-classes', 'My Classes')}
        {topLink('communications', 'Communications')}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
        
        {/* Notifications dropdown */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={20} style={{ color: showNotifications ? '#0284c7' : 'var(--text-muted)' }} />
            {notifications.length > 0 && <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: 'white', fontSize: '0.6rem', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>{notifications.length}</span>}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} style={{ position: 'absolute', top: '150%', right: '-10px', width: '320px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid var(--border)', zIndex: 100, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Notifications</h3>{notifications.length > 0 && <span onClick={() => setNotifications([])} style={{ fontSize: '0.75rem', color: '#0284c7', cursor: 'pointer', fontWeight: 600 }}>Clear all</span>}</div>
                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  <AnimatePresence>
                      {notifications.map((notif) => (
                          <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 50, height: 0, overflow: 'hidden' }} transition={{ duration: 0.2 }} key={notif.id} onClick={() => { setActiveSection(notif.type === 'meet' ? 'meetings' : notif.type === 'submit' ? 'grading' : 'communications'); setShowNotifications(false); }} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', cursor: 'pointer', background: notif.type === 'meet' ? '#f0f9ff' : 'white' }} onMouseOver={e=>e.currentTarget.style.background=notif.type==='meet'?'#e0f2fe':'#f8fafc'} onMouseOut={e=>e.currentTarget.style.background=notif.type==='meet'?'#f0f9ff':'white'}>
                             {notif.type === 'meet' && <Video size={18} color="#0284c7" style={{marginTop: '2px', flexShrink: 0}}/>}
                             {notif.type === 'submit' && <CheckCircle size={18} color="#10b981" style={{marginTop: '2px', flexShrink: 0}}/>}
                             {notif.type === 'message' && <FileText size={18} color="#8b5cf6" style={{marginTop: '2px', flexShrink: 0}}/>}
                             
                             <div>
                                 <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.2rem 0', color: 'var(--text-main)' }}>{notif.title}</p>
                                 <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{notif.desc}</p>
                                 <span style={{ fontSize: '0.7rem', color: notif.type === 'meet' ? '#0284c7' : 'var(--text-muted)', fontWeight: notif.type === 'meet' ? 600 : 400 }}>{notif.time}</span>
                             </div>
                          </motion.div>
                      ))}
                  </AnimatePresence>
                  
                  {notifications.length === 0 && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.3 }} style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No new notifications.</motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings dropdown */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={20} style={{ color: showSettings ? '#0284c7' : 'var(--text-muted)', transition: 'transform 0.3s', transform: showSettings ? 'rotate(45deg)' : 'rotate(0deg)' }} />
          </button>
          
          <AnimatePresence>
            {showSettings && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} style={{ position: 'absolute', top: '150%', right: '-10px', width: '240px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid var(--border)', zIndex: 100, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: '#f8fafc' }}><h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Account Settings</h3></div>
                <div style={{ padding: '0.5rem' }}>
                  <button style={{ width: '100%', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '8px', textAlign: 'left', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.background='transparent'}><span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Profile Preferences</span></button>
                  <button style={{ width: '100%', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '8px', textAlign: 'left', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.background='transparent'}><span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Hardware (A/V)</span></button>
                  <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }}></div>
                  <button onClick={onLogout} style={{ width: '100%', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '8px', textAlign: 'left', color: '#ef4444', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#fee2e2'} onMouseOut={e=>e.currentTarget.style.background='transparent'}><span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Log Out Panel</span></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 10px rgba(2,132,199,0.3)' }}>{initial}</div>
      </div>
    </div>
  );
};

export default TopNav;
