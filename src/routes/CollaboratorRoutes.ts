import express from 'express';
import CollaboratorProject from '../models/CollaboratorProject';
const router = express.Router();

// POST a new collaborator project
router.post('/', async (req, res) => {
  try {
    const { title, description, requiredSkills, contactEmail, postedBy } = req.body;
    const newProject = new CollaboratorProject({
      title,
      description,
      requiredSkills: requiredSkills.split(',').map((skill: string) => skill.trim()),
      contactEmail,
      postedBy,
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// GET all collaborator projects
router.get('/', async (req, res) => {
  try {
    const projects = await CollaboratorProject.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;