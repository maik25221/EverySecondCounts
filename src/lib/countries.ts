import { Country } from './models';

export const GLOBAL_LIFE_EXPECTANCY = 82;

export const countries: Country[] = [
  { code: 'GLOBAL', name: 'Global / No especificado', lifeExpectancy: GLOBAL_LIFE_EXPECTANCY },
  { code: 'ES', name: 'España', lifeExpectancy: 84 },
  { code: 'IT', name: 'Italia', lifeExpectancy: 84 },
  { code: 'FR', name: 'Francia', lifeExpectancy: 83 },
  { code: 'DE', name: 'Alemania', lifeExpectancy: 81 },
  { code: 'PT', name: 'Portugal', lifeExpectancy: 82 },
  { code: 'GB', name: 'Reino Unido', lifeExpectancy: 81 },
  { code: 'US', name: 'Estados Unidos', lifeExpectancy: 79 },
  { code: 'CA', name: 'Canadá', lifeExpectancy: 83 },
  { code: 'MX', name: 'México', lifeExpectancy: 75 },
  { code: 'AR', name: 'Argentina', lifeExpectancy: 77 },
  { code: 'CL', name: 'Chile', lifeExpectancy: 81 },
  { code: 'BR', name: 'Brasil', lifeExpectancy: 76 },
  { code: 'JP', name: 'Japón', lifeExpectancy: 85 },
  { code: 'KR', name: 'Corea del Sur', lifeExpectancy: 84 },
  { code: 'CN', name: 'China', lifeExpectancy: 77 },
  { code: 'AU', name: 'Australia', lifeExpectancy: 84 },
  { code: 'NZ', name: 'Nueva Zelanda', lifeExpectancy: 82 },
  { code: 'SE', name: 'Suecia', lifeExpectancy: 83 },
  { code: 'NO', name: 'Noruega', lifeExpectancy: 82 },
  { code: 'NL', name: 'Países Bajos', lifeExpectancy: 83 },
];

export function getCountryByCode(code?: string): Country {
  const country = countries.find(c => c.code === code);
  return country || countries[0]!; // Return GLOBAL if not found
}

export function getLifeExpectancyByCountry(code?: string): number {
  const country = getCountryByCode(code);
  return country.lifeExpectancy;
}