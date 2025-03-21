import express from "express";
import Project from "../models/Project";
const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET single project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new project
router.post("/", async (req, res) => {
  try {
    const { title, description, elaboratedDescription, postedBy, email, collaboratorEmail, codeLink, tags, category, coverImage, techStack } = req.body;
    const newProject = new Project({
      title,
      description,
      elaboratedDescription,
      postedBy,
      email,
      collaboratorEmail,
      codeLink,
      tags,
      category,
      coverImage,
      techStack,
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});

export default router;
