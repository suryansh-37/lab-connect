import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  sender: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, required: true },
  file: { type: String },
  fileSize: { type: String },
  fileData: { type: String },
  isSystem: { type: Boolean, default: false }
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema);
