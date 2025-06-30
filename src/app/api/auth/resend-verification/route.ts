// app/api/auth/resend-verification/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import { resend, generateVerificationToken, getVerificationExpiry, getVerificationUrl } from "@/lib/resend";
import { getEmailVerificationTemplate } from "@/lib/email-templates";

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

    if (!user) {
      return NextResponse.json({ 
        message: "User not found" 
      }, { status: 404 });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return NextResponse.json({ 
        message: "Email is already verified" 
      }, { status: 400 });
    }

    // Check if there's a recent verification email sent (rate limiting)
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    if (user.emailVerificationExpires && user.emailVerificationExpires > fiveMinutesAgo) {
      const timeLeft = Math.ceil((user.emailVerificationExpires.getTime() - fiveMinutesAgo.getTime()) / (1000 * 60));
      return NextResponse.json({ 
        message: `Please wait ${timeLeft} minutes before requesting another verification email.` 
      }, { status: 429 });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpiry = getVerificationExpiry();

    // Update user with new token
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpiry;
    await user.save();

    // Send verification email
    try {
      const verificationUrl = getVerificationUrl(verificationToken);
      const emailTemplate = getEmailVerificationTemplate({
        name: user.name || user.username,
        verificationUrl
      });

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });

      return NextResponse.json({ 
        message: "Verification email sent successfully! Please check your inbox." 
      }, { status: 200 });

    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return NextResponse.json({ 
        message: "Failed to send verification email. Please try again later." 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ 
      message: "Internal server error" 
    }, { status: 500 });
  }
}