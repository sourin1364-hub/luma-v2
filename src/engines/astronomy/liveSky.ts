import { Body, Equator, Horizon, Observer } from 'astronomy-engine';
import type { PlanetName } from './types';

export interface CelestialPosition {
  id: string;
  name: string;
  kind: 'planet' | 'star';
  azimuth: number;
  altitude: number;
  magnitude: number;
  color: string;
}

interface Star {
  id: string;
  ra: number;
  dec: number;
  magnitude: number;
  color: string;
}

const PLANET_BODIES: Record<PlanetName, Body> = {
  sun: Body.Sun,
  moon: Body.Moon,
  mercury: Body.Mercury,
  venus: Body.Venus,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
  uranus: Body.Uranus,
  neptune: Body.Neptune,
  pluto: Body.Pluto,
};

const PLANETS: { id: PlanetName; magnitude: number; color: string }[] = [
  { id: 'sun', magnitude: -26.7, color: '#FFD36B' },
  { id: 'moon', magnitude: -12.7, color: '#E8F0FF' },
  { id: 'mercury', magnitude: -0.4, color: '#B6C5D6' },
  { id: 'venus', magnitude: -4.4, color: '#FFE0B2' },
  { id: 'mars', magnitude: -2.0, color: '#FF806B' },
  { id: 'jupiter', magnitude: -2.7, color: '#F6D6A8' },
  { id: 'saturn', magnitude: 0.2, color: '#E8C98A' },
  { id: 'uranus', magnitude: 5.7, color: '#8DE7E7' },
  { id: 'neptune', magnitude: 7.8, color: '#9BAAFF' },
  { id: 'pluto', magnitude: 14.0, color: '#C6A7E8' },
];

