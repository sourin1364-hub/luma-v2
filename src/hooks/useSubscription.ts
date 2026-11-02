import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

export type Plan = 'free' | 'premium' | 'pro';

export interface SubscriptionState {
  plan: Plan;
  isAdmin: boolean;
  isActive: boolean;
  isPremium: boolean;
  isPro: boolean;
  expiresAt: string | null;
  isLoading: boolean;
}

const PREMIUM_SPREADS = ['celtic-cross', 'horseshoe', 'relationship', 'career', 'yearly'];

export function useSubscription() {
  const user = useAuthStore((s) => s.user);
  const [state, setState] = useState<SubscriptionState>({
    plan: 'free',
    isAdmin: false,
    isActive: false,
    isPremium: false,
    isPro: false,
    expiresAt: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!user) {
      setState((s) => ({ ...s, isLoading: false }));
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, plan, subscription_until')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !data) {
        setState((s) => ({ ...s, isLoading: false }));
        return;
      }

      const plan: Plan = (data.plan as Plan) || 'free';
      const role = data.role || 'user';
      const expiresAt = data.subscription_until || null;
      const isAdmin = role === 'admin';
      const isActive = isAdmin || (expiresAt ? new Date(expiresAt) > new Date() : false);

      setState({
        plan,
        isAdmin,
        isActive,
        isPremium: isAdmin || (isActive && (plan === 'premium' || plan === 'pro')),
        isPro: isAdmin || (isActive && plan === 'pro'),
        expiresAt,
        isLoading: false,
      });
    })();
  }, [user]);

  return {
    ...state,
    canUseSpread: (spreadId: string) => {
      if (!PREMIUM_SPREADS.includes(spreadId)) return true;
      return state.isPremium;
    },
    canUseSynthesis: () => state.isPremium,
  };
}