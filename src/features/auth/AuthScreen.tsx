import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Mail, Lock, User, ArrowLeft, Loader2, CheckCircle2, KeyRound } from 'lucide-react';
import { signIn, signUp, sendOtp, verifyOtp, resetPassword } from './authService';
import { useAuthStore } from '../../store/useAuthStore';

type Mode = 'signin' | 'signup' | 'otp-request' | 'otp-verify' | 'reset';

export function AuthScreen() {
  const setUser = useAuthStore((s) => s.setUser);
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setError(null);
    setSuccess(null);
    setPassword('');
    setOtpCode('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const user = await signIn({ email, password });
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ورود');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const user = await signUp({ email, password, username });
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ثبت‌نام');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('لطفاً ایمیل خود را وارد کنید');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await sendOtp(email);
      setOtpEmail(email);
      setMode('otp-verify');
      setSuccess('کد ۶ رقمی به ایمیل شما ارسال شد. صندوق ورودی یا اسپم را بررسی کنید.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ارسال کد');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const user = await verifyOtp(otpEmail, otpCode);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'کد نامعتبر است');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await resetPassword(email);
      setSuccess('لینک بازیابی رمز عبور به ایمیل شما ارسال شد.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ارسال لینک');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--luma-bg)] text-[var(--luma-text)] flex flex-col items-center justify-center px-5 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
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
                    ? 'bg-[var(--luma-gold)] text-[#0B0D1A] shadow-glow-gold-sm'
                    : 'text-[var(--luma-text-muted)]')
                }
              >
                ورود
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
                    ? 'bg-[var(--luma-gold)] text-[#0B0D1A] shadow-glow-gold-sm'
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
                  : handleReset
              }
              className="space-y-3"
            >
              {mode === 'otp-request' && (
                <div className="text-center mb-3">
                  <KeyRound className="w-6 h-6 text-[var(--luma-gold)] mx-auto mb-2" />
                  <h3 className="font-heading text-base text-[var(--luma-text)]">ورود با کد یکبارمصرف</h3>
                  <p className="text-xs text-[var(--luma-text-muted)] mt-1">
                    ایمیل خود را وارد کنید تا کد ۶ رقمی برایتان ارسال شود
                  </p>
                </div>
              )}

              {mode === 'otp-verify' && (
                <div className="text-center mb-3">
                  <KeyRound className="w-6 h-6 text-[var(--luma-gold)] mx-auto mb-2" />
                  <h3 className="font-heading text-base text-[var(--luma-text)]">کد تأیید را وارد کنید</h3>
                  <p className="text-xs text-[var(--luma-text-muted)] mt-1">
                    کد به {otpEmail} ارسال شد
                  </p>
                </div>
              )}

              {mode === 'reset' && (
                <div className="text-center mb-3">
                  <Lock className="w-6 h-6 text-[var(--luma-gold)] mx-auto mb-2" />
                  <h3 className="font-heading text-base text-[var(--luma-text)]">بازیابی رمز عبور</h3>
                  <p className="text-xs text-[var(--luma-text-muted)] mt-1">ایمیل خود را وارد کنید</p>
                </div>
              )}

              {mode === 'signup' && (
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="نام نمایشی یا کاربری"
                    required
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] transition-colors text-sm"
                  />
                </div>
              )}

              {mode !== 'otp-verify' && (
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ایمیل"
                    required
                    dir="ltr"
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] transition-colors text-sm text-left"
                  />
                </div>
              )}

              {(mode === 'signin' || mode === 'signup') && (
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="رمز عبور (حداقل ۶ کاراکتر)"
                    required
                    minLength={6}
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] transition-colors text-sm"
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
                    pattern="[0-9]{6}"
                    maxLength={6}
                    dir="ltr"
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] transition-colors text-center text-2xl tracking-[0.5em] font-mono"
                  />
                </div>
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

              <Button type="submit" variant="gold" fullWidth size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    در حال پردازش...
                  </>
                ) : mode === 'signin' ? (
                  'ورود به حساب'
                ) : mode === 'signup' ? (
                  'ایجاد حساب کاربری'
                ) : mode === 'otp-request' ? (
                  'ارسال کد یکبارمصرف'
                ) : mode === 'otp-verify' ? (
                  'تأیید و ورود'
                ) : (
                  'ارسال لینک بازیابی'
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
                      ورود با کد یکبارمصرف (بدون رمز)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('reset');
                        resetForm();
                      }}
                      className="text-xs text-[var(--luma-text-muted)] hover:text-[var(--luma-text)]"
                    >
                      رمز عبور را فراموش کرده‌اید؟
                    </button>
                  </>
                )}
                {(mode === 'otp-request' || mode === 'otp-verify' || mode === 'reset') && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      resetForm();
                    }}
                    className="text-xs text-[var(--luma-text-muted)] hover:text-[var(--luma-text)] flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    بازگشت به صفحه ورود
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
