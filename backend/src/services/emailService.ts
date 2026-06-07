import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendResetEmail(toEmail: string, resetToken: string) {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"AI Chatbot" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Reset your password</h2>
        <p>Click the button below to reset your password. Link expires in <b>15 minutes</b>.</p>
        <a href="${resetLink}" 
           style="display:inline-block; margin-top:16px; padding:12px 24px; 
                  background:#7c3aed; color:#fff; border-radius:8px; text-decoration:none;">
          Reset Password
        </a>
        <p style="margin-top:16px; color:#888; font-size:13px;">
          If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });
}