'use client';

import React, { useState } from 'react';
import chroma from 'chroma-js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import EditPalette from './EditPalette';
import { Pencil, Trash2 } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SavedColorPaletteProps {
	id: string;
	name: string;
	primaryColor: string;
	secondaryColor?: string;
	colorScale: { [key: number]: string };
	onDelete: (id: string) => void;
	onUpdate: (id: string, updatedPalette: any) => void;
}

const SavedColorPalette: React.FC<SavedColorPaletteProps> = ({
	id,
	name,
	primaryColor,
	secondaryColor,
	colorScale,
	onDelete,
	onUpdate,
}) => {
	const [copiedColor, setCopiedColor] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const { toast } = useToast();

	const getContrastColor = (bgColor: string) => {
		return chroma(bgColor).luminance() > 0.5 ? colorScale[900] : colorScale[50];
	};

	const copyToClipboard = (color: string) => {
		navigator.clipboard.writeText(color).then(() => {
			setCopiedColor(color);
			setTimeout(() => setCopiedColor(null), 2000);
		});
	};

	const handleEdit = async (updatedPalette: any) => {
		try {
			const response = await fetch(`/api/editPalette/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedPalette),
			});

			if (!response.ok) {
				throw new Error('Failed to update palette');
			}

			onUpdate(id, updatedPalette);
			setIsEditing(false);
			toast({ title: 'Palette updated successfully' });
		} catch (error) {
			console.error('Error updating palette:', error);
			toast({ variant: 'destructive', title: 'Failed to update palette' });
		}
	};

	const handleDelete = async () => {
		try {
			const response = await fetch(`/api/deletePalette/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete palette');
			}

			onDelete(id);
			toast({ title: 'Palette deleted successfully' });
		} catch (error) {
			console.error('Error deleting palette:', error);
			toast({ variant: 'destructive', title: 'Failed to delete palette' });
		}
	};

	return (
		<Card className='mb-4'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<CardTitle>{name}</CardTitle>
				<div>
					{/* <Dialog open={isEditing} onOpenChange={setIsEditing}>
						<DialogTrigger asChild>
							<Button variant='outline' size='icon'>
								<Pencil className='h-4 w-4' />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Edit Palette</DialogTitle>
							</DialogHeader>
							<EditPalette
								colorScale={colorScale}
								secondaryColor={secondaryColor}
								onUpdateColorScale={(newColorScale) => handleEdit({ colorScale: newColorScale })}
								onUpdateSecondaryColor={(newSecondaryColor) => handleEdit({ secondaryColor: newSecondaryColor })}
							/>
						</DialogContent>
					</Dialog> */}
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant='outline' size='icon' className='ml-2'>
								<Trash2 className='h-4 w-4' />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure you want to delete this palette?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete your color palette.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-5 sm:grid-cols-6 md:grid-cols-11 gap-1 sm:gap-2'>
					{Object.entries(colorScale).map(([level, hex]) => (
						<TooltipProvider key={level}>
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										onClick={() => copyToClipboard(hex)}
										className='relative aspect-square w-full rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-105'
										style={{ backgroundColor: hex }}
									>
										<div className='absolute inset-0 flex flex-col justify-between p-1 sm:p-2 text-[8px] sm:text-xs'>
											<span style={{ color: getContrastColor(hex) }}>
												{level}
												{level === '500' && (
													<span className='ml-1 px-1 py-0.5 bg-white bg-opacity-30 rounded text-[6px] sm:text-[8px]'>
														Base
													</span>
												)}
											</span>
											<span style={{ color: getContrastColor(hex) }}>{hex.toUpperCase()}</span>
										</div>
										{copiedColor === hex && (
											<div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs sm:text-sm'>
												Copied!
											</div>
										)}
									</button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Click to copy: {hex}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					))}
				</div>
				{secondaryColor && (
					<div className='mt-4'>
						<h3 className='text-lg font-semibold mb-2'>Secondary Color</h3>
						<div className='w-full h-12'>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<button
											onClick={() => copyToClipboard(secondaryColor)}
											className='relative w-full h-full rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-105'
											style={{ backgroundColor: secondaryColor }}
										>
											<div className='absolute inset-0 flex items-center justify-center'>
												<span style={{ color: getContrastColor(secondaryColor) }}>{secondaryColor.toUpperCase()}</span>
											</div>
											{copiedColor === secondaryColor && (
												<div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white'>
													Copied!
												</div>
											)}
										</button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Click to copy: {secondaryColor}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default SavedColorPalette;
