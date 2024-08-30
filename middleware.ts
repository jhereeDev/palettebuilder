import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default authMiddleware({
	publicRoutes: ['/', '/api/webhooks(.*)'],
	afterAuth(auth, req) {
		// Allow users to visit public routes
		if (auth.isPublicRoute) {
			return NextResponse.next();
		}

		// Handle users who aren't authenticated
		if (!auth.userId && !auth.isPublicRoute) {
			// Redirect to home page where they can use the sign-in component in the navbar
			return NextResponse.redirect(new URL('/', req.url));
		}

		// Allow authenticated users to access protected routes
		if (auth.userId) {
			return NextResponse.next();
		}

		// Redirect all other unauthorized access to the home page
		return NextResponse.redirect(new URL('/', req.url));
	},
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
