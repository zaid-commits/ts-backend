import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  imageUrl: { type: String, required: true },
  demoUrl: { type: String, required: true },
  codeUrl: { type: String, required: true },
  tags: { type: [String], required: true }
});

export default mongoose.model('Project', projectSchema);