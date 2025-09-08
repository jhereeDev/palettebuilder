// hooks/useSubscription.ts

import { useState } from "react";

export function useSubscription() {
  const [isLoading, setIsLoading] = useState(false);

  // All features are now accessible to all users without authentication
  const isPremium = true;
  const subscriptionTier = "premium";
  const subscriptionStatus = "active";

  return { subscriptionTier, subscriptionStatus, isPremium, isLoading };
}
