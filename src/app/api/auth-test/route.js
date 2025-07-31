import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(req) {
  try {
    const { userId, sessionId } = auth();
    const user = await currentUser();
    
    // Log request details
    console.log('Auth Test - Headers:', Object.fromEntries(req.headers));
    console.log('Auth Test - Auth:', { userId, sessionId });
    console.log('Auth Test - User:', user ? {
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress
    } : null);

    if (!userId) {
      return NextResponse.json({
        status: 'unauthorized',
        message: 'No user ID found',
        debug: {
          headers: Object.fromEntries(req.headers),
          userId,
          sessionId,
          hasUser: !!user
        }
      }, { status: 401 });
    }

    return NextResponse.json({
      status: 'authenticated',
      userId,
      sessionId,
      user: user ? {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress
      } : null
    });
  } catch (error) {
    console.error('Auth Test - Error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 