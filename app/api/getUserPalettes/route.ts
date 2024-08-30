// src/app/api/getUserPalettes/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { colorPalettes, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
	const clerkId = request.nextUrl.searchParams.get('clerkId');

	if (!clerkId) {
		return NextResponse.json({ error: 'Clerk ID is required' }, { status: 400 });
	}

	try {
		// Find the user by Clerk ID
		const userResult = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);

		if (userResult.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		const userId = userResult[0].id;

		const userPalettes = await db.select().from(colorPalettes).where(eq(colorPalettes.userId, userId));
		return NextResponse.json(userPalettes, { status: 200 });
	} catch (error) {
		console.error('Error fetching user palettes:', error);
		return NextResponse.json({ error: 'Error fetching user palettes' }, { status: 500 });
	}
}
