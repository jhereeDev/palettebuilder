'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import SavedColorPalette from '@/components/SavedColorPalette';
import { useToast } from '@/components/ui/use-toast';

export default function SavedPalettes() {
	const { user } = useUser();
	const [palettes, setPalettes] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	const fetchUserPalettes = useCallback(async () => {
		if (!user) return;

		setIsLoading(true);
		try {
			const response = await fetch(`/api/getUserPalettes?clerkId=${user.id}`);
			if (!response.ok) {
				throw new Error('Failed to fetch palettes');
			}
			const data = await response.json();
			setPalettes(data);
		} catch (error) {
			console.error('Error fetching palettes:', error);
			toast({ variant: 'destructive', title: 'Failed to load palettes' });
		} finally {
			setIsLoading(false);
		}
	}, [user, toast]);

	useEffect(() => {
		fetchUserPalettes();
	}, [fetchUserPalettes]);

	const handleDelete = (id: string) => {
		setPalettes(palettes.filter((palette) => palette.id !== id));
	};

	const handleUpdate = (id: string, updatedPalette: any) => {
		setPalettes(palettes.map((palette) => (palette.id === id ? { ...palette, ...updatedPalette } : palette)));
	};

	const handleEditComplete = () => {
		fetchUserPalettes();
	};

	if (isLoading) {
		return <div className='container mx-auto p-4'>Loading palettes...</div>;
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-4'>Saved Palettes</h1>
			{palettes.length === 0 ? (
				<p>You haven&apos;t saved any palettes yet.</p>
			) : (
				palettes.map((palette) => (
					<SavedColorPalette
						key={palette.id}
						id={palette.id}
						name={palette.name}
						primaryColor={palette.primaryColor}
						secondaryColor={palette.secondaryColor}
						colorScale={palette.colorScale}
						onDelete={handleDelete}
						onUpdate={handleUpdate}
						onEditComplete={handleEditComplete}
					/>
				))
			)}
		</div>
	);
}
