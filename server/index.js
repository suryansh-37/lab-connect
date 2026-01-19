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
const io = new Server(server, {
  cors: {
    // IMPORTANT: Allow your frontend (local or deployed) to connect
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB (Render uses the Environment Variable 'MONGO_URI')
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/labconnect')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
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

app.get('/api/verify-session/:id', async (req, res) => {
  const session = await Session.findOne({ sessionId: req.params.id });
  if (session) {
    res.json({ valid: true });
  } else {
    res.status(404).json({ valid: false });
  }
});

app.get('/', (req, res) => {
    res.send("LabConnect Server is Running");
});

// Chat Logic
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data.room);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});