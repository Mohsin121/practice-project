// templates/welcome.template.ts
export const welcomeEmailTemplate = (userName: string) => {
    return {
      subject: `Welcome ${userName}! Activate your account`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              background: #4CAF50; 
              color: white !important; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Our Platform!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>Thank you for joining us! We're excited to have you on board.</p>
            </div>
            <div class="footer">
              <p>© 2025 Your Company. All rights reserved.</p>
              <p>If you didn't sign up, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  };