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
			return NextResponse.redirect(new URL('/sign-in', req.url));
		}

		if (auth.userId) {
			const user = await db.select().from(users).where(eq(users.clerkId, auth.userId)).limit(1);

			if (user.length > 0) {
				const subscription = user[0].subscriptionTier;

				// Apply restrictions based on subscription tier
				if (subscription === 'free') {
					if (
						req.nextUrl.pathname.startsWith('/api/savePalette') ||
						req.nextUrl.pathname.startsWith('/api/editPalette') ||
						req.nextUrl.pathname === '/browse' ||
						req.nextUrl.pathname === '/contrast-grid'
					) {
						return NextResponse.redirect(new URL('/pricing', req.url));
					}
				}
			}
		}

		return NextResponse.next();
	},
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
