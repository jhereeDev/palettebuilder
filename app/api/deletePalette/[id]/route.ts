// app/api/deletePalette/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { colorPalettes } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	const id = parseInt(params.id);

	if (isNaN(id)) {
		return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
	}

	try {
		const deletedPalette = await db.delete(colorPalettes).where(eq(colorPalettes.id, id)).returning();

		if (deletedPalette.length === 0) {
			return NextResponse.json({ error: 'Palette not found' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Palette deleted successfully' });
	} catch (error) {
		console.error('Error deleting palette:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
