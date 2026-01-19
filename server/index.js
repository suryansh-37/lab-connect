require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Session = require('./models/Session');

const app = express();

// 1. Allow Express to accept requests from anywhere
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// 2. Allow Socket.io to accept connections from anywhere
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/labconnect')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// --- API Routes ---

// Root Check
app.get('/', (req, res) => {
    res.send("LabConnect Server is Running");
});

// Create Session
app.post('/api/create-session', async (req, res) => {
  const sessionId = req.body.sessionId || Math.random().toString(36).substring(2, 8).toUpperCase();
  try {
    // Check if exists first to avoid duplicates
    const existing = await Session.findOne({ sessionId });
    if (!existing) {
        const newSession = new Session({ sessionId });
        await newSession.save();
    }
    res.json({ sessionId });
  } catch (error) {
    console.error("Create Session Error:", error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Verify Session
app.get('/api/verify-session/:id', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.id.toUpperCase() });
    res.json({ valid: !!session });
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// --- Chat Logic ---
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data.room);
    console.log(`User ${data.user} joined room: ${data.room}`);
    // Notify others in room
    socket.to(data.room).emit('receive_message', {
        id: Date.now().toString(),
        senderName: "System",
        text: `${data.user} has joined the lab.`,
        timestamp: new Date().toLocaleTimeString(),
        senderId: "system"
    });
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});