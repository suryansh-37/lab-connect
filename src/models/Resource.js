import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  classGroup: { type: String, default: 'General' },
  uploadedBy: { type: String, required: true }
}, { timestamps: true });

export const Resource = mongoose.model('Resource', resourceSchema);
