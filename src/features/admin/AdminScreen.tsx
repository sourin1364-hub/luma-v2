import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader2, Users, Crown, Shield, Search, Calendar, UserCog } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import {
  getAllUsers,
  updateUserRole,
  activateSubscription,
  cancelSubscription,
  type AdminUser,
} from './adminService';
import type { Plan } from '../../hooks/useSubscription';

interface AdminScreenProps {
  onBack: () => void;
}

const PLAN_LABELS: Record<Plan, string> = {
  free: 'رایگان',
  premium: 'پریمیوم',
  pro: 'حرفه‌ای',
};

const PLAN_COLORS: Record<Plan, string> = {
  free: 'text-[var(--luma-text-muted)]',
  premium: 'text-slate-300',
  pro: 'text-[var(--luma-gold)]',
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

export function AdminScreen({ onBack }: AdminScreenProps) {
  const currentUser = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDays, setSelectedDays] = useState<number>(30);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    const list = await getAllUsers();
    setUsers(list);
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleActivate = async (userId: string, plan: Plan, days: number) => {
    setActionLoading(userId);
    setMessage(null);
    try {
      await activateSubscription(userId, plan, days);
      setMessage({
        type: 'success',
        text: `اشتراک ${PLAN_LABELS[plan]} به مدت ${days} روز فعال شد`,
      });
      await loadUsers();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'خطا' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (userId: string) => {
    if (!confirm('اشتراک این کاربر لغو شود؟')) return;
    setActionLoading(userId);
    setMessage(null);
    try {
      await cancelSubscription(userId);
      setMessage({ type: 'success', text: 'اشتراک لغو شد' });
      await loadUsers();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'خطا' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleRole = async (user: AdminUser) => {
    if (user.id === currentUser?.id) {
      setMessage({ type: 'error', text: 'نمی‌توانید نقش خودتان را تغییر دهید' });
      return;
    }
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    setActionLoading(user.id);
    try {
      await updateUserRole(user.id, newRole);
      setMessage({ type: 'success', text: 'نقش کاربر تغییر کرد' });
      await loadUsers();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'خطا' });
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
      <PageHeader title="پنل مدیریت" subtitle="مدیریت کاربران و اشتراک‌ها" onBack={onBack} />

      <div className="grid grid-cols-4 gap-2">
        <Card variant="elevated" padding="sm" className="text-center">
          <Users className="w-4 h-4 text-[var(--luma-gold)] mx-auto mb-1" />
          <p className="text-lg font-bold text-[var(--luma-text)]">{stats.total}</p>
          <p className="text-[9px] text-[var(--luma-text-muted)]">کاربر</p>
        </Card>
        <Card variant="elevated" padding="sm" className="text-center">
          <Shield className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-[var(--luma-text)]">{stats.admins}</p>
          <p className="text-[9px] text-[var(--luma-text-muted)]">ادمین</p>
        </Card>
        <Card variant="elevated" padding="sm" className="text-center">
          <Crown className="w-4 h-4 text-slate-300 mx-auto mb-1" />
          <p className="text-lg font-bold text-[var(--luma-text)]">{stats.premium}</p>
          <p className="text-[9px] text-[var(--luma-text-muted)]">پریمیوم</p>
        </Card>
        <Card variant="elevated" padding="sm" className="text-center">
          <Crown className="w-4 h-4 text-[var(--luma-gold)] mx-auto mb-1" />
          <p className="text-lg font-bold text-[var(--luma-text)]">{stats.pro}</p>
          <p className="text-[9px] text-[var(--luma-text-muted)]">حرفه‌ای</p>
        </Card>
      </div>

      {/* انتخاب مدت زمان اعطای اشتراک توسط ادمین */}
      <Card variant="elevated" padding="sm">
        <p className="text-xs text-[var(--luma-text-muted)] mb-2">مدت فعال‌سازی دستی اشتراک:</p>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { days: 30, label: '۱ ماهه' },
            { days: 90, label: '۳ ماهه' },
            { days: 180, label: '۶ ماهه' },
            { days: 365, label: '۱ ساله' },
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
          placeholder="جستجوی کاربر..."
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
                      {u.displayName || u.username || 'کاربر'}
                    </p>
                    {u.role === 'admin' && (
                      <Shield className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--luma-text-muted)] truncate">@{u.username}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className={'w-3 h-3 ' + PLAN_COLORS[u.plan]} />
                    <span className={'text-[10px] ' + PLAN_COLORS[u.plan]}>
                      {PLAN_LABELS[u.plan]}
                    </span>
                    {u.plan !== 'free' && (
                      <>
                        <span className="text-[10px] text-[var(--luma-text-subtle)]">•</span>
                        <Calendar className="w-3 h-3 text-[var(--luma-text-muted)]" />
                        <span className="text-[10px] text-[var(--luma-text-muted)]">
                          {formatDate(u.subscriptionUntil)}
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
                  title={u.role === 'admin' ? 'حذف ادمین' : 'ارتقا به ادمین'}
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
                    `پریمیوم (${selectedDays} روز)`
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleActivate(u.id, 'pro', selectedDays)}
                  disabled={actionLoading === u.id}
                >
                  {`حرفه‌ای (${selectedDays} روز)`}
                </Button>
                {u.plan !== 'free' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancel(u.id)}
                    disabled={actionLoading === u.id}
                    className="text-red-400"
                  >
                    لغو اشتراک
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
