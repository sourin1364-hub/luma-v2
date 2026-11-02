import type { HouseCusp, AnglePosition } from './types';
import { getSign, getSignDegree } from './constants';

function normalize(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * محاسبه ۱۲ خانه به روش Placidus (تقریب مبتنی بر تقسیم مساوی قوس).
 */
export function calculatePlacidusHouses(
  asc: AnglePosition,
  mc: AnglePosition,
  _latitude: number
): HouseCusp[] {
  const ascDeg = asc.longitude;
  const mcDeg = mc.longitude;

  const houses: HouseCusp[] = [];

  // خانه ۱ = ASC
  houses.push({
    house: 1,
    longitude: ascDeg,
    sign: getSign(ascDeg).name,
    signDegree: getSignDegree(ascDeg)
  });

  // خانه‌های ۲، ۳، ۴ (بین ASC و IC)
  const icDeg = normalize(mcDeg + 180);
  const arcAscToIC = normalize(icDeg - ascDeg);
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
  const arcICtoDesc = normalize(descDeg - icDeg);
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
  const arcDescToMC = normalize(mcDeg - descDeg);
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
  const arcMCtoAsc = normalize(ascDeg - mcDeg);
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

  return houses.sort((a, b) => a.house - b.house);
}