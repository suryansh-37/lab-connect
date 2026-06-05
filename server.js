import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './src/models/User.js';
import { Resource } from './src/models/Resource.js';
import { Session } from './src/models/Session.js';
import { Message } from './src/models/Message.js';
import { Assignment } from './src/models/Assignment.js';
import { Submission } from './src/models/Submission.js';
import { Class } from './src/models/Class.js';
import { Attendance } from './src/models/Attendance.js';
import { Announcement } from './src/models/Announcement.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // Allow local dev hosts and any vercel.app subdomain
        if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('vercel.app')) {
            return callback(null, true);
        }

        return callback(new Error('CORS Policy: Origin not allowed'), false);
    },
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

const seedDemoUsers = async () => {
    try {
        const studentExists = await User.findOne({ email: 'alexander@example.com' });
        if (!studentExists) {
            const studentPassword = await bcrypt.hash('password123', 10);
            const demoStudent = new User({
                fullName: 'Alexander Student',
                email: 'alexander@example.com',
                password: studentPassword,
                role: 'Student',
                courses: [
                    { id: 1, title: 'Advanced Physics', code: 'Dr. Aris Thorne • Room 402', session: '04', progress: 65, status: 'A- GRADE', iconType: 'target', banner: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600' },
                    { id: 2, title: 'Modernist Poetry', code: 'Prof. Elena Vance • Online', session: '02', progress: 42, status: 'B+ GRADE', iconType: 'book', banner: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=600' }
                ],
                credits: 94,
                totalCreditsGoal: 120,
                classRank: 12,
                totalStudents: 450,
                weeklyStudyProgress: 18.5,
                weeklyStudyGoal: 25
            });
            await demoStudent.save();
            console.log('✅ Demo student seeded');
        }

        const teacherExists = await User.findOne({ email: 'jenkins@example.com' });
        if (!teacherExists) {
            const teacherPassword = await bcrypt.hash('password123', 10);
            const demoTeacher = new User({
                fullName: 'Professor Jenkins',
                email: 'jenkins@example.com',
                password: teacherPassword,
                role: 'Teacher',
                classes: [
                    { id: 1, title: 'Cell Theory: Biol 101', code: 'BIOL 101', session: '04', iconType: 'beaker', progress: 75, banner: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=600' },
                    { id: 2, title: 'Visual Hierarchy Essay', code: 'DS II', session: '02', iconType: 'book', progress: 60, banner: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600' }
                ],
                assignmentsToGrade: 12,
                classesTodayCount: 3,
                nextClass: 'Bio 101',
                avgAttendance: 94.2,
                avgClassGrade: 'B+',
                activeStudentsCount: 165
            });
            await demoTeacher.save();
            console.log('✅ Demo teacher seeded');
        }
    } catch (err) {
        console.error('❌ Error seeding demo users:', err);
    }
};

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log("✅ SUCCESS: Successfully connected to MongoDB Database!");
        await seedDemoUsers();
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

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });

        return res.status(200).json({ message: "Login actively verified!", token, user: { fullName: user.fullName, email: user.email, role: user.role } });
    } catch (err) {
        return res.status(500).json({ message: "Server error at login phase." });
    }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: "Access token required" });
    
    jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
        req.user = user;
        next();
    });
};

app.get('/api/users/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        return res.status(200).json({
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            courses: user.courses || [],
            credits: user.credits || 0,
            totalCreditsGoal: user.totalCreditsGoal || 120,
            classRank: user.classRank || 0,
            totalStudents: user.totalStudents || 450,
            weeklyStudyProgress: user.weeklyStudyProgress || 0,
            weeklyStudyGoal: user.weeklyStudyGoal || 25,
            classes: user.classes || [],
            assignmentsToGrade: user.assignmentsToGrade || 0,
            classesTodayCount: user.classesTodayCount || 0,
            nextClass: user.nextClass || "",
            avgAttendance: user.avgAttendance || 0,
            avgClassGrade: user.avgClassGrade || "",
            activeStudentsCount: user.activeStudentsCount || 0,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error retrieving profile." });
    }
});

