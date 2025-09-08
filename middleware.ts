// middleware.ts

import { NextResponse } from "next/server";

export function middleware(request: Request) {
  // No authentication middleware - all routes are public
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
