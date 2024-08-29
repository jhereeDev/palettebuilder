'use client';

import { useEffect, useState } from 'react';
import chroma from 'chroma-js';
import ColorInput from '@/components/ColorInput';
import ColorPalette from '@/components/ColorPalette';
import SampleComponents from '@/components/SampleComponents';
import { colorPalettes } from '@/lib/colors';
import { useTheme } from 'next-themes';

export default function Home() {
	const [baseColor, setBaseColor] = useState('#F6F0C2');
	const [secondaryColor, setSecondaryColor] = useState<string | undefined>(undefined);
	const [colorName, setColorName] = useState('khaki 200');
	const [colorScale, setColorScale] = useState({});
	const [isValidColor, setIsValidColor] = useState(true);
	const { theme } = useTheme();

	const generateColorScale = (color: string) => {
		const scale = chroma.scale(['white', color, 'black']).mode('lab').colors(9);
		return {
			'50': scale[0],
			'100': scale[1],
			'200': scale[2],
			'300': scale[3],
			'400': scale[4],
			'500': color,
			'600': scale[5],
			'700': scale[6],
			'800': scale[7],
			'900': scale[8],
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
	}, []);

	// Reset color palette when secondary color is removed
	useEffect(() => {
		if (secondaryColor === undefined) {
			const newColorScale = generateColorScale(baseColor);
			setColorScale(newColorScale);
		}
	}, [secondaryColor, baseColor]);

	return (
		<main className='container mx-auto p-4'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold mb-2'>{colorName.charAt(0).toUpperCase() + colorName.slice(1)}</h1>
				<ColorInput onColorChange={handleColorChange} onSecondaryColorChange={handleSecondaryColorChange} />
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
