import * as nodemailer from 'nodemailer';

export const mailTransport = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
