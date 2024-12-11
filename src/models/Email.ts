import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Email', EmailSchema);