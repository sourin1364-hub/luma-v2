# setup-calendar-engine.ps1
Write-Host "Building Calendar Engine..." -ForegroundColor Cyan
Set-Location "$env:USERPROFILE\Desktop\luma-v2"

# ---- نصب luxon ----
Write-Host "Installing luxon..." -ForegroundColor Yellow
npm install luxon@3.5.0
npm install --save-dev @types/luxon@3.4.2
if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed!" -ForegroundColor Red; Read-Host "Press Enter"; exit 1 }

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Write-File($path, $content) {
    $dir = Split-Path $path -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    [System.IO.File]::WriteAllText((Join-Path (Get-Location) $path), $content, $utf8NoBom)
    Write-Host "  Created: $path" -ForegroundColor Gray
}

# ---- src/engines/calendar/types.ts ----
Write-File "src\engines\calendar\types.ts" @"
export interface JalaaliDate {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

export interface GregorianDate {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

export interface BirthDateTime {
  jalaali: JalaaliDate;
  hour: number;   // 0-23
  minute: number; // 0-59
  timezone: string; // IANA e.g. 'Asia/Tehran'
  timeUnknown: boolean;
}

export interface MonthInfo {
  index: number; // 1-12
  name: string;
  days: number;
}

export const MONTH_NAMES_FA = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
] as const;
"@

# ---- src/engines/calendar/jalaali.ts ----
Write-File "src\engines\calendar\jalaali.ts" @"
import { toJalaali, toGregorian, isLeapJalaaliYear, jalaaliMonthLength } from 'jalaali-js';
import type { JalaaliDate, GregorianDate, MonthInfo } from './types';
import { MONTH_NAMES_FA } from './types';

export function jalaaliToGregorian(date: JalaaliDate): GregorianDate {
  if (!isValidJalaaliDate(date)) {
    throw new Error(
      `Invalid Jalaali date: \${date.year}/\${date.month}/\${date.day}`
    );
  }
  const g = toGregorian(date.year, date.month, date.day);
  return { year: g.gy, month: g.gm, day: g.gd };
}

export function gregorianToJalaali(date: GregorianDate): JalaaliDate {
  const j = toJalaali(date.year, date.month, date.day);
  return { year: j.jy, month: j.jm, day: j.jd };
}

export function isLeapYear(jalaaliYear: number): boolean {
  return isLeapJalaaliYear(jalaaliYear);
}

export function daysInMonth(jalaaliYear: number, jalaaliMonth: number): number {
  if (jalaaliMonth < 1 || jalaaliMonth > 12) {
    throw new Error(`Month must be 1-12, got \${jalaaliMonth}`);
  }
  return jalaaliMonthLength(jalaaliYear, jalaaliMonth);
}

export function isValidJalaaliDate(date: JalaaliDate): boolean {
  if (!date || typeof date.year !== 'number' || typeof date.month !== 'number' || typeof date.day !== 'number') {
    return false;
  }
  if (date.year < 1200 || date.year > 1700) return false;
  if (date.month < 1 || date.month > 12) return false;
  const maxDays = jalaaliMonthLength(date.year, date.month);
  if (date.day < 1 || date.day > maxDays) return false;
  return true;
}

export function getMonthsOfYear(jalaaliYear: number): MonthInfo[] {
  return MONTH_NAMES_FA.map((name, idx) => ({
    index: idx + 1,
    name,
    days: daysInMonth(jalaaliYear, idx + 1)
  }));
}

export function compareJalaali(a: JalaaliDate, b: JalaaliDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}
"@

# ---- src/engines/calendar/timezone.ts ----
Write-File "src\engines\calendar\timezone.ts" @"
import { DateTime } from 'luxon';
import type { JalaaliDate } from './types';
import { jalaaliToGregorian } from './jalaali';

/**
 * تبدیل تاریخ و ساعت محلی تولد به UTC.
 * از luxon استفاده می‌کند تا DST تاریخی (مثلاً ایران قبل از 1387) درست مدیریت شود.
 */
export function birthToUtc(
  jalaali: JalaaliDate,
  hour: number,
  minute: number,
  timezone: string
): Date {
  const g = jalaaliToGregorian(jalaali);
  const dt = DateTime.fromObject(
    { year: g.year, month: g.month, day: g.day, hour, minute },
    { zone: timezone }
  );
  if (!dt.isValid) {
    throw new Error(\`Invalid local datetime: \${dt.invalidReason}\`);
  }
  return dt.toUTC().toJSDate();
}

export function utcToBirthLocal(
  utcDate: Date,
  timezone: string
): { gregorian: { year: number; month: number; day: number }; hour: number; minute: number } {
  const dt = DateTime.fromJSDate(utcDate, { zone: 'utc' }).setZone(timezone);
  return {
    gregorian: { year: dt.year, month: dt.month, day: dt.day },
    hour: dt.hour,
    minute: dt.minute
  };
}

/**
 * بررسی اینکه آیا یک timezone معتبر است.
 */
export function isValidTimezone(tz: string): boolean {
  try {
    return DateTime.local().setZone(tz).isValid;
  } catch {
    return false;
  }
}
"@

# ---- src/engines/calendar/format.ts ----
Write-File "src\engines\calendar\format.ts" @"
import { MONTH_NAMES_FA } from './types';
import type { JalaaliDate } from './types';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

export function formatJalaaliDate(date: JalaaliDate, opts: { persianDigits?: boolean } = {}): string {
  const { persianDigits = true } = opts;
  const monthName = MONTH_NAMES_FA[date.month - 1] ?? '?';
  const raw = \`\${date.day} \${monthName} \${date.year}\`;
  return persianDigits ? toPersianDigits(raw) : raw;
}

export function formatTime(hour: number, minute: number, opts: { persianDigits?: boolean } = {}): string {
  const { persianDigits = true } = opts;
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  const raw = \`\${hh}:\${mm}\`;
  return persianDigits ? toPersianDigits(raw) : raw;
}
"@

# ---- src/engines/calendar/index.ts ----
Write-File "src\engines\calendar\index.ts" @"
export * from './types';
export * from './jalaali';
export * from './timezone';
export * from './format';

export const CALENDAR_ENGINE_VERSION = '1.0.0';
"@

# ---- تست‌ها ----
Write-File "tests\unit\engines\jalaali.test.ts" @"
import { describe, it, expect } from 'vitest';
import {
  jalaaliToGregorian,
  gregorianToJalaali,
  isLeapYear,
  daysInMonth,
  isValidJalaaliDate,
  getMonthsOfYear,
  compareJalaali
} from '@/engines/calendar/jalaali';

describe('jalaali conversion', () => {
  it('converts 1403/01/01 to 2024/03/20', () => {
    expect(jalaaliToGregorian({ year: 1403, month: 1, day: 1 })).toEqual({
      year: 2024, month: 3, day: 20
    });
  });
  it('converts 2024/03/20 back to 1403/01/01', () => {
    expect(gregorianToJalaali({ year: 2024, month: 3, day: 20 })).toEqual({
      year: 1403, month: 1, day: 1
    });
  });
  it('converts 1402/12/29 to 2024/03/19 (last day of 1402)', () => {
    expect(jalaaliToGregorian({ year: 1402, month: 12, day: 29 })).toEqual({
      year: 2024, month: 3, day: 19
    });
  });
});

describe('leap year', () => {
  it('1403 is leap', () => expect(isLeapYear(1403)).toBe(true));
  it('1402 is not leap', () => expect(isLeapYear(1402)).toBe(false));
  it('1404 is not leap', () => expect(isLeapYear(1404)).toBe(false));
});

describe('daysInMonth', () => {
  it('فروردین has 31 days', () => expect(daysInMonth(1403, 1)).toBe(31));
  it('اردیبهشت has 31 days', () => expect(daysInMonth(1403, 2)).toBe(31));
  it('شهریور has 31 days', () => expect(daysInMonth(1403, 6)).toBe(31));
  it('مهر has 30 days', () => expect(daysInMonth(1403, 7)).toBe(30));
  it('اسفند 1403 (leap) has 30 days', () => expect(daysInMonth(1403, 12)).toBe(30));
  it('اسفند 1402 (not leap) has 29 days', () => expect(daysInMonth(1402, 12)).toBe(29));
});

describe('validation', () => {
  it('rejects 31 اسفند 1402', () => {
    expect(isValidJalaaliDate({ year: 1402, month: 12, day: 30 })).toBe(false);
  });
  it('accepts 30 اسفند 1403', () => {
    expect(isValidJalaaliDate({ year: 1403, month: 12, day: 30 })).toBe(true);
  });
  it('rejects month 13', () => {
    expect(isValidJalaaliDate({ year: 1403, month: 13, day: 1 })).toBe(false);
  });
  it('rejects day 0', () => {
    expect(isValidJalaaliDate({ year: 1403, month: 1, day: 0 })).toBe(false);
  });
});

describe('getMonthsOfYear', () => {
  it('returns 12 months', () => {
    const months = getMonthsOfYear(1403);
    expect(months).toHaveLength(12);
    expect(months[0].name).toBe('فروردین');
    expect(months[11].name).toBe('اسفند');
  });
  it('shows 30 days for اسفند 1403 (leap)', () => {
    const months = getMonthsOfYear(1403);
    expect(months[11].days).toBe(30);
  });
  it('shows 29 days for اسفند 1402 (not leap)', () => {
    const months = getMonthsOfYear(1402);
    expect(months[11].days).toBe(29);
  });
});

describe('compareJalaali', () => {
  it('compares by year', () => {
    expect(compareJalaali({ year: 1402, month: 1, day: 1 }, { year: 1403, month: 1, day: 1 })).toBeLessThan(0);
  });
  it('compares by month if year equal', () => {
    expect(compareJalaali({ year: 1403, month: 1, day: 1 }, { year: 1403, month: 2, day: 1 })).toBeLessThan(0);
  });
  it('compares by day if year and month equal', () => {
    expect(compareJalaali({ year: 1403, month: 1, day: 5 }, { year: 1403, month: 1, day: 10 })).toBeLessThan(0);
  });
  it('returns 0 for equal dates', () => {
    expect(compareJalaali({ year: 1403, month: 1, day: 1 }, { year: 1403, month: 1, day: 1 })).toBe(0);
  });
});
"@

Write-File "tests\unit\engines\timezone.test.ts" @"
import { describe, it, expect } from 'vitest';
import { birthToUtc, utcToBirthLocal, isValidTimezone } from '@/engines/calendar/timezone';

describe('birthToUtc', () => {
  it('converts Tehran local time to UTC correctly', () => {
    const utc = birthToUtc({ year: 1403, month: 1, day: 1 }, 12, 0, 'Asia/Tehran');
    // 12:00 Tehran (UTC+3:30) = 08:30 UTC
    expect(utc.toISOString()).toBe('2024-03-20T08:30:00.000Z');
  });

  it('handles historical DST (Iran had DST before 2022)', () => {
    // 1390/04/01 (2021-06-22) — Iran had DST then (UTC+4:30)
    const utc = birthToUtc({ year: 1390, month: 4, day: 1 }, 12, 0, 'Asia/Tehran');
    expect(utc.toISOString()).toBe('2011-06-22T07:30:00.000Z');
  });

  it('throws on invalid timezone', () => {
    expect(() => birthToUtc({ year: 1403, month: 1, day: 1 }, 12, 0, 'Invalid/Zone')).toThrow();
  });
});

describe('utcToBirthLocal', () => {
  it('converts UTC back to Tehran local', () => {
    const utc = new Date('2024-03-20T08:30:00.000Z');
    const local = utcToBirthLocal(utc, 'Asia/Tehran');
    expect(local.gregorian).toEqual({ year: 2024, month: 3, day: 20 });
    expect(local.hour).toBe(12);
    expect(local.minute).toBe(0);
  });
});

describe('isValidTimezone', () => {
  it('accepts Asia/Tehran', () => expect(isValidTimezone('Asia/Tehran')).toBe(true));
  it('accepts Europe/London', () => expect(isValidTimezone('Europe/London')).toBe(true));
  it('rejects nonsense', () => expect(isValidTimezone('Nonsense/Zone')).toBe(false));
});
"@

Write-File "tests\unit\engines\format.test.ts" @"
import { describe, it, expect } from 'vitest';
import { toPersianDigits, toEnglishDigits, formatJalaaliDate, formatTime } from '@/engines/calendar/format';

describe('digit conversion', () => {
  it('converts to Persian digits', () => {
    expect(toPersianDigits('1403')).toBe('۱۴۰۳');
    expect(toPersianDigits('08:05')).toBe('۰۸:۰۵');
  });
  it('converts back to English digits', () => {
    expect(toEnglishDigits('۱۴۰۳')).toBe('1403');
    expect(toEnglishDigits('۰۸:۰۵')).toBe('08:05');
  });
  it('is reversible', () => {
    const original = '1403/01/01 12:30';
    expect(toEnglishDigits(toPersianDigits(original))).toBe(original);
  });
});

describe('formatJalaaliDate', () => {
  it('formats as "1 فروردین 1403" with Persian digits', () => {
    expect(formatJalaaliDate({ year: 1403, month: 1, day: 1 })).toBe('۱ فروردین ۱۴۰۳');
  });
  it('formats with English digits if requested', () => {
    expect(formatJalaaliDate({ year: 1403, month: 1, day: 1 }, { persianDigits: false })).toBe('1 فروردین 1403');
  });
});

describe('formatTime', () => {
  it('formats 08:05 with Persian digits', () => {
    expect(formatTime(8, 5)).toBe('۰۸:۰۵');
  });
  it('formats 23:59', () => {
    expect(formatTime(23, 59)).toBe('۲۳:۵۹');
  });
  it('formats 00:00', () => {
    expect(formatTime(0, 0)).toBe('۰۰:۰۰');
  });
});
"@

# ---- به‌روزرسانی vitest.config.ts برای alias ----
$vitestConfig = @"
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    include: ['tests/unit/**/*.test.ts']
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
})
"@
[System.IO.File]::WriteAllText((Join-Path (Get-Location) "vitest.config.ts"), $vitestConfig, $utf8NoBom)
Write-Host "  Updated: vitest.config.ts" -ForegroundColor Gray

# ---- اجرای تست‌ها ----
Write-Host "`nRunning tests..." -ForegroundColor Yellow
npm test
if ($LASTEXITCODE -eq 0) {
    Write-Host "`nAll tests passed!" -ForegroundColor Green
    Write-Host "Calendar Engine v1.0.0 is ready." -ForegroundColor Green
} else {
    Write-Host "`nSome tests failed. Check output above." -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to close"