import React from 'react';
import chroma from 'chroma-js';

interface ContrastGridProps {
	colorScale: { [key: string]: string };
	secondaryColor?: string;
}

const ContrastGrid: React.FC<ContrastGridProps> = ({ colorScale, secondaryColor }) => {
	const getContrastRatio = (color1: string, color2: string) => {
		return chroma.contrast(color1, color2).toFixed(2);
	};

	const getTextColor = (bgColor: string) => {
		return chroma(bgColor).luminance() > 0.5 ? '#000' : '#fff';
	};

	const allColors = secondaryColor ? { ...colorScale, Secondary: secondaryColor } : colorScale;

	return (
		<div className='w-full overflow-auto'>
			<table className='w-full border-collapse text-xs'>
				<thead>
					<tr>
						<th className='p-2 border bg-white'></th>
						{Object.entries(allColors).map(([level, hex]) => (
							<th key={level} className='p-2 border' style={{ color: getTextColor(hex), backgroundColor: hex }}>
								{level}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{Object.entries(allColors).map(([rowLevel, rowHex]) => (
						<tr key={rowLevel}>
							<th className='p-2 border bg-white' style={{ color: getTextColor(rowHex), backgroundColor: rowHex }}>
								{rowLevel}
							</th>
							{Object.entries(allColors).map(([colLevel, colHex]) => {
								const contrastRatio = getContrastRatio(rowHex, colHex);
								return (
									<td
										key={`${rowLevel}-${colLevel}`}
										className='p-2 border text-center'
										style={{ backgroundColor: rowHex, color: getTextColor(rowHex) }}
									>
										{contrastRatio}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ContrastGrid;
