import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { User } from './src/models/User.js';
import { Resource } from './src/models/Resource.js';
import { Session } from './src/models/Session.js';
import { Message } from './src/models/Message.js';
import { Assignment } from './src/models/Assignment.js';
import { Submission } from './src/models/Submission.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: [
        'https://lab-connect-chi.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is extremely missing from your .env file!");
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ SUCCESS: Successfully connected to MongoDB Database!");
    app.listen(PORT, () => console.log(`🚀 Backend Server is running efficiently on http://localhost:${PORT}`));
  })
  .catch((error) => console.error("❌ ERROR: Failed to connect!", error));

// ==========================================
// 🔐 AUTHENTICATION ROUTES (Simplified Login)
// ==========================================

app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "Account already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword, role });
        await newUser.save();
        
        return res.status(201).json({ message: "Registration absolute success!" });
    } catch (err) {
        return res.status(500).json({ message: "Server fault during registration." });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email, role });

        if (!user) return res.status(404).json({ message: "Account entirely not found." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

        // Direct Login Success!
        return res.status(200).json({ message: "Login actively verified!", user: { fullName: user.fullName, email: user.email, role: user.role } });
    } catch (err) {
        return res.status(500).json({ message: "Server error at login phase." });
    }
});

// ==========================================
// 📚 RESOURCE HUB ROUTES
// ==========================================

app.get('/api/resources', async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.json(resources);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/resources', async (req, res) => {
    try {
        const newResource = new Resource(req.body);
        await newResource.save();
        res.status(201).json(newResource);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 📝 ASSIGNMENT ROUTES
// ==========================================

app.get('/api/assignments', async (req, res) => {
    try {
        const assignments = await Assignment.find().sort({ createdAt: -1 });
        res.json(assignments);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/assignments', async (req, res) => {
    try {
        const newAssignment = new Assignment(req.body);
        await newAssignment.save();
        res.status(201).json(newAssignment);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/assignments/:id', async (req, res) => {
    try {
        await Assignment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Assignment deleted.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 📤 SUBMISSION ROUTES
// ==========================================

app.get('/api/submissions/:assignmentId', async (req, res) => {
    try {
        const submissions = await Submission.find({ assignmentId: req.params.assignmentId }).sort({ createdAt: -1 });
        res.json(submissions);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/submissions', async (req, res) => {
    try {
        const newSubmission = new Submission(req.body);
        await newSubmission.save();
        res.status(201).json(newSubmission);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 📅 SESSIONS & MEETINGS ROUTES
// ==========================================

app.get('/api/sessions', async (req, res) => {
    try {
        const sessions = await Session.find().sort({ createdAt: -1 });
        res.json(sessions);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/sessions', async (req, res) => {
    try {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        let sessionTitle = req.body.title;
        if (req.body.isTempChat) {
            sessionTitle = `${sessionTitle} [OTP: ${otpCode}]`;
        }

        const newSession = new Session({ ...req.body, title: sessionTitle, otp: otpCode });
        await newSession.save();
        res.status(201).json(newSession);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/sessions/join/:otp', async (req, res) => {
    try {
        const session = await Session.findOne({ otp: req.params.otp });
        if (!session) return res.status(404).json({ message: "Invalid or officially expired Session OTP code." });
        res.json(session);
    } catch(err) { res.status(500).json({ error: err.message }); }
});

// Check if a session is still alive by its title (roomId)
app.get('/api/sessions/status/:roomId', async (req, res) => {
    try {
        const session = await Session.findOne({ title: req.params.roomId });
        res.json({ active: !!session });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/sessions/:id', async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (session) {
            await Message.deleteMany({ roomId: session.title });
            // Clear presence data for this room
            if (roomPresence[session.title]) delete roomPresence[session.title];
            await Session.findByIdAndDelete(req.params.id);
        }
        res.json({ message: 'Session and associated temporary chat strictly wiped.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Terminate by room title (used from within GroupChat)
app.delete('/api/sessions/by-title/:title', async (req, res) => {
    try {
        const title = decodeURIComponent(req.params.title);
        const session = await Session.findOne({ title });
        if (session) {
            await Message.deleteMany({ roomId: title });
            if (roomPresence[title]) delete roomPresence[title];
            await Session.findByIdAndDelete(session._id);
        }
        res.json({ message: 'Session terminated and all data wiped.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 💬 CHAT MESSAGING ROUTES
// ==========================================

// Volatile local memory explicitly for GroupChat Presence
const roomPresence = {};

app.get('/api/messages/:roomId', async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const { sender, isTyping, isHost } = req.query;

        if (sender) {
            if (!roomPresence[roomId]) roomPresence[roomId] = {};
            roomPresence[roomId][sender] = {
                lastSeen: Date.now(),
                isTyping: isTyping === 'true',
                isHost: isHost === 'true'
            };
        }

        if (roomPresence[roomId]) {
            const now = Date.now();
            for (const key in roomPresence[roomId]) {
                if (now - roomPresence[roomId][key].lastSeen > 6000) {
                    delete roomPresence[roomId][key];
                }
            }
        }

        const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
        res.json({
            messages,
            members: roomPresence[roomId] || {}
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/messages', async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
