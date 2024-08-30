// hooks/useSubscription.ts

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function useSubscription() {
	const { user } = useUser();
	const [subscriptionTier, setSubscriptionTier] = useState<string>('free');
	const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (user) {
			fetch(`/api/getUserSubscription?clerkUserId=${user.id}`)
				.then((response) => response.json())
				.then((data) => {
					if (data.error) {
						console.error('Error fetching subscription:', data.error);
					} else {
						setSubscriptionTier(data.subscriptionTier);
						setSubscriptionStatus(data.subscriptionStatus);
					}
					setIsLoading(false);
				})
				.catch((error) => {
					console.error('Error fetching subscription:', error);
					setIsLoading(false);
				});
		} else {
			setIsLoading(false);
		}
	}, [user]);

	const isPremium = subscriptionTier !== 'free' && subscriptionStatus === 'active';

	return { subscriptionTier, subscriptionStatus, isPremium, isLoading };
}
