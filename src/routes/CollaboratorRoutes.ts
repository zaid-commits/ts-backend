import express from 'express';
import CollaboratorProject from '../models/CollaboratorProject';
const router = express.Router();

// Get all collaborator projects
router.get('/', async (_req, res) => {
  try {
    const projects = await CollaboratorProject.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await CollaboratorProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new collaborator project
router.post('/', async (req, res) => {
  try {
    const { title, description, requiredSkills, contactEmail, postedBy } = req.body;

    if (!title || !description || !requiredSkills || !contactEmail || !postedBy) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newProject = new CollaboratorProject({
      title,
      description,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map((skill: string) => skill.trim()),
      contactEmail,
      postedBy
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Submit an application to a project
router.post('/:id/apply', async (req, res) => {
  try {
    const { githubLink, skills, message, applicantEmail } = req.body;
    
    if (!githubLink || !skills || !message || !applicantEmail) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const project = await CollaboratorProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.applications.push({
      githubLink,
      skills: Array.isArray(skills) ? skills : skills.split(',').map((skill: string) => skill.trim()),
      message,
      applicantEmail
    });

    await project.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

export default router;