const BRIGHT_STARS: Star[] = [
  { id: 'Polaris', ra: 2.5303, dec: 89.2641, magnitude: 1.98, color: '#DCEBFF' },
  { id: 'Sirius', ra: 6.7525, dec: -16.7161, magnitude: -1.46, color: '#D9E8FF' },
  { id: 'Canopus', ra: 6.3992, dec: -52.6957, magnitude: -0.74, color: '#FFF2D8' },
  { id: 'Arcturus', ra: 14.261, dec: 19.1824, magnitude: -0.05, color: '#FFD3A1' },
  { id: 'Vega', ra: 18.6156, dec: 38.7837, magnitude: 0.03, color: '#DDEBFF' },
  { id: 'Capella', ra: 5.2782, dec: 45.998, magnitude: 0.08, color: '#FFE2B5' },
  { id: 'Rigel', ra: 5.2423, dec: -8.2016, magnitude: 0.13, color: '#CFE2FF' },
  { id: 'Procyon', ra: 7.655, dec: 5.225, magnitude: 0.34, color: '#FFF2D8' },
  { id: 'Betelgeuse', ra: 5.9195, dec: 7.4071, magnitude: 0.42, color: '#FFAD87' },
  { id: 'Achernar', ra: 1.6286, dec: -57.2368, magnitude: 0.46, color: '#D9E8FF' },
  { id: 'Altair', ra: 19.8464, dec: 8.8683, magnitude: 0.77, color: '#E5EDFF' },
  { id: 'Aldebaran', ra: 4.5987, dec: 16.5093, magnitude: 0.85, color: '#FFBD83' },
  { id: 'Antares', ra: 16.4901, dec: -26.432, magnitude: 1.06, color: '#FF9A7A' },
  { id: 'Spica', ra: 13.4199, dec: -11.1614, magnitude: 0.97, color: '#D8E9FF' },
  { id: 'Pollux', ra: 7.7553, dec: 28.0262, magnitude: 1.14, color: '#FFD3A1' },
  { id: 'Fomalhaut', ra: 22.9608, dec: -29.6222, magnitude: 1.16, color: '#E5EDFF' },
  { id: 'Deneb', ra: 20.6905, dec: 45.2803, magnitude: 1.25, color: '#D9E8FF' },
  { id: 'Regulus', ra: 10.1395, dec: 11.9672, magnitude: 1.35, color: '#E3ECFF' },
  { id: 'Castor', ra: 7.5767, dec: 31.8883, magnitude: 1.58, color: '#E3ECFF' },
  { id: 'Bellatrix', ra: 5.4189, dec: 6.3497, magnitude: 1.64, color: '#D8E9FF' },
  { id: 'Alnilam', ra: 5.6036, dec: -1.2019, magnitude: 1.69, color: '#D8E9FF' },
  { id: 'Saiph', ra: 5.7959, dec: -9.6696, magnitude: 2.06, color: '#D8E9FF' },
  { id: 'Mintaka', ra: 5.5334, dec: -0.2991, magnitude: 2.23, color: '#D8E9FF' },
  { id: 'Alnitak', ra: 5.6793, dec: -1.9426, magnitude: 1.74, color: '#D8E9FF' },
  { id: 'Dubhe', ra: 11.0621, dec: 61.7508, magnitude: 1.79, color: '#FFD8A8' },
  { id: 'Merak', ra: 11.0307, dec: 56.3824, magnitude: 2.37, color: '#E5EDFF' },
  { id: 'Phecda', ra: 11.8972, dec: 53.6948, magnitude: 2.44, color: '#E5EDFF' },
  { id: 'Megrez', ra: 12.2571, dec: 57.0326, magnitude: 3.31, color: '#E5EDFF' },
  { id: 'Alioth', ra: 12.9005, dec: 55.9598, magnitude: 1.77, color: '#E5EDFF' },
  { id: 'Mizar', ra: 13.3987, dec: 54.9254, magnitude: 2.23, color: '#E5EDFF' },
  { id: 'Alkaid', ra: 13.7923, dec: 49.3133, magnitude: 1.86, color: '#D8E9FF' },
  { id: 'Alpheratz', ra: 0.1398, dec: 29.0904, magnitude: 2.06, color: '#D8E9FF' },
  { id: 'Mirfak', ra: 3.4054, dec: 49.8612, magnitude: 1.79, color: '#FFE2B5' },
  { id: 'Algol', ra: 3.1361, dec: 40.9556, magnitude: 2.12, color: '#D8E9FF' },
  { id: 'Electra', ra: 3.7479, dec: 24.1133, magnitude: 3.70, color: '#D8E9FF' },
  { id: 'Taygeta', ra: 3.7532, dec: 24.4673, magnitude: 4.30, color: '#D8E9FF' },
  { id: 'Maia', ra: 3.7638, dec: 24.3678, magnitude: 3.87, color: '#D8E9FF' },
  { id: 'Merope', ra: 3.7735, dec: 23.9484, magnitude: 4.18, color: '#D8E9FF' },
  { id: 'Atlas', ra: 3.8194, dec: 24.0534, magnitude: 3.63, color: '#D8E9FF' },
  { id: 'Pleione', ra: 3.8194, dec: 24.1368, magnitude: 5.05, color: '#D8E9FF' },
  { id: 'Elnath', ra: 5.4382, dec: 28.6075, magnitude: 1.65, color: '#D8E9FF' },
  { id: 'Alhena', ra: 6.6285, dec: 16.3993, magnitude: 1.93, color: '#D8E9FF' },
  { id: 'Wasat', ra: 7.3354, dec: 21.9823, magnitude: 3.53, color: '#D8E9FF' },
  { id: 'Mebsuta', ra: 6.7322, dec: 25.1311, magnitude: 3.06, color: '#D8E9FF' },
  { id: 'Menkalinan', ra: 6.3827, dec: 45.9979, magnitude: 1.90, color: '#FFE2B5' },
  { id: 'Alphecca', ra: 15.5781, dec: 26.7147, magnitude: 2.23, color: '#D8E9FF' },
  { id: 'Zubenelgenubi', ra: 14.8481, dec: -16.0418, magnitude: 2.75, color: '#E5EDFF' },
  { id: 'Zubeneschamali', ra: 15.2837, dec: -9.3829, magnitude: 2.61, color: '#D8E9FF' },
  { id: 'Rasalhague', ra: 17.5822, dec: 12.5600, magnitude: 2.08, color: '#D8E9FF' },
  { id: 'Kaus Australis', ra: 18.4029, dec: -34.3846, magnitude: 1.79, color: '#D8E9FF' },
  { id: 'Nunki', ra: 18.9211, dec: -26.2967, magnitude: 2.05, color: '#D8E9FF' },
  { id: 'Shaula', ra: 17.5601, dec: -37.1038, magnitude: 1.63, color: '#D8E9FF' },
  { id: 'Lesath', ra: 17.5127, dec: -37.2958, magnitude: 2.70, color: '#D8E9FF' },
  { id: 'Dschubba', ra: 16.0056, dec: -22.6217, magnitude: 2.32, color: '#D8E9FF' },
  { id: 'Acrux', ra: 12.4433, dec: -63.0991, magnitude: 0.77, color: '#D8E9FF' },
  { id: 'Hadar', ra: 14.0637, dec: -60.3730, magnitude: 0.61, color: '#D8E9FF' },
  { id: 'Mimosa', ra: 12.7954, dec: -59.6888, magnitude: 1.25, color: '#D8E9FF' },
  { id: 'Gacrux', ra: 12.5194, dec: -57.1132, magnitude: 1.63, color: '#FFBD83' },
  { id: 'Sadr', ra: 20.3705, dec: 40.2567, magnitude: 2.23, color: '#E5EDFF' },
  { id: 'Schedar', ra: 0.6751, dec: 56.5373, magnitude: 2.24, color: '#FFD3A1' },
  { id: 'Caph', ra: 0.1529, dec: 59.1498, magnitude: 2.27, color: '#E5EDFF' },
  { id: 'Gamma Cas', ra: 0.9451, dec: 60.7167, magnitude: 2.47, color: '#D8E9FF' },
  { id: 'Ruchbah', ra: 1.4303, dec: 60.2353, magnitude: 2.68, color: '#E5EDFF' },
];

