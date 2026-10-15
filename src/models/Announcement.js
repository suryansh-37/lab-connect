import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  text: { type: String, required: true },
  className: { type: String, required: true },
  author: { type: String, default: 'Instructor' },
  avatarColor: { type: String, default: '#0284c7' }
}, { timestamps: true });

export const Announcement = mongoose.model('Announcement', announcementSchema);
