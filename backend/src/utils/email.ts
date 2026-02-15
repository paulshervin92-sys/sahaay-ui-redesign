import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
}

export async function sendEventReminder({ to, subject, text }: EmailOptions) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('Failed to send email:', err);
    }
}
