import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { useLanguageStore, UI_TRANSLATIONS } from '../../i18n/useLanguageStore';
import { formatNum } from '../../i18n/format';

interface SecurityCaptchaProps {
  onVerify: (isValid: boolean) => void;
}

export function SecurityCaptcha({ onVerify }: SecurityCaptchaProps) {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const generateChallenge = useCallback(() => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    setNum1(a);
    setNum2(b);
    setUserInput('');
    setIsVerified(false);
    onVerify(false);
  }, [onVerify]);

  useEffect(() => {
    generateChallenge();
  }, [generateChallenge]);

  const handleChange = (val: string) => {
    // تبدیل اعداد فارسی/عربی به انگلیسی در صورت تایپ فارسی
    const normalized = val
      .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
      .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
      .replace(/\D/g, '');

    setUserInput(normalized);
    const valid = parseInt(normalized, 10) === num1 + num2;
    setIsVerified(valid);
    onVerify(valid);
  };

  return (
    <div className="p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[var(--luma-text-muted)] flex items-center gap-1.5">
          <ShieldCheck className={'w-4 h-4 ' + (isVerified ? 'text-emerald-400' : 'text-[var(--luma-gold)]')} />
          {t['captcha_title']}
        </span>
        <button
          type="button"
          onClick={generateChallenge}
          className="p-1 rounded-lg hover:bg-[var(--luma-bg-elevated)] text-[var(--luma-text-muted)] hover:text-[var(--luma-gold)] transition-colors"
          title={t['captcha_refresh_title']}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="px-4 py-2 rounded-lg bg-[var(--luma-bg-elevated)] border border-[var(--luma-gold)]/40 select-none font-mono text-sm font-bold tracking-widest text-[var(--luma-gold)]"
          style={{
            backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.18) 1px, transparent 0)',
            backgroundSize: '8px 8px',
          }}
        >
          {formatNum(num1, lang)} + {formatNum(num2, lang)} = {t['captcha_question_mark']}
        </div>

        <input
          type="text"
          inputMode="numeric"
          value={userInput}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={t['captcha_placeholder']}
          maxLength={3}
          dir="ltr"
          className={
            'flex-1 px-3 py-2 rounded-lg bg-[var(--luma-bg-elevated)] border text-center text-sm font-bold focus:outline-none transition-colors ' +
            (isVerified
              ? 'border-emerald-500 text-emerald-400'
              : 'border-[var(--luma-border)] text-[var(--luma-text)] focus:border-[var(--luma-gold)]')
          }
        />
      </div>
    </div>
  );
}