import { useState } from 'react';
import { GraduationCap, KeyRound } from 'lucide-react';

interface TeacherLoginProps {
  onLogin: (email: string) => void;
}

export const TeacherLogin = ({ onLogin }: TeacherLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState(''); // Extra security for teachers

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("Please enter credentials");
    // In a real app, you'd check the admin key here
    onLogin(email);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form-enter">
      <div className="auth-header-icon teacher">
        <GraduationCap size={32} />
      </div>
      <h3>Instructor Portal</h3>
      <p className="auth-sub">Manage courses and students</p>

      <div className="input-group">
        <label>Faculty Email</label>
        <input 
          type="text" 
          placeholder="prof.name@university.edu" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
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

      <div className="input-group">
        <label>Admin Key (Optional)</label>
        <div className="input-with-icon">
          <input 
            type="password" 
            placeholder="Enter faculty key" 
            value={adminKey} 
            onChange={e => setAdminKey(e.target.value)} 
          />
          <button type="button" className="icon-btn-small"><KeyRound size={14}/></button>
        </div>
      </div>

      <button type="submit" className="btn-primary full-width" style={{backgroundColor: '#0F4C75'}}>
        Login to Dashboard
      </button>
    </form>
  );
};