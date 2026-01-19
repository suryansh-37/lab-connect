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

// ✅ Updated CORS to allow your deployed frontend to connect
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/labconnect')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// --- API Routes ---

// 1. Root route to check if server is awake
app.get('/', (req, res) => {
    res.send("LabConnect Server is Running");
});

// 2. Create a Session
app.post('/api/create-session', async (req, res) => {
  // Use 6 digits to match your App.tsx logic
  const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
  try {
    const newSession = new Session({ sessionId });
    await newSession.save();
    res.json({ sessionId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// 3. Verify Session (Join)
app.get('/api/verify-session/:id', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.id.toUpperCase() });
    if (session) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// --- Socket.io Real-Time Logic ---
io.on('connection', (socket) => {
  console.log(`✅ User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data.room);
    console.log(`User ${data.user} joined room: ${data.room}`);
    socket.to(data.room).emit('user_joined', { name: data.user });
  });

  socket.on('send_message', (data) => {
    // Broadcast message to everyone in the room except the sender
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});