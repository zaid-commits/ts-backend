import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  githubLink: { type: String, required: true },
  skills: { type: [String], required: true },
  message: { type: String, required: true },
  applicantEmail: { type: String, required: true },
});

const collaboratorProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: { type: [String], required: true },
  contactEmail: { type: String, required: true },
  postedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  applications: [applicationSchema], // New field for applications
});

export default mongoose.model('CollaboratorProject', collaboratorProjectSchema);