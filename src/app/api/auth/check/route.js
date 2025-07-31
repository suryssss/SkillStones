import { NextResponse } from 'next/server';
import { auth, currentUser, getAuth } from '@clerk/nextjs/server';

export async function GET(req) {
  try {
    // Try different auth methods
    const authMethod1 = auth();
    const authMethod2 = getAuth(req);
    const user = await currentUser();

    console.log('Auth Check - Auth Methods:', {
      method1: {
        userId: authMethod1?.userId,
        sessionId: authMethod1?.sessionId
      },
      method2: {
        userId: authMethod2?.userId,
        sessionId: authMethod2?.sessionId
      },
      user: user ? {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress
      } : null
    });

    // Check auth headers
    const headers = Object.fromEntries(req.headers);
    console.log('Auth Check - Request Headers:', {
      authorization: headers.authorization,
      cookie: headers.cookie,
      'clerk-session': headers['clerk-session']
    });

    // Try to use the most reliable auth source
    const userId = authMethod2?.userId || authMethod1?.userId;
    const sessionId = authMethod2?.sessionId || authMethod1?.sessionId;

    if (!userId || !sessionId) {
      console.log('Auth Check - No auth credentials found');
      return NextResponse.json({
        authenticated: false,
        message: 'Not authenticated',
        debug: {
          hasUserId: !!userId,
          hasSessionId: !!sessionId,
          hasUser: !!user,
          authMethod1: !!authMethod1?.userId,
          authMethod2: !!authMethod2?.userId
        }
      }, { 
        status: 401,
        headers: {
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    }

    console.log('Auth Check - Authentication successful');
    return NextResponse.json({
      authenticated: true,
      userId,
      sessionId,
      user: user ? {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      } : null
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error('Auth Check - Error:', error);
    return NextResponse.json({
      authenticated: false,
      error: error.message,
      errorType: error.constructor.name,
      debug: {
        errorName: error.name,
        errorStack: error.stack?.split('\n')[0]
      }
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  }
} 