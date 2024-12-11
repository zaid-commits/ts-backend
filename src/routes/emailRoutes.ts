import express from 'express';
import { subscribe, getEmails } from '../controllers/emailController';

const router = express.Router();

// Add error handling middleware
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/subscribe', asyncHandler(subscribe));
router.get('/emails', asyncHandler(getEmails));

export default router;