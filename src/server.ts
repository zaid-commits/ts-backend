import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';
import newsLetterRoutes from './routes/newsLetterRoutes';
import keepAliveRoutes from './routes/keep-alive';
import resourceRoutes from './routes/ResourceRoutes';
import collaboratorRoutes from './routes/CollaboratorRoutes';
import { setupSocketHandlers } from './socketHandlers';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Connect to Database
connectDB();

// CORS Configuration
const corsOptions = {
  origin: ['https://percept-ai.vercel.app', 'http://localhost:5173','https://perceptai.impic.tech'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/newsletter', newsLetterRoutes);
app.use('/keep-alive', keepAliveRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/collaborator', collaboratorRoutes); // Use the new route

// Project Schema
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  elaboratedDescription: String,
  postedBy: String,
  codeLink: String,
  tags: [String],
  category: String,
  coverImage: String,
  
  email:String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  techStack: [String],
});

const Project = mongoose.model('Project', projectSchema);

// ✅ Get All Projects
app.get('/api/projects', async (_req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// ✅ Get Project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// ✅ Submit New Project
app.post('/api/projects', async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    // Emit a notification to all connected clients
    io.emit('notification', {
      type: 'project',
      message: `New project submitted: ${newProject.title}`,
      timestamp: Date.now(),
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// Health check route
app.get('/', (_req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

app.get('/health', (_req, res) => res.send('API is running'));

// Error handling middleware
import { Request, Response, NextFunction } from 'express';

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err); // Log the error for debugging purposes
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Socket.IO connection
setupSocketHandlers(io);

// Listen on the port provided by Render
const PORT = process.env.PORT || 5000;

server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1); // Close server & exit process
});

export { app, server };