import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, User, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthPage = ({ role, onBack, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI State
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (!isLogin) {
        // --- REGISTRATION ---
        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password, role })
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message);
        
        setIsLogin(true);
        setErrorMsg("✅ Account Created Successfully! Please Sign In.");
      } else {
        // --- LOGIN ---
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        // Simple Direct Connect!
        onLoginSuccess(role);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div className="auth-container" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: "easeOut" }}>
      <motion.button className="back-home-btn" onClick={onBack} whileHover={{ x: -6, color: 'var(--accent)' }} whileTap={{ scale: 0.9 }}>
        <ArrowLeft size={18} /> Back to Home
      </motion.button>

      <motion.div className="auth-card" whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)", borderColor: "var(--accent)" }} transition={{ duration: 0.3 }}>
        
        <motion.div key={isLogin ? 'login' : 'signup'} variants={containerVariants} initial="hidden" animate="visible">
          
          <motion.div className="auth-header" variants={itemVariants}>
            <h2>{isLogin ? `${role} Portal` : `Create Account`}</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {isLogin ? 'Enter your credentials to access your account.' : `Register as a new ${role.toLowerCase()} to get started.`}
            </p>
          </motion.div>

          {errorMsg && <div style={{ background: errorMsg.includes('✅') ? '#dcfce7' : '#fee2e2', color: errorMsg.includes('✅') ? '#16a34a' : '#ef4444', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>{errorMsg.includes('✅') ? null : <AlertCircle size={16}/>} {errorMsg}</div>}

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            
            {!isLogin && (
              <motion.div className="input-group" variants={itemVariants}>
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={18} />
                  <input type="text" placeholder="Enter Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>
              </motion.div>
            )}

            <motion.div className="input-group" variants={itemVariants}>
              <label>{role === 'Teacher' ? 'Email or Employee ID' : 'Email Address'}</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input type={role === 'Teacher' ? 'text' : 'email'} placeholder={role === 'Teacher' ? 'name@example.com or EMP-123' : 'name@example.com'} value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </motion.div>

            <motion.div className="input-group" variants={itemVariants}>
              <label>Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </motion.div>

            {!isLogin && (
              <motion.div className="input-group" variants={itemVariants}>
                <label>Confirm Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={18} />
                  <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
              </motion.div>
            )}

            <motion.button type="submit" className="btn primary-btn full-width" variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} disabled={isLoading}>
              {isLoading ? 'Connecting to Servers...' : isLogin ? 'Sign In Directly' : 'Create Account'}
            </motion.button>
          </form>

          <motion.div className="auth-footer" variants={itemVariants}>
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" className="toggle-auth-btn" onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}>
                {isLogin ? 'Sign Up Now' : 'Sign In'}
              </button>
            </p>
          </motion.div>

        </motion.div>
      </motion.div>
    </motion.div>
  );
};
export default AuthPage;