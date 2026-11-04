import type { CityWithProvince } from './types';

let citiesCache: CityWithProvince[] | null = null;
let provincesCache: any[] | null = null;

/**
 * دریافت لیست استان‌ها از فایل JSON
 */
export async function getProvinces(): Promise<any[]> {
  if (provincesCache) return provincesCache;
  
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/iran-provinces.json`);
    if (!response.ok) throw new Error('Failed to fetch provinces');
    const data = await response.json();
    provincesCache = data;
    return data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
}

/**
 * دریافت لیست کامل شهرها از فایل JSON
 * همچنین مختصات را به عدد تبدیل می‌کند و نام استان را اضافه می‌کند
 */
export async function getAllCities(): Promise<CityWithProvince[]> {
  if (citiesCache) return citiesCache;
  
  try {
    const [citiesRes, provincesRes] = await Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/iran-cities.json`),
      fetch(`${import.meta.env.BASE_URL}data/iran-provinces.json`)
    ]);
    
    if (!citiesRes.ok || !provincesRes.ok) throw new Error('Failed to fetch data');
    
    const rawCities = await citiesRes.json();
    const provinces = await provincesRes.json();
    
    // ساخت نقشه استان‌ها
    const provinceMap: Record<number, string> = {};
    provinces.forEach((p: any) => {
      provinceMap[p.id] = p.name;
    });
    
    // تبدیل داده‌های خام به CityWithProvince
    const processedCities: CityWithProvince[] = rawCities.map((city: any) => ({
      id: Number(city.id),
      name: city.name,
      en_name: city.en_name || '',
      province_id: Number(city.province_id),
      province_name: provinceMap[Number(city.province_id)] || '',
      lat: parseFloat(String(city.lat)),
      lon: parseFloat(String(city.lon)),
      timezone: 'Asia/Tehran',
    }));
    
    citiesCache = processedCities;
    return processedCities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

/**
 * جستجوی شهرها بر اساس نام
 */
export async function searchCities(query: string, limit: number = 10): Promise<CityWithProvince[]> {
  const cities = await getAllCities();
  const normalizedQuery = query.trim().toLowerCase();
  
  if (!normalizedQuery) return [];
  
  return cities
    .filter(city => 
      city.name.toLowerCase().includes(normalizedQuery) ||
      city.en_name?.toLowerCase().includes(normalizedQuery) ||
      city.province_name?.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, limit);
}

/**
 * پیدا کردن نزدیک‌ترین شهر به مختصات داده‌شده
 */
export async function findNearestCity(lat: number, lon: number): Promise<CityWithProvince | null> {
  const cities = await getAllCities();
  if (cities.length === 0) return null;

  let nearest: CityWithProvince | null = null;
  let minDistance = Infinity;

  for (const city of cities) {
    const distance = Math.sqrt(
      Math.pow(city.lat - lat, 2) + 
      Math.pow(city.lon - lon, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }

  return nearest;
}
