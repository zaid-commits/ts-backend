import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSocketHandlers } from './socketHandlers';
import newsLetterRoutes from './routes/newsLetterRoutes';
import connectdb from './config/db';
import keepAliveRoutes from './routes/keep-alive';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL_DEV,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

//db connection
connectdb();

// CORS 
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL_DEV,
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

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'Server is running' });
});

// Error handling 
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 pg not found
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// socket handlesr
setupSocketHandlers(io);

// render port listener
const PORT = process.env.PORT || 5000;

server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

// unhandled promise rejection
process.on('unhandledRejection', (err: Error) => {
  console.log('Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

export { app, server };