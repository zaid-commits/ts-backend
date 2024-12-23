import { Router, Request, Response } from 'express';
import Resource from '../models/Resource';

const router = Router();

// Get all resources
router.get('/', async (_req: Request, res: Response) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Add a new resource
router.post('/', async (req: Request, res: Response) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add resource' });
  }
});

export default router;