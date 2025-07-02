// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ 
        message: "Token and new password are required" 
      }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ 
        message: "Password must be at least 6 characters long" 
      }, { status: 400 });
    }

    // Find user with the reset token
    const user = await UserModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ 
        message: "Invalid or expired password reset token" 
      }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.lastActive = new Date();
    await user.save();

    // Generate JWT token for automatic login
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Create response
    const response = NextResponse.json({ 
      message: "Password reset successful! You are now logged in.",
      user: { 
        id: user._id, 
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      },
      passwordReset: true
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
    console.error("Reset password error:", error);
    return NextResponse.json({ 
      message: "Internal server error" 
    }, { status: 500 });
  }
}