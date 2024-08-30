import React from 'react';

interface LoaderProps {
	size?: number;
	color?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 24, color = 'currentColor' }) => {
	return (
		<div
			style={{
				display: 'inline-block',
				width: `${size}px`,
				height: `${size}px`,
				border: `2px solid ${color}`,
				borderRadius: '50%',
				borderTopColor: 'transparent',
				animation: 'spin 1s linear infinite',
			}}
		/>
	);
};

export default Loader;
