import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../db';

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the User model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    // Connect to MongoDB using the connectDB function
    await connectDB();

    const user = await User.create({
      name,
      email,
    });

    return NextResponse.json(
      { message: 'Successfully joined the waitlist!', user },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Email already exists in the waitlist.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
} 