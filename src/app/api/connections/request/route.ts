// src/app/api/connections/request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Connection from '@/models/connection';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Get the token from cookies
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Parse request body
    const { recipientId, message } = await request.json();

    if (!recipientId) {
      return NextResponse.json({ error: 'Recipient ID is required' }, { status: 400 });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    // Prevent self-connection
    if (recipientId === decoded.id) {
      return NextResponse.json({ error: 'Cannot connect to yourself' }, { status: 400 });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requesterId: decoded.id, recipientId: recipientId },
        { requesterId: recipientId, recipientId: decoded.id }
      ]
    });

    if (existingConnection) {
      return NextResponse.json({ 
        error: 'Connection already exists or request already sent' 
      }, { status: 400 });
    }

    // Create new connection request
    const connection = new Connection({
      requesterId: decoded.id,
      recipientId: recipientId,
      status: 'pending',
      message: message || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await connection.save();

    return NextResponse.json({ 
      message: 'Connection request sent successfully',
      connectionId: connection._id
    });

  } catch (error) {
    console.error('Error sending connection request:', error);
    
    // Handle JWT verification errors specifically
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to send connection request' },
      { status: 500 }
    );
  }
}