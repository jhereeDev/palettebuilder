import React from 'react';
import chroma from 'chroma-js';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
} from 'recharts';
import { Camera, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';

const ColorTooltip = ({ children, colors }: { children: React.ReactNode; colors: Record<string, string> }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent>
					<div className='text-sm'>
						{Object.entries(colors).map(([name, color]) => (
							<div key={name} className='flex items-center mb-1'>
								<div className='w-4 h-4 mr-2' style={{ backgroundColor: color }}></div>
								<span>
									{name}: {color}
								</span>
							</div>
						))}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

const SampleComponents = ({
	baseColor,
	secondaryColor,
	colorScale,
}: {
	baseColor: string;
	secondaryColor?: string;
	colorScale: Record<string, string>;
}) => {
	const { theme } = useTheme();

	const getContrastColor = (bgColor: string) => {
		return chroma(bgColor).luminance() > 0.5 ? colorScale['900'] : colorScale['50'];
	};

	const chartData = [
		{ name: 'Jan', primary: 4000, secondary: secondaryColor ? 2400 : 0 },
		{ name: 'Feb', primary: 3000, secondary: secondaryColor ? 1398 : 0 },
		{ name: 'Mar', primary: 5000, secondary: secondaryColor ? 3800 : 0 },
		{ name: 'Apr', primary: 4500, secondary: secondaryColor ? 3908 : 0 },
		{ name: 'May', primary: 6000, secondary: secondaryColor ? 4800 : 0 },
		{ name: 'Jun', primary: 5500, secondary: secondaryColor ? 3800 : 0 },
	];

	return (
		<div className='space-y-8'>
			<h2
				className='text-2xl font-bold mb-4'
				style={{ color: theme === 'dark' ? colorScale['100'] : colorScale['800'] }}
			>
				Sample Components
			</h2>

			{/* Cards Row */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{/* Primary Card */}
				<ColorTooltip colors={{ Primary: baseColor, Text: getContrastColor(baseColor) }}>
					<div className='rounded-lg shadow-lg p-6 ' style={{ backgroundColor: baseColor }}>
						<h3 className='text-xl font-semibold mb-2' style={{ color: getContrastColor(baseColor) }}>
							Customers
						</h3>
						<p className='text-3xl font-bold' style={{ color: getContrastColor(baseColor) }}>
							1,553
						</p>
						<p className='text-sm mt-2 opacity-80' style={{ color: getContrastColor(baseColor) }}>
							New customers in past 30 days
						</p>
					</div>
				</ColorTooltip>

				{/* Chart Card */}
				<ColorTooltip colors={{ Primary: baseColor, Secondary: secondaryColor || 'N/A', Background: colorScale['50'] }}>
					<div className='rounded-lg shadow-lg p-6' style={{ backgroundColor: colorScale['50'] }}>
						<h3 className='text-xl font-semibold mb-2' style={{ color: colorScale['800'] }}>
							Revenue
						</h3>
						<p className='text-3xl font-bold mb-4' style={{ color: colorScale['900'] }}>
							$12,543
						</p>
						<div className='h-48'>
							<ResponsiveContainer width='100%' height='100%'>
								<LineChart data={chartData}>
									<CartesianGrid strokeDasharray='3 3' stroke={colorScale['200']} />
									<XAxis dataKey='name' tick={{ fill: colorScale['700'] }} />
									<YAxis tick={{ fill: colorScale['700'] }} />
									<RechartsTooltip />
									<Line type='monotone' dataKey='primary' stroke={baseColor} strokeWidth={2} />
									{secondaryColor && (
										<Line type='monotone' dataKey='secondary' stroke={secondaryColor} strokeWidth={2} />
									)}
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>
				</ColorTooltip>

				{/* Task Card (uses secondary color if available, otherwise uses primary color) */}
				<ColorTooltip
					colors={{ Color: secondaryColor || baseColor, Text: getContrastColor(secondaryColor || baseColor) }}
				>
					<div className='rounded-lg shadow-lg p-6' style={{ backgroundColor: secondaryColor || baseColor }}>
						<h3 className='text-xl font-semibold mb-4' style={{ color: getContrastColor(secondaryColor || baseColor) }}>
							Today&apos;s Tasks
						</h3>
						<div className='space-y-2'>
							{['Design system meeting', 'Lunch', 'Design review'].map((task, index) => (
								<div
									key={index}
									className='p-2 rounded'
									style={{
										backgroundColor: chroma(secondaryColor || baseColor)
											.brighten(1)
											.hex(),
									}}
								>
									<p style={{ color: getContrastColor(secondaryColor || baseColor) }}>{task}</p>
									<p className='text-sm opacity-80' style={{ color: getContrastColor(secondaryColor || baseColor) }}>
										{index === 0 ? '9 - 10 AM' : index === 1 ? '1 - 2 PM' : '3 - 4 PM'}
									</p>
								</div>
							))}
						</div>
					</div>
				</ColorTooltip>
			</div>

			{/* Image Cards Row */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{/* Card 1: Primary overlay */}
				<ColorTooltip colors={{ Primary: baseColor, Overlay: chroma(baseColor).alpha(0.8).css() }}>
					<div className='relative rounded-lg overflow-hidden shadow-lg h-64'>
						<img src='placeholder-1.jpg' alt='Placeholder 1' className='w-full h-full object-cover' />
						<div
							className='absolute inset-0 flex flex-col justify-end p-6'
							style={{ background: `linear-gradient(to top, ${chroma(baseColor).alpha(0.8)}, transparent)` }}
						>
							<Camera className='text-white mb-2' size={24} />
							<h3 className='text-xl font-bold text-white'>Create</h3>
							<p className='text-lg text-white'>Color scales in seconds</p>
						</div>
					</div>
				</ColorTooltip>

				{/* Card 2: Secondary overlay (if available, otherwise use primary) */}
				<ColorTooltip
					colors={{
						Color: secondaryColor || baseColor,
						Overlay: chroma(secondaryColor || baseColor)
							.alpha(0.8)
							.css(),
					}}
				>
					<div className='relative rounded-lg overflow-hidden shadow-lg h-64'>
						<img src='placeholder-2.jpg' alt='Placeholder 2' className='w-full h-full object-cover' />
						<div
							className='absolute inset-0 flex items-center justify-center'
							style={{
								backgroundColor: chroma(secondaryColor || baseColor)
									.alpha(0.8)
									.css(),
							}}
						>
							<div className='text-center'>
								<h3 className='text-2xl font-bold text-white'>Design</h3>
								<p className='text-lg text-white'>Beautiful color palettes</p>
							</div>
						</div>
					</div>
				</ColorTooltip>

				{/* Card 3: Gradient overlay */}
				<ColorTooltip
					colors={{
						Primary: baseColor,
						Secondary: secondaryColor || baseColor,
						Overlay: `linear-gradient(135deg, ${chroma(baseColor).alpha(0.8)}, ${chroma(
							secondaryColor || baseColor
						).alpha(0.8)})`,
					}}
				>
					<div className='relative rounded-lg overflow-hidden shadow-lg h-64'>
						<img src='placeholder-3.jpg' alt='Placeholder 3' className='w-full h-full object-cover' />
						<div
							className='absolute inset-0 flex items-end p-6'
							style={{
								background: `linear-gradient(135deg, ${chroma(baseColor).alpha(0.8)}, ${chroma(
									secondaryColor || baseColor
								).alpha(0.8)})`,
							}}
						>
							<div>
								<h3 className='text-xl font-bold text-white'>Implement</h3>
								<p className='text-lg text-white'>Seamless color integration</p>
							</div>
						</div>
					</div>
				</ColorTooltip>
			</div>

			{/* Buttons Row */}
			<div className='rounded-lg shadow-lg p-6 space-y-4' style={{ backgroundColor: colorScale['100'] }}>
				<h3 className='text-xl font-semibold' style={{ color: colorScale['700'] }}>
					Buttons
				</h3>
				<div className='space-y-4'>
					<div>
						<h4 className='text-lg mb-2 font-semibold' style={{ color: colorScale['600'] }}>
							Primary
						</h4>
						<div className='space-x-2'>
							{['Default', 'Hover', 'Active'].map((label, index) => (
								<ColorTooltip
									key={index}
									colors={{
										Default: baseColor,
										Hover: chroma(baseColor).darken(0.5).hex(),
										Active: chroma(baseColor).darken(1).hex(),
									}}
								>
									<Button
										className='px-4 py-2 rounded'
										style={{
											backgroundColor:
												index === 1
													? chroma(baseColor).darken(0.5).hex()
													: index === 2
													? chroma(baseColor).darken(1).hex()
													: baseColor,
											color: getContrastColor(baseColor),
										}}
									>
										{label}
									</Button>
								</ColorTooltip>
							))}
						</div>
					</div>
					{secondaryColor && (
						<div>
							<h4 className='text-lg mb-2 font-semibold' style={{ color: colorScale['600'] }}>
								Secondary
							</h4>
							<div className='space-x-2'>
								{['Default', 'Hover', 'Active'].map((label, index) => (
									<ColorTooltip
										key={index}
										colors={{
											Default: secondaryColor,
											Hover: chroma(secondaryColor).darken(0.5).hex(),
											Active: chroma(secondaryColor).darken(1).hex(),
										}}
									>
										<Button
											className='px-4 py-2 rounded'
											style={{
												backgroundColor:
													index === 1
														? chroma(secondaryColor).darken(0.5).hex()
														: index === 2
														? chroma(secondaryColor).darken(1).hex()
														: secondaryColor,
												color: getContrastColor(secondaryColor),
											}}
										>
											{label}
										</Button>
									</ColorTooltip>
								))}
							</div>
						</div>
					)}
					<div>
						<h4 className='text-lg mb-2 font-semibold' style={{ color: colorScale['600'] }}>
							Outline
						</h4>
						<div className='space-x-2'>
							{['Primary', 'Secondary'].map((label, index) => (
								<ColorTooltip
									key={index}
									colors={{
										Border: index === 0 ? baseColor : secondaryColor || baseColor,
										Text: index === 0 ? baseColor : secondaryColor || baseColor,
										Background: 'transparent',
									}}
								>
									<Button
										className='px-4 py-2 rounded border-2'
										style={{
											borderColor: index === 0 ? baseColor : secondaryColor || baseColor,
											color: index === 0 ? baseColor : secondaryColor || baseColor,
											backgroundColor: 'transparent',
										}}
									>
										{label}
									</Button>
								</ColorTooltip>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Alert */}
			<div className='space-y-4'>
				<h3
					className='text-xl font-semibold'
					style={{ color: theme === 'dark' ? colorScale['100'] : colorScale['700'] }}
				>
					Alert
				</h3>
				<ColorTooltip colors={{ Background: colorScale['100'], Border: baseColor, Text: colorScale['800'] }}>
					<Alert className='border-l-4' style={{ backgroundColor: colorScale['100'], borderLeftColor: baseColor }}>
						<Camera className='h-4 w-4' style={{ color: baseColor }} />
						<AlertTitle style={{ color: colorScale['900'] }}>Save your custom color scale</AlertTitle>
						<AlertDescription style={{ color: colorScale['800'] }}>
							Your color scale will be lost if you don&apos;t save it before leaving the page.
						</AlertDescription>
					</Alert>
				</ColorTooltip>
			</div>
		</div>
	);
};

export default SampleComponents;
