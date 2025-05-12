// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req: NextRequest) { // auth check -> user list 
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const role = url.searchParams.get('role');
    
    const query: any = {};
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query) // show user list 
      .select('-password')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
