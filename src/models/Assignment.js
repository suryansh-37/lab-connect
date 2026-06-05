import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  dueDate: { type: Date },
  submissions: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      fileUrl: { type: String, required: true },
      fileName: { type: String },
      submittedAt: { type: Date, default: Date.now }
    }
  ],
  className: { type: String, required: true },
  fileName: { type: String },
  fileType: { type: String },
  fileSize: { type: String },
  fileData: { type: String },
  uploadedBy: { type: String, default: 'Instructor' },
  points: { type: Number, default: 100 }
}, { timestamps: true });

export const Assignment = mongoose.model('Assignment', assignmentSchema);
