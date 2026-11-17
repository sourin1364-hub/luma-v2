import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader2, Users, Crown, Shield, Search, Calendar, UserCog, Save, SlidersHorizontal } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import {
  getAllUsers,
  updateUserRole,
  activateSubscription,
  cancelSubscription,
  AdminError,
  type AdminUser,
} from './adminService';
import type { Plan } from '../../hooks/useSubscription';
import { useLanguageStore, UI_TRANSLATIONS, type TranslationKey } from '../../i18n/useLanguageStore';
import type { AppLanguage } from '../../i18n/useLanguageStore';
import { ResearchArticleAdmin } from '../research/ResearchArticleAdmin';
import { getSiteSettings, updateSiteSettings, DEFAULT_SITE_SETTINGS, type SiteSettings } from '../subscription/siteSettingsService';

interface AdminScreenProps {
  onBack: () => void;
}

function formatDate(iso: string | null, lang: AppLanguage): string {
  if (!iso) return '—';
  const locale = lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar-SA' : lang === 'ckb' ? 'ckb-IQ' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

export function AdminScreen({ onBack }: AdminScreenProps) {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];
  const currentUser = useAuthStore((s) => s.user);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDays, setSelectedDays] = useState<number>(30);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pricingForm, setPricingForm] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingMsg, setPricingMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    const list = await getAllUsers();
    setUsers(list);
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsers();
    getSiteSettings().then(setPricingForm);
  }, []);

  const handleSavePricing = async () => {
    setPricingSaving(true);
    setPricingMsg(null);
    try {
      await updateSiteSettings(pricingForm);
      setPricingMsg({ type: 'success', text: 'تعرفه‌ها و تخفیف‌ها ذخیره شد و هم‌زمان در اپ و وب‌سایت اعمال گردید.' });
    } catch (err) {
      setPricingMsg({ type: 'error', text: err instanceof Error ? err.message : 'خطا در ذخیره تعرفه‌ها' });
    } finally {
      setPricingSaving(false);
    }
  };

  const handleActivate = async (userId: string, plan: Plan, days: number) => {
    setActionLoading(userId);
    setMessage(null);
    try {
      await activateSubscription(userId, plan, days);
      const planName = t[`admin_plan_${plan}` as TranslationKey];
      setMessage({
        type: 'success',
        text: t['admin_msg_activated']
          .replace('{0}', planName)
          .replace('{1}', String(days)),
      });
      await loadUsers();
    } catch (err) {
      const errMsg = err instanceof AdminError ? t[err.key as TranslationKey] : (err instanceof Error ? err.message : t['admin_msg_error']);
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (userId: string) => {
    if (!confirm(t['admin_confirm_cancel'])) return;
    setActionLoading(userId);
    setMessage(null);
    try {
      await cancelSubscription(userId);
      setMessage({ type: 'success', text: t['admin_msg_canceled'] });
      await loadUsers();
    } catch (err) {
      const errMsg = err instanceof AdminError ? t[err.key as TranslationKey] : (err instanceof Error ? err.message : t['admin_msg_error']);
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleRole = async (user: AdminUser) => {
    if (user.id === currentUser?.id) {
      setMessage({ type: 'error', text: t['admin_err_self_role'] });
      return;
    }
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    setActionLoading(user.id);
    try {
      await updateUserRole(user.id, newRole);
      setMessage({ type: 'success', text: t['admin_msg_role_changed'] });
      await loadUsers();
    } catch (err) {
      const errMsg = err instanceof AdminError ? t[err.key as TranslationKey] : (err instanceof Error ? err.message : t['admin_msg_error']);
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      u.displayName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    premium: users.filter((u) => u.plan === 'premium').length,
    pro: users.filter((u) => u.plan === 'pro').length,
  };

  return (
    <div className="space-y-5 pb-24">
      <PageHeader title={t['admin_title']} subtitle={t['admin_subtitle']} onBack={onBack} />

            <ResearchArticleAdmin />

      <Card variant="elevated" padding="sm" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--luma-gold)]" />
            <h3 className="text-sm font-bold text-[var(--luma-text)]">مدیریت تعرفه‌ها و تخفیف‌ها (اپ + وب‌سایت)</h3>
          </div>
          <Button variant="primary" size="sm" onClick={handleSavePricing} disabled={pricingSaving}>
            {pricingSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span className="mr-1">ذخیره سراسری</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <label className="space-y-1">
            <span className="text-[10px] text-[var(--luma-text-muted)]">پریمیوم ماهانه (تومان)</span>
            <input
              type="number"
              value={pricingForm.monthly_premium}
              onChange={(e) => setPricingForm((p) => ({ ...p, monthly_premium: Number(e.target.value) || 0 }))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)]"
              dir="ltr"
            />
          </label>
          <label className="space-y-1">
            <span className="text-[10px] text-[var(--luma-text-muted)]">پرو ماهانه (تومان)</span>
            <input
              type="number"
              value={pricingForm.monthly_pro}
              onChange={(e) => setPricingForm((p) => ({ ...p, monthly_pro: Number(e.target.value) || 0 }))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)]"
              dir="ltr"
            />
          </label>
          <label className="space-y-1">
            <span className="text-[10px] text-[var(--luma-text-muted)]">تخفیف سه‌ماهه (%)</span>
            <input
              type="number"
              value={pricingForm.discount_quarterly}
              onChange={(e) => setPricingForm((p) => ({ ...p, discount_quarterly: Number(e.target.value) || 0 }))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)]"
              dir="ltr"
            />
          </label>
          <label className="space-y-1">
            <span className="text-[10px] text-[var(--luma-text-muted)]">تخفیف شش‌ماهه (%)</span>
            <input
              type="number"
              value={pricingForm.discount_semiannual}
              onChange={(e) => setPricingForm((p) => ({ ...p, discount_semiannual: Number(e.target.value) || 0 }))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)]"
              dir="ltr"
            />
          </label>
          <label className="space-y-1">
            <span className="text-[10px] text-[var(--luma-text-muted)]">تخفیف سالیانه (%)</span>
            <input
              type="number"
              value={pricingForm.discount_annual}
              onChange={(e) => setPricingForm((p) => ({ ...p, discount_annual: Number(e.target.value) || 0 }))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)]"
              dir="ltr"
            />
          </label>
          <label className="space-y-1">
            <span className="text-[10px] text-[var(--luma-text-muted)]">تخفیف تمدید (%)</span>
            <input
              type="number"
              value={pricingForm.renewal_discount}
              onChange={(e) => setPricingForm((p) => ({ ...p, renewal_discount: Number(e.target.value) || 0 }))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)]"
              dir="ltr"
            />
          </label>
        </div>

        {pricingMsg && (
          <div className={'p-2 rounded-lg text-xs text-center ' + (pricingMsg.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400')}>
            {pricingMsg.text}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-4 gap-2">
        <Card variant="elevated" padding="sm" className="text-center">
          <Users className="w-4 h-4 text-[var(--luma-gold)] mx-auto mb-1" />
          <p className="text-lg font-bold text-[var(--luma-text)]">{stats.total}</p>
          <p className="text-[9px] text-[var(--luma-text-muted)]">{t['admin_stat_users']}</p>
        </Card>
        <Card variant="elevated" padding="sm" className="text-center">
          <Shield className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-[var(--luma-text)]">{stats.admins}</p>
          <p className="text-[9px] text-[var(--luma-text-muted)]">{t['admin_stat_admins']}</p>
        </Card>
        <Card variant="elevated" padding="sm" className="text-center">
          <Crown className="w-4 h-4 text-slate-300 mx-auto mb-1" />
          <p className="text-lg font-bold text-[var(--luma-text)]">{stats.premium}</p>
          <p className="text-[9px] text-[var(--luma-text-muted)]">{t['admin_stat_premium']}</p>
        </Card>
        <Card variant="elevated" padding="sm" className="text-center">
          <Crown className="w-4 h-4 text-[var(--luma-gold)] mx-auto mb-1" />
          <p className="text-lg font-bold text-[var(--luma-text)]">{stats.pro}</p>
          <p className="text-[9px] text-[var(--luma-text-muted)]">{t['admin_stat_pro']}</p>
        </Card>
      </div>

      {/* انتخاب مدت زمان اعطای اشتراک توسط ادمین */}
      <Card variant="elevated" padding="sm">
        <p className="text-xs text-[var(--luma-text-muted)] mb-2">{t['admin_duration_title']}</p>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { days: 30, label: t['admin_duration_1m'] },
            { days: 90, label: t['admin_duration_3m'] },
            { days: 180, label: t['admin_duration_6m'] },
            { days: 365, label: t['admin_duration_1y'] },
          ].map((item) => (
            <button
              key={item.days}
              type="button"
              onClick={() => setSelectedDays(item.days)}
              className={
                'py-1.5 rounded-lg text-xs font-medium border transition-all ' +
                (selectedDays === item.days
                  ? 'bg-[var(--luma-gold)]/20 border-[var(--luma-gold)] text-[var(--luma-gold)]'
                  : 'bg-[var(--luma-bg-subtle)] border-[var(--luma-border)] text-[var(--luma-text-muted)]')
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t['admin_search_ph']}
          className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] text-sm"
        />
      </div>

      {message && (
        <div
          className={
            'p-2 rounded-lg text-xs text-center ' +
            (message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400')
          }
        >
          {message.text}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-[var(--luma-gold)] animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((u) => (
            <Card key={u.id} variant="elevated" padding="sm">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-sm font-medium text-[var(--luma-text)] truncate">
                      {u.displayName || u.username || t['common_user_fallback']}
                    </p>
                    {u.role === 'admin' && (
                      <Shield className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--luma-text-muted)] truncate">@{u.username}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className={'w-3 h-3 ' + (u.plan === 'pro' ? 'text-[var(--luma-gold)]' : u.plan === 'premium' ? 'text-slate-300' : 'text-[var(--luma-text-muted)]')} />
                    <span className={'text-[10px] ' + (u.plan === 'pro' ? 'text-[var(--luma-gold)]' : u.plan === 'premium' ? 'text-slate-300' : 'text-[var(--luma-text-muted)]')}>
                      {t[`admin_plan_${u.plan}` as TranslationKey]}
                    </span>
                    {u.plan !== 'free' && (
                      <>
                        <span className="text-[10px] text-[var(--luma-text-subtle)]">•</span>
                        <Calendar className="w-3 h-3 text-[var(--luma-text-muted)]" />
                        <span className="text-[10px] text-[var(--luma-text-muted)]">
                          {formatDate(u.subscriptionUntil, lang)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleRole(u)}
                  disabled={actionLoading === u.id || u.id === currentUser?.id}
                  className="p-1.5 rounded-lg hover:bg-[var(--luma-bg-subtle)] disabled:opacity-30"
                  title={u.role === 'admin' ? t['admin_tooltip_remove_admin'] : t['admin_tooltip_make_admin']}
                >
                  <UserCog
                    className={
                      'w-4 h-4 ' +
                      (u.role === 'admin' ? 'text-amber-400' : 'text-[var(--luma-text-muted)]')
                    }
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-1 pt-2 border-t border-[var(--luma-border)]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleActivate(u.id, 'premium', selectedDays)}
                  disabled={actionLoading === u.id}
                >
                  {actionLoading === u.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    t['admin_btn_premium_days'].replace('{0}', String(selectedDays))
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleActivate(u.id, 'pro', selectedDays)}
                  disabled={actionLoading === u.id}
                >
                  {t['admin_btn_pro_days'].replace('{0}', String(selectedDays))}
                </Button>
                {u.plan !== 'free' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancel(u.id)}
                    disabled={actionLoading === u.id}
                    className="text-red-400"
                  >
                    {t['admin_btn_cancel_sub']}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}