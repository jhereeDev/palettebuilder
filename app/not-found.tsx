// app/not-found.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen space-y-4  '>
			<h1 className='text-4xl font-bold'>404 - Page Not Found</h1>
			<p className='text-xl'>Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
			<Button asChild>
				<Link href='/'>Go back to Home</Link>
			</Button>
		</div>
	);
}
