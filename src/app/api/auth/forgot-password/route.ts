// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import { resend, generatePasswordResetToken, getPasswordResetExpiry, getPasswordResetUrl } from "@/lib/resend";
import { getPasswordResetTemplate } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ 
        message: "Email is required" 
      }, { status: 400 });
    }

    // Find user by email
    const user = await UserModel.findOne({ 
      email: email.toLowerCase() 
    });

    // Always return success to prevent email enumeration attacks
    const successMessage = "If an account with that email exists, we've sent a password reset link.";

    if (!user) {
      // Don't reveal that user doesn't exist for security
      return NextResponse.json({ 
        message: successMessage 
      }, { status: 200 });
    }

    // Check if there's a recent password reset request (rate limiting)
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    if (user.passwordResetExpires && user.passwordResetExpires > fiveMinutesAgo) {
      const timeLeft = Math.ceil((user.passwordResetExpires.getTime() - fiveMinutesAgo.getTime()) / (1000 * 60));
      return NextResponse.json({ 
        message: `Please wait ${timeLeft} minutes before requesting another password reset.` 
      }, { status: 429 });
    }

    // Generate password reset token
    const resetToken = generatePasswordResetToken();
    const resetExpiry = getPasswordResetExpiry();

    // Update user with reset token
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpiry;
    await user.save();

    // Send password reset email
    try {
      const resetUrl = getPasswordResetUrl(resetToken);
      const emailTemplate = getPasswordResetTemplate({
        name: user.name || user.username,
        resetUrl
      });

      // For development: Override recipient email if using free tier
      const recipientEmail = process.env.NODE_ENV === 'development' 
        ? (process.env.RESEND_ACCOUNT_EMAIL || user.email)
        : user.email;

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: recipientEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });

      console.log(`Password reset email sent to ${recipientEmail} (original: ${user.email})`);

      return NextResponse.json({ 
        message: successMessage 
      }, { status: 200 });

    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      
      // Clear the reset token if email fails
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      
      return NextResponse.json({ 
        message: "Failed to send password reset email. Please try again later." 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ 
      message: "Internal server error" 
    }, { status: 500 });
  }
}