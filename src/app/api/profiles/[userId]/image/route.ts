// src/app/api/users/[userId]/image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import UserModel from '@/models/User';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    // Verify authentication
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    if (!decoded || decoded.id !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Parse form data
    const data = await request.formData();
    const file: File | null = data.get('image') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size too large (max 5MB)' }, { status: 400 });
    }

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `profile_${params.userId}_${timestamp}${fileExtension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const filePath = path.join(uploadsDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create public URL
    const imageUrl = `/uploads/profiles/${fileName}`;

    // Update user's profile image in database
    const updatedUser = await UserModel.findByIdAndUpdate(
      params.userId,
      { 
        profileImage: imageUrl,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Profile image updated:', imageUrl);

    return NextResponse.json({
      success: true,
      data: { imageUrl },
      message: 'Profile image uploaded successfully'
    });

  } catch (error) {
    console.error('Image upload error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}