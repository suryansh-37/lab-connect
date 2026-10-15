import mongoose from 'mongoose';

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const generateJoinCode = () => {
  let code = '';

  for (let i = 0; i < 6; i += 1) {
    code += ALPHANUMERIC.charAt(Math.floor(Math.random() * ALPHANUMERIC.length));
  }

  return code;
};

const classSchema = new mongoose.Schema({
  courseName: { type: String, required: true, trim: true },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  joinCode: {
    type: String,
    unique: true,
    required: true,
    default: generateJoinCode,
    uppercase: true,
    trim: true,
    match: /^[A-Z0-9]{6}$/
  },
  enrolledStudents: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: []
  }
}, { timestamps: true });

export const Class = mongoose.model('Class', classSchema);
