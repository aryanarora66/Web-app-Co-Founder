// app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ 
        message: "Verification token is required" 
      }, { status: 400 });
    }

    // Find user with the verification token
    const user = await UserModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ 
        message: "Invalid or expired verification token" 
      }, { status: 400 });
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Generate JWT token now that email is verified
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Create response
    const response = NextResponse.json({ 
      message: "Email verified successfully! You can now log in.",
      user: { 
        id: user._id, 
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      },
      verified: true
    }, { status: 200 });

    // Set HTTP-only cookie
    response.cookies.set("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;

  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ 
      message: "Internal server error" 
    }, { status: 500 });
  }
}

// Also handle POST requests for programmatic verification
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ 
        message: "Verification token is required" 
      }, { status: 400 });
    }

    // Find user with the verification token
    const user = await UserModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ 
        message: "Invalid or expired verification token" 
      }, { status: 400 });
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Create response
    const response = NextResponse.json({ 
      message: "Email verified successfully!",
      user: { 
        id: user._id, 
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      },
      verified: true
    }, { status: 200 });

    // Set HTTP-only cookie
    response.cookies.set("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;

  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ 
      message: "Internal server error" 
    }, { status: 500 });
  }
}