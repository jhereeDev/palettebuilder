'use client';

import { useEffect, useState } from 'react';
import chroma from 'chroma-js';
import ColorInput from '@/components/ColorInput';
import ColorPalette from '@/components/ColorPalette';
import SampleComponents from '@/components/SampleComponents';
import { colorPalettes } from '@/lib/colors';

export default function Home() {
	const [baseColor, setBaseColor] = useState('#F6F0C2');
	const [secondaryColor, setSecondaryColor] = useState<string | undefined>(undefined);
	const [colorName, setColorName] = useState('khaki 200');
	const [colorScale, setColorScale] = useState({});
	const [isValidColor, setIsValidColor] = useState(true);

	const generateColorScale = (color: string) => {
		const base = chroma(color);
		const lighterScale = chroma.scale(['white', color]).mode('lab').colors(6);
		const darkerScale = chroma.scale([color, 'black']).mode('lab').colors(5).slice(1);

		return {
			'50': lighterScale[0],
			'100': lighterScale[1],
			'200': lighterScale[2],
			'300': lighterScale[3],
			'400': lighterScale[4],
			'500': base.hex(), // Use the exact base color for 500
			'600': darkerScale[0],
			'700': darkerScale[1],
			'800': darkerScale[2],
			'900': darkerScale[3],
		};
	};

	const handleColorChange = (color: string, name: string, palette: any) => {
		setBaseColor(color);
		setColorName(name);
		// Use the provided palette if it exists, otherwise generate a new one
		const newColorScale = Object.keys(palette).length > 0 ? palette : generateColorScale(color);
		setColorScale(newColorScale);
		setIsValidColor(!!color);
	};

	const handleSecondaryColorChange = (color: string | undefined) => {
		setSecondaryColor(color);
	};

	// Generate initial color scale
	useEffect(() => {
		const initialScale = colorPalettes[colorName.toLowerCase()] || generateColorScale(baseColor);
		setColorScale(initialScale);
	}, [baseColor, colorName]);

	// Reset color palette when secondary color is removed
	useEffect(() => {
		if (secondaryColor === undefined) {
			const newColorScale = generateColorScale(baseColor);
			setColorScale(newColorScale);
		}
	}, [secondaryColor, baseColor]);

	return (
		<main className='container mx-auto p-4'>
			<div className='mb-8 text-center'>
				<h1 className='text-3xl font-bold mb-2'>{colorName.charAt(0).toUpperCase() + colorName.slice(1)}</h1>
				<div className='flex justify-center'>
					<ColorInput onColorChange={handleColorChange} onSecondaryColorChange={handleSecondaryColorChange} />
				</div>
			</div>
			{isValidColor && (
				<>
					<ColorPalette
						baseColor={baseColor}
						secondaryColor={secondaryColor}
						colorName={colorName}
						colorScale={colorScale}
						onUpdateColorScale={setColorScale}
						onUpdateSecondaryColor={handleSecondaryColorChange}
					/>
					<SampleComponents baseColor={baseColor} secondaryColor={secondaryColor} colorScale={colorScale} />
				</>
			)}
		</main>
	);
}
