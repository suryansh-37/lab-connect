import { useState } from 'react';
import { User, BookOpen } from 'lucide-react';

interface StudentLoginProps {
  onLogin: (email: string) => void;
}

export const StudentLogin = ({ onLogin }: StudentLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill in all fields");
    onLogin(email);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form-enter">
      <div className="auth-header-icon student">
        <BookOpen size={32} />
      </div>
      <h3>Student Portal</h3>
      <p className="auth-sub">Access your assignments and grades</p>

      <div className="input-group">
        <label>Student Email</label>
        <div className="input-with-icon">
          <input 
            type="text" 
            placeholder="student@university.edu" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
      </div>

      <div className="input-group">
        <label>Password</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />
      </div>

      <button type="submit" className="btn-primary full-width">
        <User size={18} style={{marginRight: 8}}/> Login as Student
      </button>
    </form>
  );
};