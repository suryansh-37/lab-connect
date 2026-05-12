import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  classGroup: { type: String, default: 'General' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  link: { type: String, required: true },
  otp: { type: String, required: true },
  isTempChat: { type: Boolean, default: false }
}, { timestamps: true });

export const Session = mongoose.model('Session', sessionSchema);
