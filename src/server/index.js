require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Session = require('./models/Session');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
// Socket.io setup for Real-Time Chat
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your Vite Frontend URL
    methods: ["GET", "POST"]
  }
});

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/labconnect')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// --- API Routes ---

// 1. Create a Session
app.post('/api/create-session', async (req, res) => {
  const sessionId = Math.random().toString(36).substring(2, 7).toUpperCase();
  try {
    const newSession = new Session({ sessionId });
    await newSession.save();
    res.json({ sessionId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// 2. Verify Session (Join)
app.get('/api/verify-session/:id', async (req, res) => {
  const session = await Session.findOne({ sessionId: req.params.id });
  if (session) {
    res.json({ valid: true });
  } else {
    res.status(404).json({ valid: false });
  }
});

// --- Socket.io Chat Logic ---
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data.room);
    console.log(`User ${socket.id} joined room: ${data.room}`);
  });

  socket.on('send_message', (data) => {
    // Broadcast message to everyone in that specific room
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

server.listen(3001, () => {
  console.log('🚀 Server running on port 3001');
});