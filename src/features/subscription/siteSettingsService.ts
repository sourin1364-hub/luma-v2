import { supabase } from '../../lib/supabase';

export interface SiteSettings {
  monthly_premium: number;
  monthly_pro: number;
  discount_quarterly: number;
  discount_semiannual: number;
  discount_annual: number;
  renewal_discount: number;
  announcement_active: boolean;
  announcement_text: string;
  updated_at?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  monthly_premium: 199000,
  monthly_pro: 299000,
  discount_quarterly: 15,
  discount_semiannual: 25,
  discount_annual: 40,
  renewal_discount: 10,
  announcement_active: true,
  announcement_text:
    'تمامی تراکنش‌ها از طریق درگاه‌های رسمی شبکه شاپرک انجام شده و بلافاصله پس از پرداخت، اشتراک حساب کاربری شما فعال می‌گردد.',
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select(
        'monthly_premium, monthly_pro, discount_quarterly, discount_semiannual, discount_annual, renewal_discount, announcement_active, announcement_text, updated_at'
      )
      .eq('id', 'default')
      .maybeSingle();

    if (error || !data) {
      if (error) console.warn('Could not load site_settings, using defaults:', error.message);
      return DEFAULT_SITE_SETTINGS;
    }

    return {
      monthly_premium: Number(data.monthly_premium ?? DEFAULT_SITE_SETTINGS.monthly_premium),
      monthly_pro: Number(data.monthly_pro ?? DEFAULT_SITE_SETTINGS.monthly_pro),
      discount_quarterly: Number(data.discount_quarterly ?? DEFAULT_SITE_SETTINGS.discount_quarterly),
      discount_semiannual: Number(data.discount_semiannual ?? DEFAULT_SITE_SETTINGS.discount_semiannual),
      discount_annual: Number(data.discount_annual ?? DEFAULT_SITE_SETTINGS.discount_annual),
      renewal_discount: Number(data.renewal_discount ?? DEFAULT_SITE_SETTINGS.renewal_discount),
      announcement_active: Boolean(data.announcement_active ?? true),
      announcement_text: String(data.announcement_text ?? DEFAULT_SITE_SETTINGS.announcement_text),
      updated_at: data.updated_at,
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSettings(
  settings: Omit<SiteSettings, 'updated_at'>
): Promise<void> {
  const { error } = await supabase
    .from('site_settings')
    .upsert(
      {
        id: 'default',
        monthly_premium: Math.max(0, Math.round(settings.monthly_premium)),
        monthly_pro: Math.max(0, Math.round(settings.monthly_pro)),
        discount_quarterly: Math.min(95, Math.max(0, Math.round(settings.discount_quarterly))),
        discount_semiannual: Math.min(95, Math.max(0, Math.round(settings.discount_semiannual))),
        discount_annual: Math.min(95, Math.max(0, Math.round(settings.discount_annual))),
        renewal_discount: Math.min(95, Math.max(0, Math.round(settings.renewal_discount))),
        announcement_active: settings.announcement_active,
        announcement_text: settings.announcement_text.trim(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (error) {
    throw new Error(error.message);
  }
}