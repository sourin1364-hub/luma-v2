import { useLanguageStore, UI_TRANSLATIONS, type AppLanguage } from '../../i18n/useLanguageStore';
import { formatNum } from '../../i18n/format';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SecurityCaptcha } from '../../components/ui/SecurityCaptcha';
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  KeyRound,
  CreditCard,
  ShieldAlert,
} from 'lucide-react';
import {
  signIn,
  signUp,
  sendOtp,
  verifyOtp,
  resetPassword,
  sendSmsResetCode,
  updatePassword,
  checkPasswordResetQuota,
  MAX_FREE_PASSWORD_RESETS,
  SMS_RECOVERY_FEE_TOMAN,
  AuthError,
  type PasswordResetQuotaStatus,
} from './authService';
import { verifySmsOtpCode } from '../../utils/smsService';
import { useAuthStore } from '../../store/useAuthStore';

type Mode = 'signin' | 'signup' | 'otp-request' | 'otp-verify' | 'reset' | 'update-password';

export function AuthScreen() {
  const setUser = useAuthStore((s) => s.setUser);
  const { lang, setLang, dir } = useLanguageStore();
  const t = UI_TRANSLATIONS[lang];

  const getErrMsg = (err: unknown, fallback: string) => {
    if (err instanceof AuthError) return t[err.key] || err.message;
    return err instanceof Error ? err.message : t[fallback];
  };
  const [mode, setMode] = useState<Mode>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset_password') === '1') return 'update-password';
    return 'signin';
  });

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [resetMethod, setResetMethod] = useState<'email' | 'sms'>('email');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [quotaStatus, setQuotaStatus] = useState<PasswordResetQuotaStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isNumericPhone = (val: string) => /^[0-9+]+$/.test(val.trim());

  useEffect(() => {
    if (mode === 'reset' && (email.trim() || phone.trim())) {
      checkPasswordResetQuota(email.trim() || phone.trim()).then(setQuotaStatus);
    }
  }, [mode, email, phone]);

  const resetForm = () => {
    setError(null);
    setSuccess(null);
    setPassword('');
    setConfirmNewPassword('');
    setOtpCode('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaValid) {
      setError(t['auth_captcha_invalid']);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const user = await signIn({ email, password });
      setUser(user);
    } catch (err) {
      setError(getErrMsg(err, 'auth_err_signin'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaValid) {
      setError(t['auth_captcha_invalid']);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const user = await signUp({ email, password, username, phone });
      setUser(user);
    } catch (err) {
      setError(getErrMsg(err, 'auth_err_unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaValid) {
      setError(t['auth_captcha_otp']);
      return;
    }
    if (!email.trim()) {
      setError(t['auth_err_email_required']);
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      setResetMethod('email');
      setPhone('');
      await sendOtp(email);
      setOtpEmail(email);
      setMode('otp-verify');
      setSuccess(t['auth_success_otp_sent']);
    } catch (err) {
      setError(getErrMsg(err, 'auth_err_otp_send'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (resetMethod === 'sms' && phone.trim()) {
        const isSmsValid = await verifySmsOtpCode(phone, otpCode, 'password-reset');
        if (!isSmsValid) {
          throw new AuthError('auth_err_invalid_otp', 'کد پیامکی واردشده نامعتبر است یا منقضی شده است.');
        }
        setSuccess(t['auth_success_sms_verified']);
        setMode('update-password');
        return;
      }
      const user = await verifyOtp(otpEmail, otpCode);
      setUser(user);
    } catch (err) {
      setError(getErrMsg(err, 'auth_err_invalid_otp'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaValid) {
      setError(t['auth_captcha_invalid']);
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (resetMethod === 'sms') {
        const res = await sendSmsResetCode(phone, email);
        if (res.sent) {
          setOtpEmail(email);
          setMode('otp-verify');
          setSuccess(t['auth_success_sms_reset_sent']);
        } else {
          setError(t['auth_err_sms_provider_error']);
        }
      } else {
        await resetPassword(email);
        setSuccess(t['auth_success_reset_email_sent']);
      }
      const updatedQuota = await checkPasswordResetQuota(email.trim() || phone.trim());
      setQuotaStatus(updatedQuota);
    } catch (err) {
      setError(getErrMsg(err, 'auth_err_reset'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaySmsRecoveryFee = () => {
    setError(t['auth_err_sms_payment_unavailable']);
  };

  const handleUpdatePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmNewPassword) {
      setError(t['auth_err_password_mismatch']);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await updatePassword(password);
      setSuccess(t['auth_success_password_updated']);
      setTimeout(() => {
        setMode('signin');
        resetForm();
      }, 1500);
    } catch (err) {
      setError(getErrMsg(err, 'auth_err_update_pw'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="min-h-screen bg-[var(--luma-bg)] text-[var(--luma-text)] flex flex-col items-center justify-center px-5 py-8">
      <div className="mb-4 flex items-center gap-1.5 p-1 rounded-full bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)]">
        {(
          [
            { id: 'fa', label: 'فارسی (شمسی)' },
            { id: 'ckb', label: 'کوردی (شمسی)' },
            { id: 'ar', label: 'العربية (قمري)' },
            { id: 'en', label: 'English (AD)' },
          ] as { id: AppLanguage; label: string }[]
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLang(item.id)}
            className={
              'px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ' +
              (lang === item.id
                ? 'bg-[var(--luma-gold)] text-[#0B0D1A]'
                : 'text-[var(--luma-text-muted)] hover:text-[var(--luma-text)]')
            }
          >
            {item.label}
          </button>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Logo size="lg" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-sm"
      >
        <Card variant="elevated" padding="lg">
          {(mode === 'signin' || mode === 'signup') && (
            <div className="flex bg-[var(--luma-bg-subtle)] rounded-xl p-1 mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  resetForm();
                }}
                className={
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all ' +
                  (mode === 'signin'
                    ? 'bg-[var(--luma-gold)] text-[#0B0D1A] shadow-glow-gold-sm font-bold'
                    : 'text-[var(--luma-text-muted)]')
                }
              >
                {t['auth_tab_signin']}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  resetForm();
                }}
                className={
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all ' +
                  (mode === 'signup'
                    ? 'bg-[var(--luma-gold)] text-[#0B0D1A] shadow-glow-gold-sm font-bold'
                    : 'text-[var(--luma-text-muted)]')
                }
              >
                ثبت‌نام
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={
                mode === 'signin'
                  ? handleSignIn
                  : mode === 'signup'
                  ? handleSignUp
                  : mode === 'otp-request'
                  ? handleSendOtp
                  : mode === 'otp-verify'
                  ? handleVerifyOtp
                  : mode === 'update-password'
                  ? handleUpdatePasswordSubmit
                  : handleReset
              }
              className="space-y-3"
            >
              {mode === 'reset' && (
                <div className="space-y-3 mb-2">
                  <div className="text-center">
                    <Lock className="w-6 h-6 text-[var(--luma-gold)] mx-auto mb-1.5" />
                    <h3 className="font-heading text-base text-[var(--luma-text)]">
                      {t['auth_reset_title']}
                    </h3>
                    <p className="text-[11px] text-[var(--luma-text-muted)] mt-0.5">
                      {t['auth_reset_subtitle_prefix']}{' '}
                      {formatNum(MAX_FREE_PASSWORD_RESETS, lang)} {t['auth_reset_subtitle_suffix']}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[var(--luma-bg-subtle)]">
                    <button
                      type="button"
                      onClick={() => setResetMethod('sms')}
                      className={
                        'py-1.5 rounded-lg text-xs font-medium transition-all ' +
                        (resetMethod === 'sms'
                          ? 'bg-[var(--luma-gold)] text-[#0B0D1A] font-bold'
                          : 'text-[var(--luma-text-muted)]')
                      }
                    >
                      {t['auth_reset_method_sms']}
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetMethod('email')}
                      className={
                        'py-1.5 rounded-lg text-xs font-medium transition-all ' +
                        (resetMethod === 'email'
                          ? 'bg-[var(--luma-gold)] text-[#0B0D1A] font-bold'
                          : 'text-[var(--luma-text-muted)]')
                      }
                    >
                      {t['auth_reset_method_email']}
                    </button>
                  </div>

                  {quotaStatus && (
                    <div
                      className={
                        'p-2.5 rounded-xl border text-[11px] text-center ' +
                        (quotaStatus.requiresSmsFeePayment
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400')
                      }
                    >
                      {quotaStatus.isUnlimitedSubscription ? (
                        <span>{t['auth_quota_unlimited']}</span>
                      ) : quotaStatus.requiresSmsFeePayment ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-1 font-bold">
                            <ShieldAlert className="w-4 h-4" />
                            <span>{t['auth_quota_exhausted_title']}</span>
                          </div>
                          <p className="text-[10px] text-[var(--luma-text-muted)]">
                            {t['auth_quota_exhausted_desc_prefix']}{formatNum(SMS_RECOVERY_FEE_TOMAN.toLocaleString('en-US'), lang)} {t['auth_currency_toman']}{t['auth_quota_exhausted_desc_suffix']}
                          </p>
                          <Button
                            type="button"
                            variant="gold"
                            size="sm"
                            fullWidth
                            onClick={handlePaySmsRecoveryFee}
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            {t['auth_quota_pay_btn_prefix']}{formatNum(SMS_RECOVERY_FEE_TOMAN.toLocaleString('en-US'), lang)} {t['auth_currency_toman']}{t['auth_quota_pay_btn_suffix']}
                          </Button>
                        </div>
                      ) : (
                        <span>
                          {t['auth_quota_remaining_prefix']}{' '}
                          <b>{formatNum(quotaStatus.remainingFree, lang)}</b> {t['auth_quota_remaining_mid']}{' '}
                          {formatNum(MAX_FREE_PASSWORD_RESETS, lang)} {t['auth_quota_remaining_suffix']}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {mode === 'update-password' && (
                <div className="text-center mb-3">
                  <KeyRound className="w-6 h-6 text-[var(--luma-gold)] mx-auto mb-2" />
                  <h3 className="font-heading text-base text-[var(--luma-text)]">{t['auth_update_pw_title']}</h3>
                  <p className="text-xs text-[var(--luma-text-muted)] mt-1">
                    {t['auth_update_pw_subtitle']}
                  </p>
                </div>
              )}

              {mode === 'signup' && (
                <>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={t['auth_ph_username']}
                      required
                      className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-sm focus:outline-none focus:border-[var(--luma-gold)]"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t['auth_ph_phone_recovery']}
                      dir="ltr"
                      className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-sm text-left focus:outline-none focus:border-[var(--luma-gold)]"
                    />
                  </div>
                </>
              )}

              {mode === 'reset' && resetMethod === 'sms' && (
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t['auth_ph_phone_example']}
                    required
                    dir="ltr"
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-sm text-left focus:outline-none focus:border-[var(--luma-gold)]"
                  />
                </div>
              )}

              {mode !== 'otp-verify' && mode !== 'update-password' && !(mode === 'reset' && resetMethod === 'sms') && (
                <div className="relative">
                  {isNumericPhone(email) ? (
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-gold)]" />
                  ) : (
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
                  )}
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t['auth_ph_email_or_phone']}
                    required
                    dir="ltr"
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-sm text-left focus:outline-none focus:border-[var(--luma-gold)]"
                  />
                </div>
              )}

              {(mode === 'signin' || mode === 'signup' || mode === 'update-password') && (
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'update-password' ? t['auth_ph_new_password_hint'] : t['auth_ph_password']}
                    required
                    minLength={6}
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-sm focus:outline-none focus:border-[var(--luma-gold)]"
                  />
                </div>
              )}

              {mode === 'update-password' && (
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder={t['auth_ph_confirm_password']}
                    required
                    minLength={6}
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-sm focus:outline-none focus:border-[var(--luma-gold)]"
                  />
                </div>
              )}

              {mode === 'otp-verify' && (
                <div className="relative">
                  <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="------"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    dir="ltr"
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-center text-2xl tracking-[0.5em] font-mono"
                  />
                </div>
              )}

              {(mode === 'signin' || mode === 'signup' || mode === 'reset' || mode === 'otp-request') && (
                <SecurityCaptcha onVerify={setCaptchaValid} />
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-xs text-red-400 text-center leading-relaxed">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-400 leading-relaxed">{success}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="gold"
                fullWidth
                size="lg"
                disabled={isLoading || (mode === 'reset' && !!quotaStatus?.requiresSmsFeePayment)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t['auth_btn_processing']}
                  </>
                ) : mode === 'signin' ? (
                  t['auth_btn_signin']
                ) : mode === 'signup' ? (
                  t['auth_btn_signup']
                ) : mode === 'otp-request' ? (
                  t['auth_btn_otp_send']
                ) : mode === 'otp-verify' ? (
                  t['auth_btn_otp_verify']
                ) : mode === 'update-password' ? (
                  t['auth_btn_update_pw']
                ) : resetMethod === 'sms' ? (
                  t['auth_btn_sms_reset']
                ) : (
                  t['auth_btn_email_reset']
                )}
              </Button>

              <div className="flex flex-col gap-2 pt-2 text-center">
                {mode === 'signin' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('otp-request');
                        resetForm();
                      }}
                      className="text-xs text-[var(--luma-gold)] hover:underline"
                    >
                      {t['auth_link_otp_signin']}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('reset');
                        resetForm();
                      }}
                      className="text-xs text-[var(--luma-text-muted)] hover:text-[var(--luma-text)]"
                    >
                      {t['auth_link_forgot_pw']}
                    </button>
                  </>
                )}
                {mode !== 'signin' && mode !== 'signup' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      resetForm();
                    }}
                    className="text-xs text-[var(--luma-text-muted)] hover:text-[var(--luma-text)] flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    {t['auth_link_back_to_signin']}
                  </button>
                )}
              </div>
            </motion.form>
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}