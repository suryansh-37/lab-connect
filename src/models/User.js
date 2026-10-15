import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['Student', 'Teacher'] },
  // Student Profile Data
  courses: { type: Array, default: [] },
  credits: { type: Number, default: 0 },
  totalCreditsGoal: { type: Number, default: 120 },
  classRank: { type: Number, default: 0 },
  totalStudents: { type: Number, default: 450 },
  weeklyStudyProgress: { type: Number, default: 0 },
  weeklyStudyGoal: { type: Number, default: 25 },
  // Teacher Profile Data
  classes: { type: Array, default: [] },
  assignmentsToGrade: { type: Number, default: 0 },
  classesTodayCount: { type: Number, default: 0 },
  nextClass: { type: String, default: "" },
  avgAttendance: { type: Number, default: 0 },
  avgClassGrade: { type: String, default: "" },
  activeStudentsCount: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.pre('save', function(next) {
  if (!this.name && this.fullName) {
    this.name = this.fullName;
  }
  next();
});

export const User = mongoose.model('User', userSchema);
