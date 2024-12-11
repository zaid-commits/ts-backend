import { Request, Response } from 'express';
import sgMail from '@sendgrid/mail';
import Email from '../models/Email';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendNewsletter = async (req: Request, res: Response) => {
  try {
    const { subject, content, heading } = req.body;
    const emails = await Email.find().select('email');
    const emailList = emails.map(email => email.email);

    if (emailList.length === 0) {
      return res.status(400).json({ msg: 'No subscribers found' });
    }

    const msg = {
      to: emailList,
      from: 'engineering.zaidrakhange@gmail.com',
      subject: subject || 'Newsletter from PerceptAI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
          <h1 style="color: #BF40BF; text-align: center; margin-bottom: 20px;">${heading || 'Hello PerceptAI Community!'}</h1>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
            ${content || 'No content provided'}
          </div>
          <div style="margin-top: 20px; text-align: center; color: #666;">
            <p>Best regards,<br>The PerceptAI Team</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <small>You received this email because you're subscribed to PerceptAI updates.</small>
          </div>
        </div>
      `
    };

    await sgMail.sendMultiple(msg);
    res.status(200).json({ 
      msg: 'Newsletter sent successfully!',
      recipientCount: emailList.length 
    });
  } catch (err) {
    console.error('Error sending newsletter:', err);
    res.status(500).json({ 
      error: 'Failed to send newsletter',
      details: (err as Error).message 
    });
  }
};