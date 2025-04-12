import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import User from '../../../models/User';

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

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