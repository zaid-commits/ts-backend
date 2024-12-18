import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import newsLetterRoutes from './routes/newsLetterRoutes';
import keepAliveRoutes from './routes/keep-alive';
import { setupSocketHandlers } from './socketHandlers';
import Project from './models/Project'; 

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://percept-ai.vercel.app','http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to Database
connectDB();

// CORS Configuration
const corsOptions = {
  origin: ['https://percept-ai.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/newsletter', newsLetterRoutes);
app.use('/keep-alive', keepAliveRoutes);

// Project Routes
app.post('/api/projects', async (req: Request, res: Response) => {
  try {
    const project = new Project(req.body);
    await project.save();

    // Emit a notification to all connected clients
    io.emit('notification', {
      type: 'project',
      message: `New project submitted: ${project.title}`,
      timestamp: Date.now(),
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add project' });
  }
});

app.get('/api/projects', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
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
process.on('unhandledRejection', (err: Error) => {
  console.log('Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

export { app, server };