// app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    
    // Await the params object
    const { userId } = await context.params;
    
    console.log('Fetching user with ID:', userId);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find user by ID, excluding password
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    
    const { userId } = await context.params;
    const updateData = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Remove sensitive fields that shouldn't be updated via this route
    const { password, email, ...safeUpdateData } = updateData;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      safeUpdateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}