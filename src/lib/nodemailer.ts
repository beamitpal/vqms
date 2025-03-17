import nodemailer from 'nodemailer';
import { EmailOptions } from './types';
import { env } from './env';

const transporter = nodemailer.createTransport({
  host: env.NEXT_APP_EMAIL_HOST, 
  port: Number(env.NEXT_APP_EMAIL_PORT) || 587, 
  secure: env.NEXT_APP_EMAIL_SECURE, // true for 465, false for other ports
  auth: {
    user: env.NEXT_APP_EMAIL_USER,
    pass: env.NEXT_APP_EMAIL_PASS, 
  },
});


export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: env.NEXT_APP_EMAIL_FROM || from,
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}