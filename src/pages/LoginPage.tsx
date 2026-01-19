import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnimatedButton from '../components/UI/Button'; // Ensure this path is correct for your project

// ✅ Production Backend URL
const BACKEND_URL = "https://lab-connect.onrender.com"; 

// --- STYLED COMPONENTS ---
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: var(--color-background); 
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Header = styled.header`
  margin-bottom: 40px;
  text-align: center;
  width: 100%; 
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Card = styled(motion.div)`
    background: var(--color-card); 
    padding: 30px;
    border-radius: 12px; 
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); 
    width: 100%;
    max-width: 480px; 
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const SegmentedControlContainer = styled(motion.div)`
    display: flex;
    background: #F1F3F4; 
    border-radius: 10px; 
    padding: 5px;
    width: 100%;
    position: relative; 
    margin-top: 20px;
`;

// Helper interface for styled components props
interface TabButtonProps {
    $active: boolean;
}

const TabButton = styled(motion.button)<TabButtonProps>`
    flex: 1;
    padding: 10px 5px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    color: ${props => props.$active ? 'white' : 'var(--color-text-primary)'};
    z-index: 10;
    transition: color 0.15s ease-in; 
`;

const ActiveTabIndicator = styled(motion.div)`
    position: absolute;
    top: 5px;
    bottom: 5px;
    background: var(--color-accent); 
    border-radius: 8px;
    z-index: 5; 
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 15px;
    margin-bottom: 20px;
    border: 1px solid #DADCE0;
    border-radius: 8px; 
    background-color: white;
    color: var(--color-text-primary);
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
    
    &:focus {
        border-color: var(--color-secondary-accent); 
        box-shadow: 0 0 0 1px var(--color-secondary-accent);
        outline: none;
    }
`;

const SessionCodeInputContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: center;
`;

const CodeSegmentInput = styled.input`
    width: 50px;
    height: 60px;
    text-align: center;
    font-size: 1.4rem;
    font-weight: 700;
    border: 1px solid #DADCE0;
    border-radius: 8px;
    transition: all 0.2s;
    text-transform: uppercase;
    
    &:focus {
        border-color: var(--color-accent);
        box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
        outline: none;
        transform: translateY(-2px);
    }
`;

const FormSubHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-text-primary);
`;

// --- TYPES ---
type TabOption = 'join' | 'create' | 'admin';

const LoginPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabOption>('join');
    const [sessionCode, setSessionCode] = useState<string[]>(['', '', '', '', '']); 
    const [name, setName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const navigate = useNavigate();

    const getTabIndex = (tab: string) => {
        return ['join', 'create', 'admin'].indexOf(tab);
    }

    const handleCodeChange = (index: number, value: string) => {
        const val = value.toUpperCase();
        if (!/^[A-Z0-9]*$/.test(val)) return; 

        const newCode = [...sessionCode];
        newCode[index] = val.slice(0, 1); 
        setSessionCode(newCode);

        // Auto-focus next input
        if (val && index < 4) {
            document.getElementById(`code-segment-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !sessionCode[index] && index > 0) {
            document.getElementById(`code-segment-${index - 1}`)?.focus();
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullCode = sessionCode.join('');

        if (fullCode.length !== 5 || !name) {
            alert("Please enter a 5-character session code and your name.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.get(`${BACKEND_URL}/api/verify-session/${fullCode}`);
            
            if (response.data.valid) {
                navigate(`/dashboard/${fullCode}`, { state: { userName: name } });
            } else {
                alert("Session not found or expired.");
            }
        } catch (error) {
            console.error("Join Error:", error);
            alert("Could not connect to server.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSession = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/create-session`);
            const newSessionId = response.data.sessionId;
            navigate(`/dashboard/${newSessionId}`, { state: { userName: 'Instructor', isCreator: true } });
        } catch (error) {
            console.error("Create Error:", error);
            alert("Failed to create session. Server might be waking up.");
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    const handleAdminLogin = (role: string) => {
        alert(`Redirecting to ${role} Login. (Functionality under construction)`);
    }

    const renderTabContent = () => {
        const variants = {
            hidden: { opacity: 0, x: 20 },
            visible: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 }
        };

        if (activeTab === 'join') {
            return (
                <motion.div key="join" variants={variants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.2 }}>
                    <FormSubHeader>🚀 Join a Lab Session</FormSubHeader>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '25px', textAlign: 'center', fontSize: '0.9rem' }}>Enter the code provided by your instructor.</p>
                    <form onSubmit={handleJoin}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '10px' }}>SESSION CODE</label>
                        <SessionCodeInputContainer>
                            {sessionCode.map((char, index) => (
                                <CodeSegmentInput
                                    key={index}
                                    id={`code-segment-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={char}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    autoFocus={index === 0}
                                    placeholder="•"
                                />
                            ))}
                        </SessionCodeInputContainer>
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }}>DISPLAY NAME</label>
                        <Input type="text" placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} required style={{marginBottom: '30px'}} />
                        <AnimatedButton type="submit" disabled={isLoading}>{isLoading ? 'Verifying...' : 'Join Lab Session'}</AnimatedButton>
                    </form>
                </motion.div>
            );
        }

        if (activeTab === 'create') {
            return (
                <motion.div key="create" variants={variants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.2 }} style={{ textAlign: 'center', padding: '20px 0' }}>
                    <FormSubHeader>👨‍🏫 Instructor Mode</FormSubHeader>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px' }}>Start a new class session. You will receive a unique code to share with students.</p>
                    <AnimatedButton onClick={handleCreateSession} disabled={isLoading}>{isLoading ? 'Creating Room...' : 'Generate & Launch Room'}</AnimatedButton>
                </motion.div>
            );
        }

        if (activeTab === 'admin') {
            return (
                <motion.div key="admin" variants={variants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.2 }} style={{ textAlign: 'center' }}>
                    <FormSubHeader>🔒 Admin Portal</FormSubHeader>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px' }}>Restricted access for platform managers.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button onClick={() => handleAdminLogin('Super Admin')} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #DADCE0', background: 'white', cursor: 'pointer' }}>Super Admin Login</button>
                    </div>
                </motion.div>
            );
        }
    };

    return (
        <PageContainer>
            <Header>
                <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontSize: '2.5rem', fontWeight: '700' }}>
                    Lab<span style={{ color: 'var(--color-accent)' }}>Connect</span> 🔑
                </motion.h1>
                <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ color: 'var(--color-text-secondary)', marginTop: '5px' }}>
                    Secure, distraction-free digital classroom.
                </motion.p>
                <SegmentedControlContainer>
                    <AnimatePresence>
                        <ActiveTabIndicator 
                            key="indicator"
                            layoutId="tabIndicator"
                            style={{ 
                                width: `calc((100% - 10px) / 3)`,
                                left: `calc(5px + ${getTabIndex(activeTab)} * ((100% - 10px) / 3))`
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    </AnimatePresence>
                    {(['join', 'create', 'admin'] as const).map(tab => (
                        <TabButton key={tab} $active={activeTab === tab} onClick={() => setActiveTab(tab)}>
                            {tab === 'join' ? 'Join Session' : tab === 'create' ? 'Create Session' : 'Admin'}
                        </TabButton>
                    ))}
                </SegmentedControlContainer>
            </Header>
            <Card initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
                <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
            </Card>
            <footer style={{ marginTop: '40px', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>© 2025 LabConnect. Stay Connected. Learn Together.</footer>
        </PageContainer>
    );
};

export default LoginPage;