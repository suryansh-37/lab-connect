import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  className: { type: String, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String },
  fileSize: { type: String },
  fileData: { type: String },
  uploadedBy: { type: String, default: 'Instructor' }
}, { timestamps: true });

export const Assignment = mongoose.model('Assignment', assignmentSchema);
