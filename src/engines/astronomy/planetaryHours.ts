import { Body, Observer, SearchRiseSet } from 'astronomy-engine';

export type TraditionalPlanet =
  | 'saturn' | 'jupiter' | 'mars' | 'sun' | 'venus' | 'mercury' | 'moon';

export type PlanetaryHourNature =
  | 'greater_benefic'
  | 'lesser_benefic'
  | 'greater_malefic'
  | 'lesser_malefic'
  | 'variable';

export interface PlanetaryHour {
  index: number;
  period: 'day' | 'night';
  planet: TraditionalPlanet;
  nature: PlanetaryHourNature;
  start: Date;
  end: Date;
}

export interface PlanetaryHoursForDate {
  localDate: string;
  sunrise: Date;
  sunset: Date;
  nextSunrise: Date;
  hours: PlanetaryHour[];
}

export const CHALDEAN_ORDER: readonly TraditionalPlanet[] = [
  'saturn', 'jupiter', 'mars', 'sun', 'venus', 'mercury', 'moon',
];

export const PLANETARY_NATURE: Record<TraditionalPlanet, PlanetaryHourNature> = {
  saturn: 'greater_malefic',
  jupiter: 'greater_benefic',
  mars: 'lesser_malefic',
  sun: 'variable',
  venus: 'lesser_benefic',
  mercury: 'variable',
  moon: 'variable',
};

const WEEKDAY_RULER_INDEX = [3, 6, 2, 5, 1, 4, 0];

function utcMilliseconds(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0
) {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, second, 0);
  return date.getTime();
}

function parseLocalDate(date: string): { year: number; month: number; day: number } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) throw new Error('Date must use the YYYY-MM-DD format.');

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsed = new Date(utcMilliseconds(year, month, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error('The selected local date is invalid.');
  }
  return { year, month, day };
}

function zonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return {
    year: value('year'),
    month: value('month'),
    day: value('day'),
    hour: value('hour'),
    minute: value('minute'),
    second: value('second'),
  };
}

export function localDateTimeToUtc(localDateTime: string, timeZone: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(localDateTime);
  if (!match) throw new Error('Date and time must use the YYYY-MM-DDTHH:mm format.');

  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const target = {
    year: Number(yearText),
    month: Number(monthText),
    day: Number(dayText),
    hour: Number(hourText),
    minute: Number(minuteText),
  };
  const date = parseLocalDate(
    `${yearText}-${monthText}-${dayText}`
  );
  if (target.hour > 23 || target.minute > 59) {
    throw new Error('The selected local time is invalid.');
  }

  const desiredUtcParts = utcMilliseconds(
    date.year,
    date.month,
    date.day,
    target.hour,
    target.minute
  );
  let timestamp = desiredUtcParts;
  for (let attempt = 0; attempt < 5; attempt++) {
    const observed = zonedParts(new Date(timestamp), timeZone);
    const observedAsUtc = utcMilliseconds(
      observed.year,
      observed.month,
      observed.day,
      observed.hour,
      observed.minute,
      observed.second
    );
    const correction = desiredUtcParts - observedAsUtc;
    if (correction === 0) return new Date(timestamp);
    timestamp += correction;
  }

  throw new Error('The selected local time does not exist in this time zone.');
}

export function formatLocalDateTime(date: Date, timeZone: string): string {
  const parts = zonedParts(date, timeZone);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${String(parts.year).padStart(4, '0')}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function calculatePlanetaryHours(
  localDate: string,
  latitude: number,
  longitude: number,
  timeZone: string
): PlanetaryHoursForDate {
  const { year, month, day } = parseLocalDate(localDate);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error('Observer latitude must be between -90 and 90 degrees.');
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error('Observer longitude must be between -180 and 180 degrees.');
  }
  if (!timeZone) throw new Error('A time zone is required for local planetary hours.');

  const midnight = localDateTimeToUtc(`${localDate}T00:00`, timeZone);
  const observer = new Observer(latitude, longitude, 0);
  const sunriseResult = SearchRiseSet(Body.Sun, observer, 1, midnight, 2);
  if (!sunriseResult) {
    throw new Error('Sunrise is unavailable for this date and location (polar day or night).');
  }

  const sunrise = sunriseResult.date;
  const sunsetResult = SearchRiseSet(
    Body.Sun,
    observer,
    -1,
    new Date(sunrise.getTime() + 1000),
    1
  );
  if (!sunsetResult) {
    throw new Error('Sunset is unavailable for this date and location (polar day or night).');
  }

  const sunset = sunsetResult.date;
  const nextSunriseResult = SearchRiseSet(
    Body.Sun,
    observer,
    1,
    new Date(sunset.getTime() + 1000),
    2
  );
  if (!nextSunriseResult) {
    throw new Error('The following sunrise is unavailable for this date and location.');
  }

  const weekday = new Date(utcMilliseconds(year, month, day, 12)).getUTCDay();
  const dayRulerIndex = WEEKDAY_RULER_INDEX[weekday];
  const dayLength = sunset.getTime() - sunrise.getTime();
  const nightLength = nextSunriseResult.date.getTime() - sunset.getTime();
  if (dayLength <= 0 || nightLength <= 0) {
    throw new Error('Sunrise and sunset could not be ordered for this local date.');
  }

  const hours: PlanetaryHour[] = [];
  for (let index = 0; index < 24; index++) {
    const isDay = index < 12;
    const sectionIndex = isDay ? index : index - 12;
    const sectionStart = isDay ? sunrise : sunset;
    const sectionLength = isDay ? dayLength : nightLength;
    const start = new Date(sectionStart.getTime() + (sectionLength * sectionIndex) / 12);
    const end = new Date(sectionStart.getTime() + (sectionLength * (sectionIndex + 1)) / 12);
    const planet = CHALDEAN_ORDER[(dayRulerIndex + index) % CHALDEAN_ORDER.length];

    hours.push({
      index: index + 1,
      period: isDay ? 'day' : 'night',
      planet,
      nature: PLANETARY_NATURE[planet],
      start,
      end,
    });
  }

  return {
    localDate,
    sunrise,
    sunset,
    nextSunrise: nextSunriseResult.date,
    hours,
  };
}
