// middleware.ts

import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default authMiddleware({
	publicRoutes: ['/', '/api/webhooks(.*)'],
	async afterAuth(auth, req) {
		if (!auth.userId && !auth.isPublicRoute) {
			return NextResponse.redirect(new URL('/', req.url));
		}

		// All features are now accessible to all authenticated users
		return NextResponse.next();
	},
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
