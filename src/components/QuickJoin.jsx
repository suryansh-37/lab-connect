import React, { useState, useRef, useEffect } from 'react';
import { User, LogIn, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const QuickJoin = ({ onJoin, onBack }) => {
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const [isJoining, setIsJoining] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length === 6 && name.trim()) {
      setIsJoining(true);
      setErrorMsg('');
      try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sessions/join/${fullOtp}`);
          const data = await res.json();
          if (!res.ok) {
              setErrorMsg(data.message);
              setIsJoining(false);
              return;
          }
          // Connected! Pass actual mapped meeting title for subject overlay globally!
          onJoin(name.trim(), data.title);
      } catch (err) {
          setErrorMsg("Backend verification service failure. Try again.");
          setIsJoining(false);
      }
    }
  };

  return (
    <motion.div 
      className="centered-view" 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="auth-card" style={{ maxWidth: '500px', width: '100%', position: 'relative', overflow: 'hidden' }}>
        
        {/* Animated Background Overlay when connecting */}
        {isJoining && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'var(--accent)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', marginBottom: '1rem' }}
            />
            <h3>Connecting to Room...</h3>
          </motion.div>
        )}

        <button className="back-home-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>

        <div className="auth-header">
          <h2>Quick Join Session</h2>
          <p className="subtitle">Enter your name and the 6-digit server passcode.</p>
        </div>

        {errorMsg && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>Your Name</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                placeholder="E.g. John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '1rem' }}>
            <label>Room Code (OTP)</label>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  whileFocus={{ scale: 1.1, borderColor: 'var(--accent)' }}
                  style={{
                    width: '45px',
                    height: '55px',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  required
                />
              ))}
            </div>
          </div>

          <motion.button 
            type="submit" 
            className="btn primary-btn full-width" 
            style={{ marginTop: '2rem' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={otp.join('').length !== 6 || !name.trim()}
          >
            <LogIn size={18} /> Join Now
          </motion.button>
        </form>

      </div>
    </motion.div>
  );
};

export default QuickJoin;
