import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';

export async function GET() {
  try {
    // Attempt to connect to the database
    const db = await connectDB();
    
    // Check if the connection is successful
    if (db.connection.readyState === 1) {
      return NextResponse.json(
        { 
          status: 'success', 
          message: 'Successfully connected to MongoDB!',
          database: db.connection.db.databaseName,
          host: db.connection.host
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Connected to MongoDB but connection is not ready',
          readyState: db.connection.readyState
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to connect to MongoDB',
        error: error.message
      },
      { status: 500 }
    );
  }
} 