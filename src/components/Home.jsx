import React, { useMemo } from 'react';
import { User, BookOpen, ShieldCheck, MailCheck, Video, MessageCircle, Cast, Users, Presentation, Star, Github, Twitter, Linkedin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// ==========================================
// Particle Background Component (Theme Fixed)
// ==========================================
const ParticleBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 8 + 4,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    }));
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, left: 0, width: '100%', height: '100%', 
      zIndex: -1, overflow: 'hidden', 
      background: 'var(--bg-main)' // Uses theme variable rather than static gradient
    }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            background: 'var(--accent)',
            opacity: 0.15,
            borderRadius: '50%',
            left: `${p.x}%`,
            top: `${p.y}%`,
            boxShadow: '0 0 10px rgba(41, 128, 185, 0.2)'
          }}
          animate={{
            y: ['0vh', '-120vh'],
            x: ['0vw', '5vw', '-5vw', '0vw'],
            opacity: [0, 0.5, 0.5, 0]
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
};

// ==========================================
// MAIN HOME COMPONENT
// ==========================================
const Home = ({ onNavigate }) => {
  return (
    <>
      <style>
        {`
          ::-webkit-scrollbar { display: none; }
          html, body { -ms-overflow-style: none; scrollbar-width: none; }
          .glass-panel {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 16px;
            transition: box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
          }
        `}
      </style>

      <ParticleBackground />

      <motion.div 
        className="home-portal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ 
          overflowY: 'auto', height: '100vh', display: 'flex', flexDirection: 'column', 
          alignItems: 'center', position: 'relative', zIndex: 1, color: 'var(--text-main)', width: '100%', maxWidth: '100%'
        }}
      >
        {/* === HERO SECTION === */}
        <div style={{ marginTop: '12vh', textAlign: 'center', padding: '0 1rem' }}>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
            style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-main)' }}
          >
            Welcome to <span style={{ color: 'var(--accent)' }}>Lab-Connect</span>
          </motion.h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>The frictionless virtual learning environment.</p>
        </div>
        
        {/* PORTAL SELECTION */}
        <div style={{ display: 'flex', gap: '2rem', perspective: '1000px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem', padding: '0 1rem' }}>
          <motion.button 
            className="glass-panel"
            onClick={() => onNavigate('student-auth')}
            whileHover={{ scale: 1.05, translateY: -5, boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            style={{ padding: '3rem 2rem', width: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            <div style={{ background: 'rgba(41, 128, 185, 0.1)', color: 'var(--accent)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <User size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Student Portal</h3>
            <p style={{ color: 'var(--text-muted)' }}>Access your labs, join sessions, and collaborate effortlessly.</p>
          </motion.button>

          <motion.button 
            className="glass-panel"
            onClick={() => onNavigate('teacher-auth')}
            whileHover={{ scale: 1.05, translateY: -5, boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
            style={{ padding: '3rem 2rem', width: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            <div style={{ background: 'rgba(41, 128, 185, 0.1)', color: 'var(--accent)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <BookOpen size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Teacher Portal</h3>
            <p style={{ color: 'var(--text-muted)' }}>Manage workspaces, host streams, and create interactive sessions.</p>
          </motion.button>
        </div>

        {/* === SECTION: HOW IT WORKS === */}
        <div style={{ padding: '5rem 2rem', width: '100%', maxWidth: '1200px' }}>
          <h3 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem', fontWeight: '700' }}>How It Works</h3>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { num: '1', title: 'Select Portal', desc: 'Log in instantly as a student or a teacher.' },
              { num: '2', title: 'Join Workspace', desc: 'Enter the designated digital classroom via code.' },
              { num: '3', title: 'Collaborate', desc: 'Interact via HD video, live streams, or direct chat.' }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                style={{ flex: '1', minWidth: '250px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {step.num}
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{step.title}</h4>
                <p style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* === SECTION: FEATURES OVERVIEW === */}
        <div style={{ padding: '5rem 2rem', width: '100%', maxWidth: '1200px' }}>
          <h3 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem', fontWeight: '700' }}>Powerful Features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {[
              { icon: <ShieldCheck size={40}/>, title: 'Zero-Login Security', desc: 'No complex sign-ups. Connect safely within a localized encrypted session ensuring absolute privacy.' },
              { icon: <Video size={40}/>, title: 'HD Video Conferencing', desc: 'Smooth, integrated video rooms. See everyone clearly without needing external apps.' },
              { icon: <Cast size={40}/>, title: 'Live Class Streams', desc: 'Broadcast lessons effectively directly to all participating students with dynamic streams.' },
              { icon: <MessageCircle size={40}/>, title: 'Real-Time Chat', desc: 'Dedicated groups and private messaging for easy peer-to-peer communication.' },
              { icon: <MailCheck size={40}/>, title: 'Direct Inbox Resources', desc: 'Instructors can push materials and documents seamlessly direct to participant accounts.' },
              { icon: <Presentation size={40}/>, title: 'Interactive Dashboard', desc: 'Manage assignments, subjects, and schedules directly inside dynamic 3D-styled boards.' }
            ].map((feat, idx) => (
              <motion.div
                key={idx}
                className="glass-panel"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (idx % 3) * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)" }}
                style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{feat.icon}</div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{feat.title}</h4>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{feat.desc}</p>
              </motion.div>
            ))}
            
          </div>
        </div>

        {/* === SECTION: STATISTICS === */}
        <div style={{ padding: '4rem 2rem', width: '100%', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginTop: '2rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
            {[
              { num: '10k+', label: 'Happy Students', icon: <Users size={24}/> },
              { num: '500+', label: 'Active Teachers', icon: <BookOpen size={24}/> },
              { num: '99%', label: 'Session Uptime', icon: <Star size={24}/> }
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} style={{ textAlign: 'center', color: 'var(--text-main)' }}>
                <div style={{ color: 'var(--accent)', display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{stat.num}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* === SECTION: CTA === */}
        <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
          <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Ready to transform your virtual labs?
          </motion.h3>
          <motion.button 
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}
          >
            Get Started Now <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* === FOOTER === */}
        <footer style={{ width: '100%', padding: '3rem 2rem', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <h4 style={{ fontWeight: '600', color: 'var(--text-main)' }}>Platform</h4>
              <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>Features</span>
              <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>Integrations</span>
              <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>Pricing</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <h4 style={{ fontWeight: '600', color: 'var(--text-main)' }}>Company</h4>
              <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>About Us</span>
              <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>Careers</span>
              <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>Contact</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <h4 style={{ fontWeight: '600', color: 'var(--text-main)' }}>Legal</h4>
              <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>Privacy Policy</span>
              <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>Terms of Service</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            <Github size={24} style={{ cursor: 'pointer' }} />
            <Twitter size={24} style={{ cursor: 'pointer' }} />
            <Linkedin size={24} style={{ cursor: 'pointer' }} />
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} Lab-Connect. All rights reserved.</p>
        </footer>

      </motion.div>
    </>
  );
};

export default Home;