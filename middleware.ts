import { NextResponse, NextRequest } from 'next/server'
import * as admin from "firebase-admin"; 
import { useEffect } from 'react';

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('sessionCookie')?.value
    if (token && token != 'nothing') {
      return NextResponse.next()
    }
    else {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
}
 
export const config = {
  matcher: [
    '/leaderboard',
    '/premium'
  ],
}