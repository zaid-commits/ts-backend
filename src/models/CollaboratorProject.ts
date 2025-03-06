import mongoose from 'mongoose';

const collaboratorProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: { type: [String], required: true },
  contactEmail: { type: String, required: true },
  postedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('CollaboratorProject', collaboratorProjectSchema);