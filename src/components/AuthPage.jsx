import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, User } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthPage = ({ role, onBack, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess(role);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    }
  };

  return (
    <motion.div 
      className="auth-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.button 
        className="back-home-btn" 
        onClick={onBack}
        whileHover={{ x: -6, color: 'var(--accent)' }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft size={18} /> Back to Home
      </motion.button>

      <motion.div 
        className="auth-card"
        whileHover={{ 
          y: -8, 
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          borderColor: "var(--accent)"
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          key={isLogin ? 'login' : 'signup'} 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
        >
          
          <motion.div className="auth-header" variants={itemVariants}>
            <h2>{isLogin ? `${role} Portal` : `Create Account`}</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {isLogin 
                ? 'Enter your credentials to access your account.' 
                : `Register as a new ${role.toLowerCase()} to get started.`}
            </p>
          </motion.div>

          <form className="auth-form" onSubmit={handleSubmit}>
            
            {/* --- SIGN UP ONLY: FULL NAME --- */}
            {!isLogin && (
              <motion.div className="input-group" variants={itemVariants}>
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={18} />
                  <input type="text" placeholder="John Doe" required />
                </div>
              </motion.div>
            )}

            {/* --- SHARED FIELD: EMAIL / EMPLOYEE ID --- */}
            <motion.div className="input-group" variants={itemVariants}>
              {/* Dynamic Label based on Role */}
              <label>{role === 'Teacher' ? 'Email or Employee ID' : 'Email Address'}</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input 
                  /* Dynamic Type: Text for teachers (allows IDs), Email for students */
                  type={role === 'Teacher' ? 'text' : 'email'} 
                  placeholder={role === 'Teacher' ? 'name@example.com or EMP-123' : 'name@example.com'} 
                  required 
                />
              </div>
            </motion.div>

            {/* --- SHARED FIELD: PASSWORD --- */}
            <motion.div className="input-group" variants={itemVariants}>
              <label>Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input type="password" placeholder="••••••••" required />
              </div>
            </motion.div>

            {/* --- SIGN UP ONLY: CONFIRM PASSWORD --- */}
            {!isLogin && (
              <motion.div className="input-group" variants={itemVariants}>
                <label>Confirm Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={18} />
                  <input type="password" placeholder="••••••••" required />
                </div>
              </motion.div>
            )}

            {/* --- SUBMIT BUTTON --- */}
            <motion.button 
              type="submit" 
              className="btn primary-btn full-width"
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(41, 128, 185, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          {/* --- TOGGLE LOGIN/SIGNUP --- */}
          <motion.div className="auth-footer" variants={itemVariants}>
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                className="toggle-auth-btn" 
                onClick={() => setIsLogin(!isLogin)}
              >
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