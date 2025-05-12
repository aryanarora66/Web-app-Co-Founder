import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const role = url.searchParams.get('role');
    
    const query = role ? { role } : { role: { $in: ['founder', 'cofounder'] } };
    
    const users = await User.find(query)
      .select('-password') // Don't send back passwords
      .lean();
    
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}