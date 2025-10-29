import { Injectable } from '@nestjs/common';
import { mailTransport } from './mailer.config';
import * as nodemailer from 'nodemailer';
import { welcomeEmailTemplate } from './templates/welome.template';
import { resetPasswordTemplate } from './templates/reset-password.template';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = mailTransport;
  }

  async sendEmail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: `"MyApp" <noreply@myapp.com>`,
      to,
      subject,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('🎉 Email sent successfully');
      return info;
    } catch (err) {
      console.error('❌ Error sending mail:', err);
      throw err;
    }
  }

  async sendWelcomeEmail(to: string, userName: string) {
    const { subject, html } = welcomeEmailTemplate(userName);
    return this.sendEmail(to, subject, html);
  }

  async sendPasswordResetEmail(to: string, userName: string, resetLink: string) {
    const { subject, html } = resetPasswordTemplate(userName, resetLink);
    return this.sendEmail(to, subject, html);
  }

}
