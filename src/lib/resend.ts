// lib/resend.ts
import { Resend } from 'resend';
import crypto from 'crypto';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email verification utilities
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function getVerificationExpiry(): Date {
  // Token expires in 24 hours
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
}

export function getVerificationUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/verify-email?token=${token}`;
}

// Password reset utilities
export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function getPasswordResetExpiry(): Date {
  // Token expires in 1 hour for security
  return new Date(Date.now() + 60 * 60 * 1000);
}

export function getPasswordResetUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/reset-password?token=${token}`;
}