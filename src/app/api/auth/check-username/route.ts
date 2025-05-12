import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) return NextResponse.json({ available: false });

    const existingUser = await User.findOne({ username });
    return NextResponse.json({ available: !existingUser });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json({ available: false }, { status: 500 });
  }
}