// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel, { type IUser } from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const role = url.searchParams.get('role');
    
    const query: any = {};
    if (role) {
      query.role = role;
    }
    
    // Fetch all user data including profile fields
    const users = await UserModel.find(query)
      .select('-password') // Don't send passwords
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain objects
    
    // Log for debugging
    console.log(`Found ${users.length} users`);
    if (users.length > 0) {
      console.log('Sample user structure:', {
        _id: users[0]._id,
        name: users[0].name,
        username: users[0].username,
        skills: users[0].skills?.length || 0,
        profileImage: !!users[0].profileImage,
        bio: !!users[0].bio,
        socialLinks: users[0].socialLinks?.length || 0
      });
    }
    
    return NextResponse.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch users', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}