// ==========================================
// 🏫 CLASS / COURSE ROUTES
// ==========================================

app.post('/api/classes/create', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'Teacher') {
            return res.status(403).json({ message: "Only teachers can create classes." });
        }
        const { courseName } = req.body;
        if (!courseName) {
            return res.status(400).json({ message: "Course name is required." });
        }

        const newClass = new Class({
            courseName,
            teacherId: req.user.id
        });
        await newClass.save();
        return res.status(201).json(newClass);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.post('/api/classes/join', authenticateToken, async (req, res) => {
    try {
        // Fetch user from DB to verify role case-insensitively and securely fallback
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        const role = user.role || req.user.role;
        if (!role || role.toLowerCase() !== 'student') {
            return res.status(403).json({ message: "Only students can join classes." });
        }

        const { joinCode } = req.body;
        if (!joinCode) {
            return res.status(400).json({ message: "Join code is required." });
        }

        const targetClass = await Class.findOne({ joinCode: joinCode.toUpperCase().trim() });
        if (!targetClass) {
            return res.status(404).json({ message: "Class not found with the provided join code." });
        }

        // Check if student is already enrolled (comparing object ID strings safely)
        const isAlreadyEnrolled = targetClass.enrolledStudents.some(
            (studentId) => studentId.toString() === user._id.toString()
        );

        if (isAlreadyEnrolled) {
            return res.status(400).json({ message: "You are already enrolled in this class." });
        }

        // Push student's mongoose ObjectId instead of raw string
        targetClass.enrolledStudents.push(user._id);
        await targetClass.save();

        return res.status(200).json(targetClass);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.get('/api/classes/me', authenticateToken, async (req, res) => {
    try {
        let classes = [];
        if (req.user.role === 'Teacher') {
            classes = await Class.find({ teacherId: req.user.id })
                .populate('teacherId', 'fullName name email')
                .populate('enrolledStudents', 'fullName name email');
        } else if (req.user.role === 'Student') {
            classes = await Class.find({ enrolledStudents: req.user.id })
                .populate('teacherId', 'fullName name email')
                .populate('enrolledStudents', 'fullName name email');
        } else {
            return res.status(400).json({ message: "Invalid user role." });
        }
        return res.status(200).json(classes);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.get('/api/classes/:classId', authenticateToken, async (req, res) => {
    try {
        const cls = await Class.findById(req.params.classId)
            .populate('teacherId', 'fullName name email')
            .populate('enrolledStudents', 'name email');
        if (!cls) return res.status(404).json({ message: "Class not found." });
        return res.status(200).json(cls);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.post('/api/classes/:classId/remove-student', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'Teacher') {
            return res.status(403).json({ message: "Only teachers can remove students from classes." });
        }
        const { classId } = req.params;
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required." });
        }

        const targetClass = await Class.findById(classId);
        if (!targetClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Pull the student from enrolledStudents array
        targetClass.enrolledStudents = targetClass.enrolledStudents.filter(
            (id) => id.toString() !== studentId.toString()
        );
        await targetClass.save();

        // Retrieve populated updated class to return to frontend
        const updatedClass = await Class.findById(classId)
            .populate('teacherId', 'fullName name email')
            .populate('enrolledStudents', 'fullName name email');

        return res.status(200).json(updatedClass);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 📅 CLASS ATTENDANCE & STATS ROUTES
// ==========================================

app.post('/api/classes/:classId/attendance', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'Teacher') {
            return res.status(403).json({ message: "Only teachers can record attendance." });
        }
        const { classId } = req.params;
        const { date, records } = req.body;

        if (!date || !records || !Array.isArray(records)) {
            return res.status(400).json({ message: "Date and records array are required." });
        }

        const attendance = await Attendance.findOneAndUpdate(
            { classId, date },
            { records },
            { upsert: true, new: true }
        );
        return res.status(200).json(attendance);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.get('/api/classes/:classId/stats', authenticateToken, async (req, res) => {
    try {
        const { classId } = req.params;
        const cls = await Class.findById(classId);
        if (!cls) return res.status(404).json({ message: "Class not found." });

        const attendanceDocs = await Attendance.find({ classId });
        const assignments = await Assignment.find({ className: cls.courseName });
        const assignmentIds = assignments.map(a => a._id);
        const submissions = await Submission.find({ assignmentId: { $in: assignmentIds } });

        const populatedClass = await Class.findById(classId).populate('enrolledStudents', 'fullName name email');
        const students = populatedClass.enrolledStudents || [];

        const studentStats = students.map(student => {
            const studentIdStr = student._id.toString();

            // 1. Attendance Rate Calculation
            const totalSessions = attendanceDocs.length;
            let presentSessions = 0;
            attendanceDocs.forEach(doc => {
                const record = doc.records.find(r => r.studentId.toString() === studentIdStr);
                if (record && record.status === 'present') {
                    presentSessions++;
                }
            });
            const attendanceRate = totalSessions > 0 ? (presentSessions / totalSessions) * 100 : null;

            // 2. Average Grade Calculation
            const studentSubmissions = submissions.filter(s => s.studentId && s.studentId.toString() === studentIdStr);
            let sumScores = 0;
            let totalMaxPoints = 0;

            studentSubmissions.forEach(sub => {
                const assignment = assignments.find(a => a._id.toString() === sub.assignmentId.toString());
                if (assignment && sub.score !== undefined && sub.score !== null) {
                    sumScores += sub.score;
                    totalMaxPoints += (assignment.points || 100);
                }
            });
            const avgGrade = totalMaxPoints > 0 ? (sumScores / totalMaxPoints) * 100 : null;

            return {
                studentId: student._id,
                fullName: student.fullName || student.name,
                email: student.email,
                attendanceRate: attendanceRate !== null ? Number(attendanceRate.toFixed(1)) : null,
                avgGrade: avgGrade !== null ? Number(avgGrade.toFixed(1)) : null
            };
        });

        // 3. Class Level Stats (Velocity, average attendance, average grade)
        let assignmentVelocity = null;
        if (assignments.length > 0) {
            const sortedAssignments = [...assignments].sort((a, b) => b.createdAt - a.createdAt);
            const mostRecent = sortedAssignments[0];
            const submissionsForRecent = submissions.filter(s => s.assignmentId.toString() === mostRecent._id.toString());

            const enrolledCount = students.length;
            assignmentVelocity = enrolledCount > 0 ? (submissionsForRecent.length / enrolledCount) * 100 : 0;
            assignmentVelocity = Number(assignmentVelocity.toFixed(1));
        }

        const gradedStudents = studentStats.filter(s => s.avgGrade !== null);
        const classAverageGrade = gradedStudents.length > 0
            ? Number((gradedStudents.reduce((sum, s) => sum + s.avgGrade, 0) / gradedStudents.length).toFixed(1))
            : null;

        const attendedStudents = studentStats.filter(s => s.attendanceRate !== null);
        const classAverageAttendance = attendedStudents.length > 0
            ? Number((attendedStudents.reduce((sum, s) => sum + s.attendanceRate, 0) / attendedStudents.length).toFixed(1))
            : null;

        return res.status(200).json({
            studentStats,
            classStats: {
                classAverageGrade: classAverageGrade !== null ? classAverageGrade : 'N/A',
                classAverageAttendance: classAverageAttendance !== null ? classAverageAttendance : 'N/A',
                assignmentVelocity: assignmentVelocity !== null ? assignmentVelocity : 'N/A'
            }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
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

app.get('/api/assignments/class/:classId', authenticateToken, async (req, res) => {
    try {
        const assignments = await Assignment.find({ classId: req.params.classId })
            .populate('submissions.studentId', 'fullName name email')
            .sort({ createdAt: -1 });
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/assignments', async (req, res) => {
    try {
        const newAssignment = new Assignment(req.body);
        await newAssignment.save();
        res.status(201).json(newAssignment);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/assignments/create', async (req, res) => {
    try {
        const newAssignment = new Assignment(req.body);
        await newAssignment.save();
        res.status(201).json(newAssignment);
    } catch (err) {
        console.error('Create assignment error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/classes/:classId/assignments', authenticateToken, async (req, res) => {
    try {
        const assignments = await Assignment.find({ classId: req.params.classId })
            .populate('submissions.studentId', 'fullName name email')
            .sort({ createdAt: -1 });
        res.json(assignments);
    } catch (err) {
        console.error('Fetch class assignments error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/assignments/:assignmentId/submit', authenticateToken, async (req, res) => {
    try {
        const { fileUrl, fileName } = req.body;
        const studentId = req.user.id;

        if (!fileUrl) {
            return res.status(400).json({ message: "File URL/Data is required." });
        }

        const assignment = await Assignment.findById(req.params.assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found." });
        }

        // Fetch student user details to get their name
        const studentUser = await User.findById(studentId);
        const studentName = studentUser ? (studentUser.fullName || studentUser.name) : "Student";

        // Check if student already submitted in Assignment
        const existingIndex = assignment.submissions.findIndex(
            sub => sub.studentId.toString() === studentId.toString()
        );

        const newSubObj = {
            studentId,
            fileUrl,
            fileName: fileName || 'Submission.pdf',
            submittedAt: new Date()
        };

        if (existingIndex > -1) {
            assignment.submissions[existingIndex] = newSubObj;
        } else {
            assignment.submissions.push(newSubObj);
        }

        await assignment.save();

        // Sync to Submission model (upsert)
        await Submission.findOneAndUpdate(
            { assignmentId: assignment._id, studentId },
            {
                studentName,
                fileName: fileName || 'Submission.pdf',
                fileData: fileUrl,
                submittedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Populate studentId for the return payload
        const updatedAssignment = await Assignment.findById(assignment._id)
            .populate('submissions.studentId', 'fullName name email');

        res.status(200).json(updatedAssignment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/assignments/:id', async (req, res) => {
    try {
        await Assignment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Assignment deleted.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 📢 ANNOUNCEMENT ROUTES
// ==========================================

app.get('/api/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/announcements', async (req, res) => {
    try {
        const newAnnouncement = new Announcement(req.body);
        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/classes/:classId/announcements', authenticateToken, async (req, res) => {
    try {
        const { text } = req.body;
        const cls = await Class.findById(req.params.classId);
        if (!cls) return res.status(404).json({ message: "Class not found." });

        // Get user details for author
        const user = await User.findById(req.user.id);
        const authorName = user ? (user.fullName || user.name) : "Instructor";

        const newAnnouncement = new Announcement({
            text,
            className: cls.courseName,
            author: authorName,
            avatarColor: '#0284c7'
        });
        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (err) {
        console.error('Create announcement error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/announcements/:id', async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Announcement deleted.' });
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

        // Sync to Assignment
        const assignment = await Assignment.findById(req.body.assignmentId);
        if (assignment && req.body.studentId) {
            const existingIndex = assignment.submissions.findIndex(
                sub => sub.studentId.toString() === req.body.studentId.toString()
            );
            const subData = {
                studentId: req.body.studentId,
                fileUrl: req.body.fileData,
                fileName: req.body.fileName,
                submittedAt: newSubmission.submittedAt || new Date()
            };
            if (existingIndex > -1) {
                assignment.submissions[existingIndex] = subData;
            } else {
                assignment.submissions.push(subData);
            }
            await assignment.save();
        }

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
    } catch (err) { res.status(500).json({ error: err.message }); }
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
