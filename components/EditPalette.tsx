import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import chroma from 'chroma-js';

interface EditPaletteProps {
	colorScale: { [key: string]: string };
	secondaryColor?: string;
	onUpdateColorScale: (newColorScale: { [key: string]: string }) => void;
	onUpdateSecondaryColor: (newColor: string | undefined) => void;
	onSave?: (paletteName: string, colorScale: { [key: string]: string }, secondaryColor?: string) => void;
	onClose: () => void;
	paletteName?: string;
	isNewPalette?: boolean;
}

const EditPalette: React.FC<EditPaletteProps> = ({
	colorScale,
	secondaryColor,
	onUpdateColorScale,
	onUpdateSecondaryColor,
	onSave,
	onClose,
	paletteName = '',
	isNewPalette = false,
}) => {
	const [editedColors, setEditedColors] = useState(colorScale);
	const [editedSecondaryColor, setEditedSecondaryColor] = useState(secondaryColor);
	const [name, setName] = useState(paletteName);

	const handleColorChange = (shade: string, value: string) => {
		try {
			const color = chroma(value);
			setEditedColors((prev) => ({ ...prev, [shade]: color.hex() }));
		} catch (e) {
			console.error('Invalid color:', value);
		}
	};

	const handleSecondaryColorChange = (value: string) => {
		try {
			const color = chroma(value);
			setEditedSecondaryColor(color.hex());
		} catch (e) {
			console.error('Invalid secondary color:', value);
		}
	};

	const handleSave = () => {
		onUpdateColorScale(editedColors);
		onUpdateSecondaryColor(editedSecondaryColor);
		if (onSave) {
			onSave(name, editedColors, editedSecondaryColor);
			onClose();
		}
		onClose();
	};

	return (
		<div className='space-y-4'>
			<Input
				type='text'
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder='Palette Name'
				className='w-full'
			/>
			<div className='grid grid-cols-2 gap-2'>
				{Object.entries(editedColors).map(([shade, color]) => (
					<div key={shade} className='space-y-1'>
						<label htmlFor={`color-${shade}`} className='block text-sm font-medium text-gray-700'>
							{shade}
						</label>
						<Input
							type='color'
							id={`color-${shade}`}
							value={color}
							onChange={(e) => handleColorChange(shade, e.target.value)}
							className='w-full h-8'
						/>
						<Input
							type='text'
							value={color}
							onChange={(e) => handleColorChange(shade, e.target.value)}
							className='w-full text-xs'
						/>
					</div>
				))}
			</div>
			<div className='space-y-1'>
				<label htmlFor='secondary-color' className='block text-sm font-medium text-gray-700'>
					Secondary Color (Optional)
				</label>
				<Input
					type='color'
					id='secondary-color'
					value={editedSecondaryColor || ''}
					onChange={(e) => handleSecondaryColorChange(e.target.value)}
					className='w-full h-8'
				/>
				<Input
					type='text'
					value={editedSecondaryColor || ''}
					onChange={(e) => handleSecondaryColorChange(e.target.value)}
					className='w-full text-xs'
				/>
			</div>
			<Button onClick={handleSave}>{isNewPalette ? 'Save New Palette' : 'Update Palette'}</Button>
		</div>
	);
};

export default EditPalette;
