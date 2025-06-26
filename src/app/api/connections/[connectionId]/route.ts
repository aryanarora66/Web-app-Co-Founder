// src/app/api/connections/[connectionId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import Connection from '@/models/connection';

// PUT endpoint to update connection status (accept/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
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

    const { connectionId } = params;
    const { action, reason } = await request.json();

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Find the connection
    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Check if the user is the recipient of this connection request
    if (connection.recipientId.toString() !== decoded.id) {
      return NextResponse.json({ 
        error: 'You can only respond to connection requests sent to you' 
      }, { status: 403 });
    }

    // Check if connection is still pending
    if (connection.status !== 'pending') {
      return NextResponse.json({ 
        error: 'This connection request has already been responded to' 
      }, { status: 400 });
    }

    // Update connection status
    if (action === 'accept') {
      await connection.accept();
    } else {
      await connection.reject(reason);
    }

    return NextResponse.json({ 
      message: `Connection ${action}ed successfully`,
      connection
    });

  } catch (error) {
    console.error('Error updating connection:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to update connection' },
      { status: 500 }
    );
  }
}