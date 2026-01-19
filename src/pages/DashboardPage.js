import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import styled from 'styled-components';

const socket = io.connect("http://localhost:3001");

const ChatContainer = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const MessageList = styled.div`
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow-y: scroll;
  padding: 10px;
  background: white;
  margin-bottom: 20px;
`;

const MessageBubble = styled.div`
  background: ${props => props.$isMe ? '#DCF8C6' : '#E8E8E8'};
  padding: 8px 12px;
  border-radius: 12px;
  margin-bottom: 8px;
  align-self: ${props => props.$isMe ? 'flex-end' : 'flex-start'};
  max-width: 70%;
  display: inline-block;
  clear: both;
  float: ${props => props.$isMe ? 'right' : 'left'};
`;

const DashboardPage = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const userName = location.state?.userName || "Anonymous";

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    // Join the specific room for this session ID
    socket.emit("join_room", { room: sessionId });

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    
    // Cleanup listener prevents duplicate messages
    return () => socket.off("receive_message");
  }, [sessionId]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: sessionId,
        author: userName,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  return (
    <ChatContainer>
      <h1>Session: {sessionId}</h1>
      <MessageList>
        {messageList.map((msg, index) => (
          <div key={index} style={{overflow: 'hidden', width: '100%'}}>
             <MessageBubble $isMe={msg.author === userName}>
               <strong>{msg.author}: </strong>
               {msg.message}
             </MessageBubble>
          </div>
        ))}
      </MessageList>
      <div style={{display: 'flex', gap: '10px'}}>
        <input 
          type="text" 
          value={currentMessage} 
          placeholder="Type a message..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => { event.key === "Enter" && sendMessage(); }}
          style={{flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
        />
        <button onClick={sendMessage} style={{padding: '10px 20px', background: '#1A73E8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Send</button>
      </div>
    </ChatContainer>
  );
};

export default DashboardPage;