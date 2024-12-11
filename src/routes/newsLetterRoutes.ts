import express from 'express';
import Email from '../models/Email';
import { subscribe } from '../controllers/emailController';
import { sendNewsletter } from '../controllers/newsLetterController';

const router = express.Router();

const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Add the subscribe endpoint
router.post('/subscribe', asyncHandler(subscribe));
router.post('/send', asyncHandler(sendNewsletter));
router.get('/emails', asyncHandler(async (req: express.Request, res: express.Response) => {
  const emails = await Email.find().sort({ subscribedAt: -1 });
  res.json(emails);
}));

export default router;