import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  elaboratedDescription: { type: String, required: true },
  postedBy: { type: String, required: true },
  codeLink: { type: String, required: true },
  tags: { type: [String], required: true },
  category: { type: String, required: true },
  coverImage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Project', projectSchema);
