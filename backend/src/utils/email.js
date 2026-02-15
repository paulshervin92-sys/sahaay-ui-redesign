// backend/src/utils/email.js
import nodemailer from 'nodemailer';

// Configure your SMTP or service here
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use your SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEventReminder({ to, subject, text }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  await transporter.sendMail(mailOptions);
}
