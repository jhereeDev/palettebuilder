// hooks/useSubscription.ts

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function useSubscription() {
	const { user } = useUser();
	const [isLoading, setIsLoading] = useState(false);

	// All features are now accessible to all users
	const isPremium = true;
	const subscriptionTier = 'premium';
	const subscriptionStatus = 'active';

	return { subscriptionTier, subscriptionStatus, isPremium, isLoading };
}
