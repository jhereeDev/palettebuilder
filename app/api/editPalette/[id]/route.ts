// src/app/api/editPalette/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { colorPalettes } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	const { id } = params;
	const updatedPalette = await request.json();

	try {
		const result = await db
			.update(colorPalettes)
			.set(updatedPalette)
			.where(eq(colorPalettes.id, parseInt(id)))
			.returning();

		if (result.length === 0) {
			return NextResponse.json({ error: 'Palette not found' }, { status: 404 });
		}

		return NextResponse.json(result[0], { status: 200 });
	} catch (error) {
		console.error('Error updating palette:', error);
		return NextResponse.json({ error: 'Error updating palette' }, { status: 500 });
	}
}
