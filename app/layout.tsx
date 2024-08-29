import type { Metadata } from 'next';
import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/common/theme-provider';
import { cn } from '@/lib/utils';
import { neobrutalism } from '@clerk/themes';
import Navbar from '@/components/Navbar';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata: Metadata = {
	title: 'Palette Builder',
	description: 'Color palette generator and theme builder for Tailwind CSS and React applications with TypeScript.',
	keywords:
		'color, palette, generator, theme, builder, tailwind, css, react, typescript, hueforge, chroma-js, nextjs, next.js, vercel, zeit, zeit.co, now.sh, now, font, inter, google, fonts, latin',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider appearance={{ baseTheme: neobrutalism }}>
			<html lang='en' suppressHydrationWarning>
				<body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
					<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
						{' '}
						<Navbar />
						{children}
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
