import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('ChatMessage', ChatMessageSchema);