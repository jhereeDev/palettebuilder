// src/app/api/saveUser/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
	const { clerkId, email } = await request.json();

	if (!clerkId || !email) {
		return NextResponse.json({ error: 'Clerk ID and email are required' }, { status: 400 });
	}

	try {
		const existingUser = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);

		if (existingUser.length > 0) {
			return NextResponse.json(existingUser[0], { status: 200 });
		}

		const newUser = await db.insert(users).values({ clerkId, email }).returning();
		return NextResponse.json(newUser[0], { status: 201 });
	} catch (error) {
		console.error('Error saving user:', error);
		return NextResponse.json({ error: 'Error saving user' }, { status: 500 });
	}
}
