import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';

interface AvatarPickerProps {
  currentUrl: string | null;
  onSelect: (file: File) => Promise<void>;
  isLoading?: boolean;
}

// ۱۲ آواتار پیش‌فرض (با ایموجی به‌عنوان نمونه - بعداً می‌توان با تصاویر واقعی جایگزین کرد)
const PRESET_AVATARS = [
  '🌙', '⭐', '☀️', '🌊', '🔥', '🌿',
  '🦋', '🌸', '💎', '🔮', '🌌', '✨'
];

export function AvatarPicker({ currentUrl, onSelect, isLoading = false }: AvatarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('حجم تصویر نباید بیشتر از ۲ مگابایت باشد');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('فقط فایل‌های تصویری مجاز هستند');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    await onSelect(file);
    setIsOpen(false);
  };

  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index);
    // برای MVP، آواتارهای پیش‌فرض را فعلاً فقط نشان می‌دهیم
    // در نسخه بعد، این‌ها را به‌عنوان SVG ذخیره می‌کنیم
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center">
      {/* آواتار فعلی */}
      <div className="relative">
        <div
          className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--luma-gold)]/40 bg-[var(--luma-bg-subtle)] flex items-center justify-center"
        >
          {currentUrl ? (
            <img src={currentUrl} alt="آواتار" className="w-full h-full object-cover" />
          ) : previewUrl ? (
            <img src={previewUrl} alt="پیش‌نمایش" className="w-full h-full object-cover" />
          ) : selectedPreset !== null ? (
            <span className="text-4xl">{PRESET_AVATARS[selectedPreset]}</span>
          ) : (
            <span className="text-4xl text-[var(--luma-text-subtle)]">👤</span>
          )}
        </div>
        <button
          onClick={() => setIsOpen(true)}
          disabled={isLoading}
          className="absolute bottom-0 left-0 p-1.5 rounded-full bg-[var(--luma-gold)] text-[#0B0D1A] shadow-glow-gold-sm hover:shadow-glow-gold transition-shadow disabled:opacity-50"
          aria-label="تغییر آواتار"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* دیالوگ انتخاب */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-[var(--luma-bg-elevated)] rounded-2xl p-5 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-base text-[var(--luma-text)]">انتخاب آواتار</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-[var(--luma-bg-subtle)]"
                aria-label="بستن"
              >
                <X className="w-4 h-4 text-[var(--luma-text-muted)]" />
              </button>
            </div>

            {/* آپلود تصویر */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--luma-gold)] text-[#0B0D1A] font-medium hover:bg-[var(--luma-gold-light)] transition-colors mb-4"
            >
              <Upload className="w-4 h-4" />
              آپلود تصویر از دستگاه
            </button>

            {/* آواتارهای پیش‌فرض */}
            <div className="mb-3">
              <p className="text-xs text-[var(--luma-text-muted)] mb-2">یا از آواتارهای پیش‌فرض انتخاب کنید:</p>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetSelect(index)}
                    className={
                      'aspect-square rounded-xl bg-[var(--luma-bg-subtle)] flex items-center justify-center text-2xl transition-all hover:scale-110 ' +
                      (selectedPreset === index ? 'ring-2 ring-[var(--luma-gold)]' : '')
                    }
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-[var(--luma-text-subtle)] text-center">
              حداکثر حجم تصویر: ۲ مگابایت
            </p>
          </div>
        </div>
      )}
    </div>
  );
}