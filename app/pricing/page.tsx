'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

const initialOptions = {
	clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
	currency: 'USD',
	intent: 'capture',
	dataClientId: {
		user_id_token: false,
		client_token: false,
		partner_attribution_id: false,
		sandbox: false,
	},
	'enable-funding': 'paylater,venmo',
	'disable-funding': 'card,credit',
	components: 'buttons',
};

export default function PricingPage() {
	const { isLoaded, isSignedIn, user } = useUser();
	const [isLoading, setIsLoading] = useState(false);
	const [scriptError, setScriptError] = useState<string | null>(null);
	const [currentPlan, setCurrentPlan] = useState<string>('free');
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			router.push('/');
		} else if (isLoaded && isSignedIn && user) {
			// Fetch current subscription status
			fetch(`/api/getUserSubscription?clerkUserId=${user.id}`)
				.then((response) => response.json())
				.then((data) => {
					setCurrentPlan(data.subscriptionTier);
				})
				.catch((error) => console.error('Error fetching subscription:', error));
		}
	}, [isLoaded, isSignedIn, user, router]);

	const createOrder = async (plan: 'monthly' | 'yearly') => {
		if (!isSignedIn || !user) {
			toast({
				variant: 'destructive',
				title: 'Authentication required',
				description: 'Please sign in to subscribe to a plan.',
			});
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch('/api/create-paypal-order', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					plan,
					clerkUserId: user.id,
				}),
			});
			const order = await response.json();
			return order.id;
		} catch (error) {
			console.error('Error:', error);
			toast({
				variant: 'destructive',
				title: 'Error creating order',
				description: 'There was a problem creating your order. Please try again.',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const onApprove = async (data: any) => {
		if (!isSignedIn || !user) {
			toast({
				variant: 'destructive',
				title: 'Authentication required',
				description: 'Please sign in to complete your subscription.',
			});
			return;
		}

		try {
			const response = await fetch('/api/capture-paypal-order', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					orderID: data.orderID,
					clerkUserId: user.id,
				}),
			});
			const orderData = await response.json();
			if (orderData.status === 'COMPLETED') {
				setCurrentPlan(orderData.subscriptionTier);
				toast({
					title: 'Payment successful',
					description: `Your ${orderData.subscriptionTier} subscription has been activated.`,
				});
				router.push('/subscription-success');
			} else if (orderData.error === 'INSTRUMENT_DECLINED') {
				toast({
					variant: 'destructive',
					title: 'Payment declined',
					description: 'Your payment method was declined. Please try a different payment method.',
				});
			} else if (orderData.error === 'USER_NOT_FOUND') {
				toast({
					variant: 'destructive',
					title: 'User not found',
					description: 'There was an issue with your account. Please contact support.',
				});
			} else {
				throw new Error('Payment not successful');
			}
		} catch (error) {
			console.error('Error:', error);
			toast({
				variant: 'destructive',
				title: 'Error processing payment',
				description: 'There was a problem processing your payment. Please try again.',
			});
		}
	};

	const handleScriptError = (error: any) => {
		setScriptError(error.message);
	};

	if (!isLoaded || !isSignedIn) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<Loader size={48} color='#3B82F6' /> {/* Adjust size and color as needed */}
			</div>
		);
	}

	return (
		<PayPalScriptProvider options={initialOptions}>
			<div className='container mx-auto px-4 py-8'>
				<h1 className='text-3xl font-bold mb-8'>Choose Your Plan</h1>
				<p className='mb-4'>
					Current Plan: <strong>{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</strong>
				</p>
				{scriptError && (
					<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4' role='alert'>
						<strong className='font-bold'>Error:</strong>
						<span className='block sm:inline'> {scriptError}</span>
					</div>
				)}
				<div className='grid md:grid-cols-3 gap-8'>
					{/* Free plan */}
					<div className='border rounded-lg p-6'>
						<h2 className='text-2xl font-semibold mb-4'>Free</h2>
						<ul className='mb-6'>
							<li>Save 1 color palette</li>
							<li>Basic export options (CSS variables only)</li>
							<li>Limited features (no editing, no contrast grid)</li>
							<li>1 export per account</li>
						</ul>
						<p className='text-2xl font-bold mb-4'>$0/month</p>
						<button className='w-full bg-gray-200 text-gray-800 py-2 rounded' disabled>
							{currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
						</button>
					</div>
					{/* Monthly plan */}
					<div className='border rounded-lg p-6'>
						<h2 className='text-2xl font-semibold mb-4'>Monthly</h2>
						<ul className='mb-6'>
							<li>Unlimited color palettes</li>
							<li>All export options</li>
							<li>Full feature access</li>
						</ul>
						<p className='text-2xl font-bold mb-4'>$5/month</p>
						{currentPlan !== 'monthly' && (
							<PayPalButtons
								createOrder={() => createOrder('monthly')}
								onApprove={onApprove}
								style={{ layout: 'vertical' }}
								disabled={isLoading}
								onError={handleScriptError}
							/>
						)}
						{currentPlan === 'monthly' && (
							<button className='w-full bg-green-500 text-white py-2 rounded' disabled>
								Current Plan
							</button>
						)}
					</div>
					{/* Yearly plan */}
					<div className='border rounded-lg p-6'>
						<h2 className='text-2xl font-semibold mb-4'>Yearly</h2>
						<ul className='mb-6'>
							<li>Unlimited color palettes</li>
							<li>All export options</li>
							<li>Full feature access</li>
							<li>2 months free</li>
						</ul>
						<p className='text-2xl font-bold mb-4'>$50/year</p>
						{currentPlan !== 'yearly' && (
							<PayPalButtons
								createOrder={() => createOrder('yearly')}
								onApprove={onApprove}
								style={{ layout: 'vertical' }}
								disabled={isLoading}
								onError={handleScriptError}
							/>
						)}
						{currentPlan === 'yearly' && (
							<button className='w-full bg-green-500 text-white py-2 rounded' disabled>
								Current Plan
							</button>
						)}
					</div>
				</div>
			</div>
		</PayPalScriptProvider>
	);
}
