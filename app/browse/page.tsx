'use client';

import { useState, useEffect } from 'react';
import ColorPalette from '@/components/ColorPalette';
import { colorNames, colorPalettes } from '@/lib/colors';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import Loader from '@/components/Loader';

export default function BrowsePalettes() {
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const palettesPerPage = 6;
	const totalPages = Math.ceil(colorNames.length / palettesPerPage);

	useEffect(() => {
		// Simulate loading delay
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const paginatedPalettes = colorNames.slice((currentPage - 1) * palettesPerPage, currentPage * palettesPerPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		setIsLoading(true);
		// Simulate loading delay when changing pages
		setTimeout(() => {
			setIsLoading(false);
		}, 500);
	};

	const renderPaginationItems = () => {
		const items = [];
		const maxVisiblePages = 3;

		for (let i = 1; i <= totalPages; i++) {
			if (
				i === 1 ||
				i === totalPages ||
				(i >= currentPage - 1 && i <= currentPage + 1) ||
				(currentPage <= 3 && i <= maxVisiblePages) ||
				(currentPage >= totalPages - 2 && i >= totalPages - maxVisiblePages + 1)
			) {
				items.push(
					<PaginationItem key={i}>
						<PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i} className='cursor-pointer'>
							{i}
						</PaginationLink>
					</PaginationItem>
				);
			} else if ((currentPage > 3 && i === 2) || (currentPage < totalPages - 2 && i === totalPages - 1)) {
				items.push(<PaginationEllipsis key={`ellipsis-${i}`} />);
			}
		}

		return items;
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
			<h1 className='text-3xl font-bold mb-4'>Browse Palettes</h1>
			{paginatedPalettes.map((colorName) => (
				<ColorPalette
					key={colorName}
					baseColor={colorPalettes[colorName][500]}
					colorName={colorName}
					colorScale={colorPalettes[colorName]}
					onUpdateColorScale={() => {}}
					onUpdateSecondaryColor={() => {}}
					showEditButton={false}
				/>
			))}
			<Pagination className='mt-4'>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
							className={currentPage === 1 ? 'pointer-events-none opacity-50 cursor-pointer' : 'cursor-pointer'}
						/>
					</PaginationItem>
					{renderPaginationItems()}
					<PaginationItem>
						<PaginationNext
							onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
							className={
								currentPage === totalPages ? 'pointer-events-none opacity-50 cursor-pointer' : 'cursor-pointer'
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
