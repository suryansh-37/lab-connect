import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentName: { type: String, required: true },
  fileName: { type: String, required: true },
  fileData: { type: String }, // Base64 or URL
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Submission = mongoose.model('Submission', submissionSchema);
