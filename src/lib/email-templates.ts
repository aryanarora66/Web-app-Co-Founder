// lib/email-templates.ts

interface EmailVerificationProps {
    name: string;
    verificationUrl: string;
  }
  
  export function getEmailVerificationTemplate({ name, verificationUrl }: EmailVerificationProps) {
    return {
      subject: 'Verify your email address',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              padding: 30px;
              border-radius: 8px;
              border: 1px solid #ddd;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #1d4ed8;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 14px;
              color: #666;
            }
            .warning {
              background-color: #fef3c7;
              border: 1px solid #fbbf24;
              border-radius: 4px;
              padding: 15px;
              margin: 20px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Your App Name</div>
              <h1>Welcome to our platform!</h1>
            </div>
            
            <p>Hi ${name},</p>
            
            <p>Thank you for signing up! To complete your registration and start using our platform, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace;">
              ${verificationUrl}
            </p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> This verification link will expire in 24 hours for security reasons.
            </div>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <div class="footer">
              <p>Best regards,<br>The Your App Name Team</p>
              <p style="font-size: 12px; color: #999;">
                This is an automated email. Please do not reply to this message.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hi ${name},
  
        Thank you for signing up! To complete your registration, please verify your email address by visiting this link:
  
        ${verificationUrl}
  
        This verification link will expire in 24 hours for security reasons.
  
        If you didn't create an account with us, please ignore this email.
  
        Best regards,
        Netlify
      `
    };
  }