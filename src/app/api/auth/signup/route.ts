import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel, { type IUser } from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    // Check if user already exists
    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json({ message: "Email or username already taken" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with complete profile
    const newUser = new UserModel({
      // Basic auth info
      name,
      email,
      username,
      password: hashedPassword,
      role,
      
      // Profile details
      bio: bio || "",
      description: bio || "", // Keep for backward compatibility
      website: website || "",
      location: location || "",
      instagramUrl: instagramUrl || "",
      
      // Skills and looking for
      skills: skills || [],
      lookingFor: lookingFor || [],
      
      // Social links
      socialLinks: socialLinks || [],
      
      // Default values
      isAvailable: true,
      lastActive: new Date()
    });

    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json({ 
      message: "Signup successful", 
      user: { 
        id: newUser._id, 
        username: newUser.username,
        role: newUser.role,
        name: newUser.name 
      } 
    }, { status: 201 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}