const CONSTELLATION_LINES: [string, string][] = [
  ['Dubhe', 'Merak'], ['Merak', 'Phecda'], ['Phecda', 'Megrez'],
  ['Megrez', 'Alioth'], ['Alioth', 'Mizar'], ['Mizar', 'Alkaid'],
  ['Betelgeuse', 'Bellatrix'], ['Bellatrix', 'Mintaka'], ['Mintaka', 'Alnilam'],
  ['Alnilam', 'Alnitak'], ['Alnitak', 'Saiph'], ['Saiph', 'Rigel'],
  ['Rigel', 'Mintaka'], ['Vega', 'Sadr'], ['Sadr', 'Deneb'],
  ['Caph', 'Schedar'], ['Schedar', 'Gamma Cas'], ['Gamma Cas', 'Ruchbah'],
  ['Ruchbah', 'Caph'], ['Alpheratz', 'Schedar'], ['Mirfak', 'Algol'],
  ['Elnath', 'Aldebaran'], ['Electra', 'Taygeta'], ['Taygeta', 'Maia'],
  ['Maia', 'Merope'], ['Merope', 'Atlas'], ['Atlas', 'Pleione'],
  ['Alhena', 'Wasat'], ['Wasat', 'Mebsuta'], ['Acrux', 'Mimosa'],
  ['Mimosa', 'Gacrux'], ['Gacrux', 'Acrux'], ['Dschubba', 'Antares'],
  ['Antares', 'Shaula'], ['Shaula', 'Lesath'], ['Kaus Australis', 'Nunki'],
];

export const SKY_CONSTELLATION_LINES = CONSTELLATION_LINES;

export function calculateLiveSky(
  date: Date,
  latitude: number,
  longitude: number
): CelestialPosition[] {
  if (!Number.isFinite(date.getTime())) {
    throw new Error('Sky observation time must be a valid date.');
  }
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error('Observer latitude must be between -90 and 90 degrees.');
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error('Observer longitude must be between -180 and 180 degrees.');
  }

  const observer = new Observer(latitude, longitude, 0);
  const planetPositions = PLANETS.map(({ id, magnitude, color }): CelestialPosition => {
    const equatorial = Equator(PLANET_BODIES[id], date, observer, true, true);
    const horizontal = Horizon(date, observer, equatorial.ra, equatorial.dec, 'normal');
    return {
      id,
      name: id,
      kind: 'planet',
      azimuth: horizontal.azimuth,
      altitude: horizontal.altitude,
      magnitude,
      color,
    };
  });

  const stars = BRIGHT_STARS.map(
    ({ id, ra, dec, magnitude, color }): CelestialPosition => {
      const horizontal = Horizon(date, observer, ra, dec, 'normal');
      return {
        id,
        name: id,
        kind: 'star',
        azimuth: horizontal.azimuth,
        altitude: horizontal.altitude,
        magnitude,
        color,
      };
    }
  );

  return [...planetPositions, ...stars];
}
