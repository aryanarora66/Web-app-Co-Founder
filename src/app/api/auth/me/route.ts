// api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Get the token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Fetch user data - handle both id and _id cases
    let user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Convert _id to id for consistency
    const userResponse = {
      id: user._id.toString(), // Ensure id is always available
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      description: user.description,
      skills: user.skills,
      lookingFor: user.lookingFor,
      demoVideos: user.demoVideos,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    console.log('Auth/me returning user:', userResponse); // Debug log

    return NextResponse.json({ user: userResponse }, { status: 200 });
  } catch (error) {
    console.error("Me API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}