import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../../lib/db';

export async function GET() {
  try {
    // Get the MongoDB URI from environment variables
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return NextResponse.json(
        { status: 'error', message: 'MongoDB URI is not defined in environment variables' },
        { status: 500 }
      );
    }
    
    // Connect to MongoDB using the connectDB function
    await connectDB();
    
    // Check if the connection is successful
    if (mongoose.connection.readyState === 1) {
      return NextResponse.json(
        { 
          status: 'success', 
          message: 'Successfully connected to MongoDB!',
          database: mongoose.connection.db?.databaseName || 'unknown',
          host: mongoose.connection.host
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Connected to MongoDB but connection is not ready',
          readyState: mongoose.connection.readyState
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