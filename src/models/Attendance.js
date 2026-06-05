import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: true
  },
  records: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: true
    }
  }]
}, { timestamps: true });

// Avoid duplicate records for the same class on the same day
attendanceSchema.index({ classId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
