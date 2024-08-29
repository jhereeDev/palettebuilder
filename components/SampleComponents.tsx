import React from 'react';
import chroma from 'chroma-js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from 'next-themes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicBlock from './sample/BasicBlock';
import ChartsBlock from './sample/ChartsBlock';

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

			<Tabs defaultValue='basic'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='basic'>Basic Block</TabsTrigger>
					<TabsTrigger value='charts'>Charts Blocks</TabsTrigger>
				</TabsList>
				<TabsContent value='basic'>
					<BasicBlock baseColor={baseColor} secondaryColor={secondaryColor} colorScale={colorScale} />
				</TabsContent>
				<TabsContent value='charts'>
					<ChartsBlock baseColor={baseColor} secondaryColor={secondaryColor} colorScale={colorScale} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default SampleComponents;
