import { Request, Response } from 'express';
import Email from '../models/Email';

export const subscribe = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    let existingEmail = await Email.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: 'Email already subscribed' });
    }
    const newEmail = new Email({ email });
    await newEmail.save();
    res.status(201).json({ msg: 'Email subscribed successfully' });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server error');
  }
};

export const getEmails = async (_req: Request, res: Response) => {
  try {
    const emails = await Email.find().sort({ subscribedAt: -1 });
    res.json(emails);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server error');
  }
};