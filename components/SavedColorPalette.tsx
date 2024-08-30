'use client';

import React, { useState } from 'react';
import chroma from 'chroma-js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SavedColorPaletteProps {
	name: string;
	primaryColor: string;
	secondaryColor?: string;
	colorScale: { [key: string]: string };
}

const SavedColorPalette: React.FC<SavedColorPaletteProps> = ({ name, primaryColor, secondaryColor, colorScale }) => {
	const [copiedColor, setCopiedColor] = useState<string | null>(null);

	const getContrastColor = (bgColor: string) => {
		return chroma(bgColor).luminance() > 0.5 ? '#000000' : '#ffffff';
	};

	const copyToClipboard = (color: string) => {
		navigator.clipboard.writeText(color).then(() => {
			setCopiedColor(color);
			setTimeout(() => setCopiedColor(null), 2000);
		});
	};

	return (
		<Card className='mb-4'>
			<CardHeader>
				<CardTitle>{name}</CardTitle>
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
