import type { City, Province, CityWithProvince } from './types';

let citiesCache: CityWithProvince[] | null = null;
let provincesCache: Province[] | null = null;
let loadPromise: Promise<void> | null = null;

async function loadData(): Promise<void> {
  if (citiesCache && provincesCache) return;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const [citiesRes, provincesRes] = await Promise.all([
      fetch('/data/iran-cities.json'),
      fetch('/data/iran-provinces.json')
    ]);
    const cities: City[] = await citiesRes.json();
    const provinces: Province[] = await provincesRes.json();

    const provinceMap = new Map(provinces.map(p => [p.id, p.name]));

    citiesCache = cities.map(city => ({
      ...city,
      lat: typeof city.lat === 'string' ? parseFloat(city.lat) : city.lat,
      lon: typeof city.lon === 'string' ? parseFloat(city.lon) : city.lon,
      province_name: provinceMap.get(city.province_id) || '',
      timezone: 'Asia/Tehran'
    }));

    provincesCache = provinces;
  })();

  return loadPromise;
}

export async function searchCities(query: string, limit = 15): Promise<CityWithProvince[]> {
  await loadData();
  if (!citiesCache) return [];

  const normalized = normalizePersian(query.trim());
  if (!normalized) {
    return citiesCache.slice(0, limit);
  }

  const results: { city: CityWithProvince; score: number }[] = [];

  for (const city of citiesCache) {
    const cityNorm = normalizePersian(city.name);
    const enNorm = (city.en_name || '').toLowerCase();
    const provNorm = normalizePersian(city.province_name || '');
    const queryLower = query.toLowerCase();

    let score = 0;
    if (cityNorm === normalized) score = 100;
    else if (cityNorm.startsWith(normalized)) score = 80;
    else if (cityNorm.includes(normalized)) score = 60;
    else if (provNorm.includes(normalized)) score = 40;
    else if (enNorm.startsWith(queryLower)) score = 70;
    else if (enNorm.includes(queryLower)) score = 50;

    if (score > 0) results.push({ city, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit).map(r => r.city);
}

export async function getAllCities(): Promise<CityWithProvince[]> {
  await loadData();
  return citiesCache || [];
}

export async function findNearestCity(lat: number, lon: number): Promise<CityWithProvince | null> {
  await loadData();
  if (!citiesCache) return null;

  let nearest: CityWithProvince | null = null;
  let minDist = Infinity;

  for (const city of citiesCache) {
    const dLat = city.lat - lat;
    const dLon = city.lon - lon;
    const dist = dLat * dLat + dLon * dLon;
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }

  return nearest;
}

function normalizePersian(input: string): string {
  return input
    .replace(/[\u064B-\u0652]/g, '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[^\u0600-\u06FF\s]/g, '')
    .trim();
}