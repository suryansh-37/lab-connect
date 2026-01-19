import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import styled from 'styled-components';
import AnimatedButton from '../components/UI/Button'; 

// ✅ Production Backend URL
const BACKEND_URL = "https://lab-connect.onrender.com"; 

// --- TYPES & INTERFACES ---
interface Message {
  room: string;
  author: string;
  message: string;
  time: string;
}

interface LocationState {
  userName?: string;
  isCreator?: boolean;
}

// --- STYLED COMPONENTS ---
const DashboardContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 15px 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const SessionInfo = styled.div`
  h2 { font-size: 1.2rem; margin-bottom: 4px; }
  p { color: var(--color-text-secondary); font-size: 0.9rem; }
`;

interface StatusBadgeProps {
  $connected: boolean;
}

const StatusBadge = styled.span<StatusBadgeProps>`
  background: ${props => props.$connected ? '#E6F4EA' : '#FCE8E6'};
  color: ${props => props.$connected ? '#1E8E3E' : '#D93025'};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    display: block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background-color: currentColor;
  }
`;

const ChatWindow = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MessageList = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #F8F9FA;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

interface MessageBubbleProps {
  $isMe: boolean;
}

const MessageBubble = styled.div<MessageBubbleProps>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.4;
  position: relative;
  word-wrap: break-word;

  align-self: ${props => props.$isMe ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.$isMe ? 'var(--color-accent)' : 'white'};
  color: ${props => props.$isMe ? 'white' : 'var(--color-text-primary)'};
  border: ${props => props.$isMe ? 'none' : '1px solid #E0E0E0'};
  border-bottom-right-radius: ${props => props.$isMe ? '4px' : '18px'};
  border-bottom-left-radius: ${props => props.$isMe ? '18px' : '4px'};

  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

const MessageMeta = styled.div<MessageBubbleProps>`
  font-size: 0.75rem;
  margin-bottom: 4px;
  opacity: 0.8;
  font-weight: 600;
  color: ${props => props.$isMe ? 'rgba(255,255,255,0.9)' : 'var(--color-text-secondary)'};
`;

const InputArea = styled.div`
  padding: 20px;
  background: white;
  border-top: 1px solid #F1F3F4;
  display: flex;
  gap: 15px;
  align-items: center;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 14px;
  border: 2px solid #F1F3F4;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
`;

// --- MAIN COMPONENT ---

const DashboardPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Safely cast location.state
  const state = location.state as LocationState;
  const userName = state?.userName || "Guest";
  const isCreator = state?.isCreator || false;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Auto-scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  // --- SOCKET CONNECTION LOGIC ---
  useEffect(() => {
    // 1. Connect to the backend
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    // 2. Setup Listeners
    newSocket.on('connect', () => {
      console.log("✅ Connected with ID:", newSocket.id);
      setIsConnected(true);
      
      // Join the specific room for this session
      if (sessionId) {
        newSocket.emit("join_room", { room: sessionId });
      }
    });

    newSocket.on('disconnect', () => {
      console.log("❌ Disconnected");
      setIsConnected(false);
    });

    newSocket.on("receive_message", (data: Message) => {
      setMessageList((prev) => [...prev, data]);
    });

    // 3. Cleanup on unmount (leave room/disconnect)
    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  const sendMessage = async () => {
    if (currentMessage.trim() === "" || !socket || !sessionId) return;

    const messageData: Message = {
      room: sessionId,
      author: userName,
      message: currentMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Emit to server
    await socket.emit("send_message", messageData);

    // Add to local list immediately (so we see our own message)
    setMessageList((list) => [...list, messageData]);
    setCurrentMessage("");
  };

  const handleLeave = () => {
    if (window.confirm("Are you sure you want to leave the session?")) {
      navigate('/');
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <SessionInfo>
          <h2>Session: {sessionId}</h2>
          <p>Logged in as: <strong>{userName}</strong> {isCreator && '(Instructor)'}</p>
        </SessionInfo>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <StatusBadge $connected={isConnected}>
            {isConnected ? 'Live' : 'Connecting...'}
          </StatusBadge>
          <button 
            onClick={handleLeave}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#D93025', 
              cursor: 'pointer', 
              fontWeight: '600' 
            }}
          >
            Leave
          </button>
        </div>
      </Header>

      <ChatWindow>
        <MessageList>
          {messageList.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
              No messages yet. Start the conversation!
            </div>
          )}
          
          {messageList.map((msg, index) => {
            const isMe = msg.author === userName;
            return (
              <MessageBubble key={index} $isMe={isMe}>
                <MessageMeta $isMe={isMe}>
                  {msg.author} • {msg.time}
                </MessageMeta>
                {msg.message}
              </MessageBubble>
            );
          })}
          <div ref={messagesEndRef} />
        </MessageList>

        <InputArea>
          <StyledInput 
            type="text" 
            value={currentMessage} 
            placeholder="Type a secure message..."
            onChange={(event) => setCurrentMessage(event.target.value)}
            onKeyPress={(event) => { event.key === "Enter" && sendMessage(); }}
            disabled={!isConnected}
          />
          <div style={{ width: '100px' }}>
            <AnimatedButton onClick={sendMessage} type="button">
              Send
            </AnimatedButton>
          </div>
        </InputArea>
      </ChatWindow>
    </DashboardContainer>
  );
};

export default DashboardPage;