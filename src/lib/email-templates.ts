// lib/email-templates.ts

interface EmailVerificationProps {
  name: string;
  verificationUrl: string;
}

interface PasswordResetProps {
  name: string;
  resetUrl: string;
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
      The Your App Name Team
    `
  };
}

export function getPasswordResetTemplate({ name, resetUrl }: PasswordResetProps) {
  return {
    subject: 'Reset your password',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
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
            color: #dc2626;
            margin-bottom: 10px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #dc2626;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #b91c1c;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 14px;
            color: #666;
          }
          .warning {
            background-color: #fee2e2;
            border: 1px solid #ef4444;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
          .security-notice {
            background-color: #f0f9ff;
            border: 1px solid #0ea5e9;
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
            <div class="logo">🔒 Password Reset</div>
            <h1>Reset Your Password</h1>
          </div>
          
          <p>Hi ${name},</p>
          
          <p>We received a request to reset your password. If you made this request, click the button below to set a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace;">
            ${resetUrl}
          </p>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> This password reset link will expire in 1 hour for security reasons.
          </div>
          
          <div class="security-notice">
            <strong>🛡️ Security Notice:</strong><br>
            • If you didn't request this password reset, please ignore this email<br>
            • Your password will remain unchanged<br>
            • Consider changing your password if you suspect unauthorized access
            • Never share your password reset link with others
          </div>
          
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
          
          <div class="footer">
            <p>Best regards,<br>The Your App Name Team</p>
            <p style="font-size: 12px; color: #999;">
              This is an automated email. Please do not reply to this message.<br>
              If you have concerns about your account security, please contact our support team.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${name},

      We received a request to reset your password. If you made this request, visit this link to set a new password:

      ${resetUrl}

      This password reset link will expire in 1 hour for security reasons.

      If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.

      Best regards,
      The Your App Name Team
    `
  };
}