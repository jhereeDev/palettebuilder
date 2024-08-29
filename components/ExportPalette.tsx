import React from 'react';
import { Button } from '@/components/ui/button';
import chroma from 'chroma-js';

interface ExportPaletteProps {
	colorScale: { [key: string]: string };
	colorName: string;
	secondaryColor?: string;
	onClose: () => void;
}

const ExportPalette: React.FC<ExportPaletteProps> = ({ colorScale, colorName, secondaryColor, onClose }) => {
	const generateTailwindHex = () => {
		const config = Object.entries(colorScale)
			.map(([level, hex]) => `      '${level}': '${hex}',`)
			.join('\n');
		const secondaryColorConfig = secondaryColor ? `\n    secondary: '${secondaryColor}',` : '';
		return `module.exports = {
  theme: {
    extend: {
      colors: {
        ${colorName}: {
${config}
        },${secondaryColorConfig}
      },
    },
  },
};`;
	};

	const generateTailwindOKLCH = () => {
		const config = Object.entries(colorScale)
			.map(([level, hex]) => {
				const oklch = chroma(hex).oklch();
				return `      '${level}': 'oklch(${oklch[0].toFixed(3)} ${oklch[1].toFixed(3)} ${oklch[2].toFixed(3)})',`;
			})
			.join('\n');
		const secondaryColorConfig = secondaryColor
			? `\n    secondary: 'oklch(${chroma(secondaryColor)
					.oklch()
					.map((v) => v.toFixed(3))
					.join(' ')}))',`
			: '';
		return `module.exports = {
  theme: {
    extend: {
      colors: {
        ${colorName}: {
${config}
        },${secondaryColorConfig}
      },
    },
  },
};`;
	};

	const generateTailwindHSL = () => {
		const config = Object.entries(colorScale)
			.map(([level, hex]) => {
				const hsl = chroma(hex).hsl();
				return `      '${level}': 'hsl(${Math.round(hsl[0])} ${Math.round(hsl[1] * 100)}% ${Math.round(
					hsl[2] * 100
				)}%)',`;
			})
			.join('\n');
		const secondaryColorConfig = secondaryColor
			? `\n    secondary: 'hsl(${chroma(secondaryColor)
					.hsl()
					.map((v, i) => (i === 0 ? Math.round(v) : Math.round(v * 100) + '%'))
					.join(' ')}))',`
			: '';
		return `module.exports = {
  theme: {
    extend: {
      colors: {
        ${colorName}: {
${config}
        },${secondaryColorConfig}
      },
    },
  },
};`;
	};

	const generateSCSS = () => {
		const variables = Object.entries(colorScale)
			.map(([level, hex]) => `$${colorName}-${level}: ${hex};`)
			.join('\n');
		const secondaryColorVariable = secondaryColor ? `\n$secondary-color: ${secondaryColor};` : '';
		return `${variables}${secondaryColorVariable}`;
	};

	const generateCSSHex = () => {
		const variables = Object.entries(colorScale)
			.map(([level, hex]) => `  --${colorName}-${level}: ${hex};`)
			.join('\n');
		const secondaryColorVariable = secondaryColor ? `\n  --secondary-color: ${secondaryColor};` : '';
		return `:root {
${variables}${secondaryColorVariable}
}`;
	};

	const generateCSSRGB = () => {
		const variables = Object.entries(colorScale)
			.map(([level, hex]) => {
				const rgb = chroma(hex).rgb();
				return `  --${colorName}-${level}: ${rgb[0]}, ${rgb[1]}, ${rgb[2]};`;
			})
			.join('\n');
		const secondaryColorVariable = secondaryColor
			? `\n  --secondary-color: ${chroma(secondaryColor).rgb().join(', ')};`
			: '';
		return `:root {
${variables}${secondaryColorVariable}
}`;
	};

	const generateSVG = () => {
		const swatches = Object.entries(colorScale)
			.map(([level, hex], index) => `  <rect x="0" y="${index * 50}" width="100" height="50" fill="${hex}" />`)
			.join('\n');
		const secondarySwatch = secondaryColor
			? `\n  <rect x="0" y="${Object.keys(colorScale).length * 50}" width="100" height="50" fill="${secondaryColor}" />`
			: '';
		return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="${
			(Object.keys(colorScale).length + (secondaryColor ? 1 : 0)) * 50
		}">
${swatches}${secondarySwatch}
</svg>`;
	};

	const downloadFile = (content: string, filename: string) => {
		const blob = new Blob([content], { type: 'text/plain' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = filename;
		link.click();
	};

	return (
		<div className='grid grid-cols-1 gap-1 md:gap-2 md:grid-cols-2'>
			<Button onClick={() => downloadFile(generateTailwindHex(), `${colorName}-tailwind-hex.js`)}>
				Tailwind (HEX)
			</Button>
			<Button onClick={() => downloadFile(generateTailwindOKLCH(), `${colorName}-tailwind-oklch.js`)}>
				Tailwind (OKLCH)
			</Button>
			<Button onClick={() => downloadFile(generateTailwindHSL(), `${colorName}-tailwind-hsl.js`)}>
				Tailwind (HSL)
			</Button>
			<Button onClick={() => downloadFile(generateSCSS(), `${colorName}-variables.scss`)}>SCSS Variables</Button>
			<Button onClick={() => downloadFile(generateCSSHex(), `${colorName}-variables-hex.css`)}>
				CSS Variables (HEX)
			</Button>
			<Button onClick={() => downloadFile(generateCSSRGB(), `${colorName}-variables-rgb.css`)}>
				CSS Variables (RGB)
			</Button>
			<Button onClick={() => downloadFile(generateSVG(), `${colorName}-palette.svg`)}>SVG (for Figma)</Button>
		</div>
	);
};

export default ExportPalette;
