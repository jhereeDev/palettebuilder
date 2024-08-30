// src/app/api/savePalette/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { colorPalettes, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
	const { clerkId, name, primaryColor, secondaryColor, colorScale } = await request.json();

	if (!clerkId || !name || !primaryColor || !colorScale) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
	}

	try {
		// Find the user by Clerk ID
		const userResult = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);

		if (userResult.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		const userId = userResult[0].id;

		const newPalette = await db
			.insert(colorPalettes)
			.values({
				userId,
				name,
				primaryColor,
				secondaryColor,
				colorScale: JSON.stringify(colorScale),
			})
			.returning();

		return NextResponse.json(newPalette[0], { status: 201 });
	} catch (error) {
		console.error('Error saving palette:', error);
		return NextResponse.json({ error: 'Error saving palette' }, { status: 500 });
	}
}
