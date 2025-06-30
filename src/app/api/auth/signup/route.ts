// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel, { type IUser } from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { resend, generateVerificationToken, getVerificationExpiry, getVerificationUrl } from "@/lib/resend";
import { getEmailVerificationTemplate } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { 
      name, 
      email, 
      username, 
      password, 
      role,
      bio,
      website,
      location,
      instagramUrl,
      skills,
      lookingFor,
      socialLinks
    } = await req.json();

    // Validate required fields
    if (!email || !username || !password || !name || !role) {
      return NextResponse.json({ 
        message: "Missing required fields: email, username, password, name, and role are required" 
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username }] 
    });
    
    if (existingUser) {
      return NextResponse.json({ 
        message: "Email or username already taken" 
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const verificationToken = generateVerificationToken();
    const verificationExpiry = getVerificationExpiry();

    // Create new user with complete profile
    const newUser = new UserModel({
      // Basic auth info
      name,
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
      role,
      
      // Profile details
      bio: bio || "",
      description: bio || "",
      website: website || "",
      location: location || "",
      instagramUrl: instagramUrl || "",
      
      // Skills and looking for
      skills: skills || [],
      lookingFor: lookingFor || [],
      
      // Social links
      socialLinks: socialLinks || [],
      
      // Email verification
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpiry,
      
      // Default values
      isAvailable: true,
      lastActive: new Date()
    });

    await newUser.save();

    // Send verification email with detailed logging
    try {
      console.log("🔧 Starting email send process...");
      console.log("📧 To:", newUser.email);
      console.log("🔑 API Key exists:", !!process.env.RESEND_API_KEY);
      console.log("📨 From email:", process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev');
      
      const verificationUrl = getVerificationUrl(verificationToken);
      console.log("🔗 Verification URL:", verificationUrl);
      
      const emailTemplate = getEmailVerificationTemplate({
        name: newUser.name || newUser.username,
        verificationUrl
      });

      console.log("📝 Email template generated successfully");

      const emailResponse = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: newUser.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });

      console.log("✅ Email sent successfully!");
      console.log("📋 Resend response:", emailResponse);

    } catch (emailError) {
      console.error("❌ Failed to send verification email:");
      console.error("Error details:", emailError);
      console.error("Error type:", typeof emailError);
      console.error("Error message:", emailError instanceof Error ? emailError.message : 'Unknown error');
      
      // Don't fail the signup if email fails, but log the error
      // You might want to implement a retry mechanism here
    }

    // Don't generate JWT token yet - user needs to verify email first
    // Return success response
    return NextResponse.json({ 
      message: "Signup successful! Please check your email to verify your account before logging in.",
      user: { 
        id: newUser._id, 
        username: newUser.username,
        role: newUser.role,
        name: newUser.name,
        email: newUser.email,
        isEmailVerified: newUser.isEmailVerified
      },
      requiresEmailVerification: true
    }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ 
      message: "Internal server error" 
    }, { status: 500 });
  }
}