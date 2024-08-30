// src/app/api/deletePalette/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { colorPalettes } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	const { id } = params;

	try {
		const result = await db
			.delete(colorPalettes)
			.where(eq(colorPalettes.id, parseInt(id)))
			.returning();

		if (result.length === 0) {
			return NextResponse.json({ error: 'Palette not found' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Palette deleted successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error deleting palette:', error);
		return NextResponse.json({ error: 'Error deleting palette' }, { status: 500 });
	}
}
