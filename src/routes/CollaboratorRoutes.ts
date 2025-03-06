import express from 'express';
import CollaboratorProject from '../models/CollaboratorProject';
const router = express.Router();

// GET a specific collaborator project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await CollaboratorProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

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

// POST an application to a collaborator project
router.post('/:id/apply', async (req, res) => {
  try {
    const { id } = req.params;
    const { githubLink, skills, message, applicantEmail } = req.body;

    const project = await CollaboratorProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Assuming you want to store applications in the project document
    project.applications = project.applications || [];
    project.applications.push({ githubLink, skills, message, applicantEmail });

    await project.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

export default router;