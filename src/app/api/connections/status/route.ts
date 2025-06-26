// src/app/api/connections/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import Connection from '@/models/connection';

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('userId');

    if (!otherUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Find connection between current user and specified user
    const connection = await Connection.findOne({
      $or: [
        { requesterId: decoded.id, recipientId: otherUserId },
        { requesterId: otherUserId, recipientId: decoded.id }
      ]
    });

    let status = 'none';
    let connectionId = null;
    let isRequester = false;

    if (connection) {
      status = connection.status;
      connectionId = connection._id;
      isRequester = connection.requesterId.toString() === decoded.id;
    }

    return NextResponse.json({ 
      status,
      connectionId,
      isRequester,
      canConnect: status === 'none',
      canRespond: status === 'pending' && !isRequester
    });

  } catch (error) {
    console.error('Error checking connection status:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to check connection status' },
      { status: 500 }
    );
  }
}