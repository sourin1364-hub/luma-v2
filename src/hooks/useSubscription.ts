import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

export type Plan = 'free' | 'premium' | 'pro';
export type BillingCycle = 'monthly' | 'quarterly' | 'semiannual' | 'annual';

export interface SubscriptionState {
  plan: Plan;
  isAdmin: boolean;
  isActive: boolean;
  isPremium: boolean;
  isPro: boolean;
  expiresAt: string | null;
  daysRemaining: number;
  isLoading: boolean;
  error: string | null;
}

// چیدمان‌های نیازمند حداقل پلن پریمیوم (شامل هفتگی، ماهانه، عشق، شغل، نعل اسب)
const PREMIUM_SPREADS = ['weekly', 'monthly', 'horseshoe', 'relationship', 'career'];
// چیدمان‌های ویژه پلن حرفه‌ای (Pro)
const PRO_SPREADS = ['celtic-cross', 'yearly'];

export function useSubscription() {
  const user = useAuthStore((s) => s.user);
  const [state, setState] = useState<SubscriptionState>({
    plan: 'free',
    isAdmin: false,
    isActive: false,
    isPremium: false,
    isPro: false,
    expiresAt: null,
    daysRemaining: 0,
    isLoading: true,
    error: null,
  });

  const refreshSubscription = useCallback(async () => {
    if (!user) {
      setState({
        plan: 'free',
        isAdmin: false,
        isActive: false,
        isPremium: false,
        isPro: false,
        expiresAt: null,
        daysRemaining: 0,
        isLoading: false,
        error: null,
      });
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !data) {
        if (error) console.error('Subscription profile lookup failed:', error);
        setState((s) => ({
          ...s,
          isLoading: false,
          error: 'subscription_load_failed',
        }));
        return;
      }

      const rawPlan: Plan = ((data.plan && data.plan !== 'free' ? data.plan : data.tier) as Plan) || 'free';
      const role = data.role || 'user';
      const expiresAt = data.subscription_until || data.subscription_expires_at || null;
      const isAdmin = role === 'admin';

      const now = new Date();
      const expDate = expiresAt ? new Date(expiresAt) : null;
      const isNotExpired = expDate ? expDate > now : false;
      const daysRemaining =
        expDate && isNotExpired
          ? Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          : 0;

      const isActive = isAdmin || (rawPlan !== 'free' && isNotExpired);
      const effectivePlan: Plan = isAdmin ? 'pro' : isActive ? rawPlan : 'free';

      setState({
        plan: effectivePlan,
        isAdmin,
        isActive,
        isPremium: isAdmin || (isActive && (rawPlan === 'premium' || rawPlan === 'pro')),
        isPro: isAdmin || (isActive && rawPlan === 'pro'),
        expiresAt,
        daysRemaining,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      console.error('Subscription check error:', e);
      setState((s) => ({
        ...s,
        isLoading: false,
        error: 'subscription_load_failed',
      }));
    }
  }, [user]);

  useEffect(() => {
    refreshSubscription();
    window.addEventListener('luma:subscription-updated', refreshSubscription);
    return () => window.removeEventListener('luma:subscription-updated', refreshSubscription);
  }, [refreshSubscription]);

  const canUseSpread = (spreadId: string): boolean => {
    if (state.isAdmin) return true;
    if (state.isLoading || state.error) {
      return !PRO_SPREADS.includes(spreadId) && !PREMIUM_SPREADS.includes(spreadId);
    }
    if (PRO_SPREADS.includes(spreadId)) {
      return state.isPro;
    }
    if (PREMIUM_SPREADS.includes(spreadId)) {
      return state.isPremium;
    }
    return true;
  };

  const getRequiredPlanForSpread = (spreadId: string): Plan => {
    if (PRO_SPREADS.includes(spreadId)) return 'pro';
    if (PREMIUM_SPREADS.includes(spreadId)) return 'premium';
    return 'free';
  };

  return {
    ...state,
    refreshSubscription,
    canUseSpread,
    getRequiredPlanForSpread,
    canUseSynthesis: () => !state.isLoading && !state.error && (state.isAdmin || state.isPremium),
    canUseSynastry: () => !state.isLoading && !state.error && (state.isAdmin || state.isPremium),
    canUseAdvancedNumerology: () => !state.isLoading && !state.error && (state.isAdmin || state.isPremium),
    canUseYearlyForecast: () => !state.isLoading && !state.error && (state.isAdmin || state.isPro),
  };
}

