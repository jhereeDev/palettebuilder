'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import SavedColorPalette from '@/components/SavedColorPalette';
import { toast } from 'react-hot-toast';
import Loader from '@/components/Loader';

export default function SavedPalettes() {
	const { user } = useUser();
	const [palettes, setPalettes] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (user) {
			fetchUserPalettes();
		}
	}, [user]);

	const fetchUserPalettes = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/getUserPalettes?clerkId=${user?.id}`);
			if (!response.ok) {
				throw new Error('Failed to fetch palettes');
			}
			const data = await response.json();
			setPalettes(data);
		} catch (error) {
			console.error('Error fetching palettes:', error);
			toast.error('Failed to load palettes');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = (id: string) => {
		setPalettes(palettes.filter((palette) => palette.id !== id));
	};

	const handleUpdate = (id: string, updatedPalette: any) => {
		setPalettes(palettes.map((palette) => (palette.id === id ? { ...palette, ...updatedPalette } : palette)));
	};

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<Loader size={48} color='#3B82F6' /> {/* Adjust size and color as needed */}
			</div>
		);
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
						colorScale={JSON.parse(palette.colorScale)}
						onDelete={handleDelete}
						onUpdate={handleUpdate}
					/>
				))
			)}
		</div>
	);
}
