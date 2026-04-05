import React, { useState, useEffect } from 'react';
import { Users, Send } from 'lucide-react';

const ChatRoom = ({ sessionData, onLeave }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [participants, setParticipants] = useState([]);

  // Initialize chat when the component loads
  useEffect(() => {
    setParticipants([
      { 
        id: 1, 
        name: sessionData.userName, 
        photo: sessionData.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${sessionData.userName}` 
      },
      { 
        id: 2, 
        name: 'Study Partner', 
        photo: 'https://api.dicebear.com/7.x/initials/svg?seed=SP' 
      }
    ]);

    setMessages([
      { 
        id: 1, 
        sender: 'System', 
        text: `Session ${sessionData.sessionId} started. Keep it focused!`, 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      }
    ]);
  }, [sessionData]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: sessionData.userName,
      text: messageInput,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      isMe: true
    };
    
    setMessages([...messages, newMsg]);
    setMessageInput('');
  };

  return (
    <div className="chat-interface">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3><Users size={18} /> Participants</h3>
          <span className="badge">{sessionData.sessionId}</span>
        </div>
        <ul className="participant-list">
          {participants.map(p => (
            <li key={p.id} className="participant">
              <img src={p.photo} alt={p.name} />
              <span>{p.name}</span>
            </li>
          ))}
        </ul>
      </aside>

      <section className="chat-area">
        <div className="chat-header">
          <h2>Live Session</h2>
          <button className="btn secondary-btn small-btn" onClick={onLeave}>Leave</button>
        </div>
        
        <div className="messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message-row ${msg.isMe ? 'me' : ''} ${msg.sender === 'System' ? 'system' : ''}`}>
              {msg.sender !== 'System' && <span className="sender">{msg.sender}</span>}
              <div className="bubble">
                <p>{msg.text}</p>
                <span className="time">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        <form className="input-area" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            value={messageInput} 
            onChange={(e) => setMessageInput(e.target.value)} 
            placeholder="Type a message..."
          />
          <button type="submit" className="btn primary-btn icon-btn"><Send size={18} /></button>
        </form>
      </section>
    </div>
  );
};

export default ChatRoom;