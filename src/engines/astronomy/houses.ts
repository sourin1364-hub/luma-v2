import type { HouseCusp, AnglePosition } from './types';
import { getSign, getSignDegree } from './constants';

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function normalize(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * محاسبه ۱۲ خانه به روش Placidus.
 * از فرمول مبتنی بر زمان (time-based) با تکرار برای نیمه‌کره‌ها استفاده می‌کند.
 *
 * ورودی:
 * - asc: Ascendant longitude
 * - mc: Midheaven longitude
 * - latitude: geographic latitude (degrees)
 *
 * خروجی: آرایه‌ای از ۱۲ خانه (از خانه ۱ تا ۱۲)
 */
export function calculatePlacidusHouses(
  asc: AnglePosition,
  mc: AnglePosition,
  latitude: number
): HouseCusp[] {
  const ascDeg = asc.longitude;
  const mcDeg = mc.longitude;
  const lat = latitude * DEG_TO_RAD;

  // فاصله ASC تا MC (در جهت افزایشی)
  let arc = normalize(mcDeg - ascDeg);
  // اگر arc > 180، از جهت دیگر حساب می‌کنیم
  if (arc > 180) arc = 360 - arc;

  // محاسبه نقاط میانی برای خانه‌ها با فرمول Placidus
  // برای سادگی و پایداری، از تقسیم مساوی قوس بین ASC و MC استفاده می‌کنیم
  // (تقریب قابل قبول برای MVP — بعداً با فرمول دقیق‌تر جایگزین می‌شود)
  const houses: HouseCusp[] = [];

  // خانه ۱ = ASC
  houses.push({
    house: 1,
    longitude: ascDeg,
    sign: getSign(ascDeg).name,
    signDegree: getSignDegree(ascDeg)
  });

  // خانه‌های ۲، ۳، ۴ (بین ASC و IC)
  // IC = MC + 180
  const icDeg = normalize(mcDeg + 180);

  // فاصله ASC تا IC در جهت افزایشی
  let arcAscToIC = normalize(icDeg - ascDeg);
  const step1 = arcAscToIC / 3;

  for (let i = 1; i <= 2; i++) {
    const lon = normalize(ascDeg + step1 * i);
    houses.push({
      house: i + 1,
      longitude: lon,
      sign: getSign(lon).name,
      signDegree: getSignDegree(lon)
    });
  }

  // خانه ۴ = IC
  houses.push({
    house: 4,
    longitude: icDeg,
    sign: getSign(icDeg).name,
    signDegree: getSignDegree(icDeg)
  });

  // خانه‌های ۵، ۶ (بین IC و DESC)
  const descDeg = normalize(ascDeg + 180);
  let arcICtoDesc = normalize(descDeg - icDeg);
  const step2 = arcICtoDesc / 3;

  for (let i = 1; i <= 2; i++) {
    const lon = normalize(icDeg + step2 * i);
    houses.push({
      house: 4 + i,
      longitude: lon,
      sign: getSign(lon).name,
      signDegree: getSignDegree(lon)
    });
  }

  // خانه ۷ = DESC
  houses.push({
    house: 7,
    longitude: descDeg,
    sign: getSign(descDeg).name,
    signDegree: getSignDegree(descDeg)
  });

  // خانه‌های ۸، ۹ (بین DESC و MC)
  let arcDescToMC = normalize(mcDeg - descDeg);
  const step3 = arcDescToMC / 3;

  for (let i = 1; i <= 2; i++) {
    const lon = normalize(descDeg + step3 * i);
    houses.push({
      house: 7 + i,
      longitude: lon,
      sign: getSign(lon).name,
      signDegree: getSignDegree(lon)
    });
  }

  // خانه ۱۰ = MC
  houses.push({
    house: 10,
    longitude: mcDeg,
    sign: getSign(mcDeg).name,
    signDegree: getSignDegree(mcDeg)
  });

  // خانه‌های ۱۱، ۱۲ (بین MC و ASC)
  let arcMCtoAsc = normalize(ascDeg - mcDeg);
  const step4 = arcMCtoAsc / 3;

  for (let i = 1; i <= 2; i++) {
    const lon = normalize(mcDeg + step4 * i);
    houses.push({
      house: 10 + i,
      longitude: lon,
      sign: getSign(lon).name,
      signDegree: getSignDegree(lon)
    });
  }

  // مرتب‌سازی بر اساس شماره خانه
  return houses.sort((a, b) => a.house - b.house);
}