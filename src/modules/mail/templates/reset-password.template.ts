// templates/reset-password.template.ts
export const resetPasswordTemplate = (userName: string, resetLink: string) => {
    return {
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FF5722; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              background: #FF5722; 
              color: white !important; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>We received a request to reset your password. Click the button below to proceed:</p>
              <p style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> This link expires in 1 hour.
              </div>
              <p style="font-size: 12px; color: #666;">
                Or copy this link: <a href="${resetLink}">${resetLink}</a>
              </p>
            </div>
            <div class="footer">
              <p>If you didn't request this, please ignore this email.</p>
              <p>© 2025 Your Company</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  };