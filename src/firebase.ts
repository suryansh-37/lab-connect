// src/hooks/useChat.ts
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc 
} from 'firebase/firestore';
import type { Message } from '../types';

export const useChat = (sessionId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId || sessionId.length !== 6) return;

    // 1. Create the session document if it doesn't exist (optional but good practice)
    const sessionRef = doc(db, "sessions", sessionId);
    setDoc(sessionRef, { active: true }, { merge: true });

    // 2. Listen to messages inside this session in REAL-TIME
    const messagesRef = collection(db, "sessions", sessionId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to readable string
        timestamp: doc.data().createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '...'
      })) as Message[];
      
      setMessages(liveMessages);
      setLoading(false);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, [sessionId]);

  const sendMessage = async (text: string, senderId: string, senderName: string) => {
    if (!text.trim() || !sessionId) return;

    const messagesRef = collection(db, "sessions", sessionId, "messages");
    await addDoc(messagesRef, {
      text,
      senderId,
      senderName,
      createdAt: serverTimestamp() // Let the server decide the time
    });
  };

  return { messages, sendMessage, loading };
};