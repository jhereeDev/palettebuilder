'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { colorNames, colorPalettes } from '@/lib/colors';
import chroma from 'chroma-js';

interface ColorInputProps {
	onColorChange: (color: string, colorName: string, palette: any) => void;
	onSecondaryColorChange: (color: string | undefined) => void;
}

export default function ColorInput({ onColorChange, onSecondaryColorChange }: ColorInputProps) {
	const [inputColor, setInputColor] = useState('#F6F0C2');
	const [secondaryColor, setSecondaryColor] = useState<string | undefined>(undefined);
	const [error, setError] = useState('');
	const [secondaryError, setSecondaryError] = useState('');
	const [colorName, setColorName] = useState('');
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [showSecondaryInput, setShowSecondaryInput] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const parseColorInput = (input: string): string | null => {
		input = input.trim().toLowerCase();

		if (chroma.valid(input)) {
			return chroma(input).hex();
		}

		const rgbMatch = input.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		if (rgbMatch) {
			return chroma(rgbMatch.slice(1).map(Number)).hex();
		}

		const hslMatch = input.match(/^hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)$/);
		if (hslMatch) {
			const [h, s, l] = hslMatch.slice(1).map(Number);
			return chroma.hsl(h, s / 100, l / 100).hex();
		}

		return null;
	};

	const findClosestNamedColor = (inputHex: string) => {
		let closestColor = '';
		let closestDistance = Infinity;
		let closestPalette = '';
		let closestShade = 0;

		Object.entries(colorPalettes).forEach(([paletteName, palette]) => {
			Object.entries(palette).forEach(([shade, hexValue]) => {
				const distance = chroma.distance(inputHex, hexValue, 'lab');
				if (distance < closestDistance) {
					closestDistance = distance;
					closestColor = hexValue;
					closestPalette = paletteName;
					closestShade = parseInt(shade);
				}
			});
		});

		return { name: `${closestPalette} ${closestShade}`, palette: colorPalettes[closestPalette] };
	};

	const validateColor = (input: string, isSecondary: boolean = false) => {
		const parsedColor = parseColorInput(input);
		if (parsedColor) {
			if (isSecondary) {
				setSecondaryError('');
				onSecondaryColorChange(parsedColor);
				setSecondaryColor(parsedColor);
			} else {
				setError('');
				const { name, palette } = findClosestNamedColor(parsedColor);
				setColorName(name);
				onColorChange(parsedColor, name, palette);
			}
			return true;
		} else {
			const errorMessage = 'Invalid color input. Please enter a valid hex, RGB, or HSL color.';
			if (isSecondary) {
				setSecondaryError(errorMessage);
			} else {
				setError(errorMessage);
				setColorName('');
			}
			return false;
		}
	};

	useEffect(() => {
		validateColor(inputColor);
	}, [inputColor]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isSecondary: boolean = false) => {
		const value = e.target.value;
		if (isSecondary) {
			setSecondaryColor(value);
			validateColor(value, true);
		} else {
			setInputColor(value);
			const filtered = colorNames.filter((name) => name.toLowerCase().includes(value.toLowerCase()));
			setSuggestions(filtered);
			setShowSuggestions(filtered.length > 0);
		}
	};

	const handleSuggestionClick = (suggestion: string) => {
		setInputColor(suggestion);
		setShowSuggestions(false);
		validateColor(suggestion);
	};

	const generateRandomColor = (isSecondary: boolean = false) => {
		const randomColor = chroma.random().hex();
		if (isSecondary) {
			setSecondaryColor(randomColor);
			validateColor(randomColor, true);
		} else {
			setInputColor(randomColor);
			validateColor(randomColor);
		}
	};

	const handleBlur = () => {
		setTimeout(() => setShowSuggestions(false), 200);
	};

	const toggleSecondaryInput = () => {
		setShowSecondaryInput(!showSecondaryInput);
		if (showSecondaryInput) {
			setSecondaryColor(undefined);
			onSecondaryColorChange(undefined);
		}
	};

	const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newColor = e.target.value;
		setInputColor(newColor);
		validateColor(newColor);
	};

	const handleSecondaryColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newColor = e.target.value;
		setSecondaryColor(newColor);
		validateColor(newColor, true);
	};

	return (
		<div className='mb-4 relative'>
			<label htmlFor='colorInput' className='block text-sm font-medium  mb-2'>
				Enter a primary color (hex, RGB, HSL, or color name):
			</label>
			<div className='flex rounded-md shadow-sm mb-4'>
				<Input
					ref={inputRef}
					type='text'
					name='colorInput'
					id='colorInput'
					className={`focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-l-md sm:text-sm border-gray-300 ${
						error ? 'border-red-500' : ''
					}`}
					value={inputColor}
					onChange={(e) => handleInputChange(e)}
					onBlur={handleBlur}
				/>
				<Button
					onClick={() => generateRandomColor()}
					className='inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50  text-sm hover:bg-gray-100 mx-2'
				>
					Random
				</Button>
			</div>
			{showSuggestions && (
				<ul className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
					{suggestions.map((suggestion, index) => (
						<li
							key={index}
							className='cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white'
							onClick={() => handleSuggestionClick(suggestion)}
						>
							{suggestion}
						</li>
					))}
				</ul>
			)}
			{error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
			{colorName && !error && (
				<div className='mt-2 flex items-center'>
					<div className='relative w-8 h-8 mr-2'>
						<div className='absolute inset-0 rounded-md border border-input' style={{ backgroundColor: inputColor }} />
						<Input
							type='color'
							value={inputColor}
							onChange={handleColorPickerChange}
							className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
							title='Choose color'
						/>
					</div>
					<p className='text-sm'>Mapped color: {colorName}</p>
				</div>
			)}

			<div className='mt-4'>
				<Button onClick={toggleSecondaryInput} variant='outline'>
					{showSecondaryInput ? 'Remove Secondary Color' : 'Add Secondary Color'}
				</Button>
			</div>

			{showSecondaryInput && (
				<>
					<label htmlFor='secondaryColorInput' className='block text-sm font-medium  mt-4 mb-2'>
						Enter a secondary color (hex, RGB, or HSL):
					</label>
					<div className='flex rounded-md shadow-sm'>
						<Input
							type='text'
							name='secondaryColorInput'
							id='secondaryColorInput'
							className={`focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-l-md sm:text-sm border-gray-300 ${
								secondaryError ? 'border-red-500' : ''
							}`}
							value={secondaryColor || ''}
							onChange={(e) => handleInputChange(e, true)}
						/>
						<Button
							onClick={() => generateRandomColor(true)}
							className='inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50  text-sm hover:bg-gray-100 mx-2'
						>
							Random
						</Button>
					</div>
					{secondaryError && <p className='mt-2 text-sm text-red-600'>{secondaryError}</p>}
					{secondaryColor && !secondaryError && (
						<div className='mt-2 flex items-center'>
							<div className='relative w-8 h-8 mr-2'>
								<div
									className='absolute inset-0 rounded-md border border-input'
									style={{ backgroundColor: secondaryColor }}
								/>
								<Input
									type='color'
									value={inputColor}
									onChange={handleSecondaryColorPickerChange}
									className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
									title='Choose color'
								/>
							</div>
							<p className='text-sm'>Secondary color: {colorName}</p>
						</div>
					)}
				</>
			)}
		</div>
	);
}
