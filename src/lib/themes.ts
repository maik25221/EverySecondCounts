import { Theme } from './models';

export const themes: Theme[] = [
  {
    id: 'turquoise',
    name: 'themes.turquoise', // Translation key
    colors: {
      primary: 'rgb(13 148 136)', // teal-600
      secondary: 'rgb(6 182 212)', // cyan-500
      accent: 'rgb(249 115 22)', // orange-500
    },
  },
  {
    id: 'emerald',
    name: 'themes.emerald',
    colors: {
      primary: 'rgb(5 150 105)', // emerald-600
      secondary: 'rgb(34 197 94)', // green-500
      accent: 'rgb(251 191 36)', // amber-400
    },
  },
  {
    id: 'blue',
    name: 'themes.blue',
    colors: {
      primary: 'rgb(37 99 235)', // blue-600
      secondary: 'rgb(59 130 246)', // blue-500
      accent: 'rgb(168 85 247)', // purple-500
    },
  },
  {
    id: 'purple',
    name: 'themes.purple',
    colors: {
      primary: 'rgb(147 51 234)', // purple-600
      secondary: 'rgb(168 85 247)', // purple-500
      accent: 'rgb(236 72 153)', // pink-500
    },
  },
  {
    id: 'rose',
    name: 'themes.rose',
    colors: {
      primary: 'rgb(225 29 72)', // rose-600
      secondary: 'rgb(244 63 94)', // rose-500
      accent: 'rgb(251 113 133)', // rose-400
    },
  },
];

export function getThemeById(id: string): Theme {
  return themes.find(theme => theme.id === id) || themes[0]!;
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  root.style.setProperty('--color-brand-600', theme.colors.primary);
  root.style.setProperty('--color-brand-500', theme.colors.secondary);
  root.style.setProperty('--color-brand-400', theme.colors.accent);
  
  // Generate other shades programmatically
  const primaryRgb = theme.colors.primary.match(/\d+/g)!.map(Number);
  
  // Lighter shades
  root.style.setProperty('--color-brand-50', `rgb(${primaryRgb.map(c => Math.min(255, c + 200)).join(' ')})`);
  root.style.setProperty('--color-brand-100', `rgb(${primaryRgb.map(c => Math.min(255, c + 150)).join(' ')})`);
  root.style.setProperty('--color-brand-200', `rgb(${primaryRgb.map(c => Math.min(255, c + 100)).join(' ')})`);
  root.style.setProperty('--color-brand-300', `rgb(${primaryRgb.map(c => Math.min(255, c + 50)).join(' ')})`);
  
  // Darker shades  
  root.style.setProperty('--color-brand-700', `rgb(${primaryRgb.map(c => Math.max(0, c - 30)).join(' ')})`);
  root.style.setProperty('--color-brand-800', `rgb(${primaryRgb.map(c => Math.max(0, c - 60)).join(' ')})`);
  root.style.setProperty('--color-brand-900', `rgb(${primaryRgb.map(c => Math.max(0, c - 90)).join(' ')})`);
  root.style.setProperty('--color-brand-950', `rgb(${primaryRgb.map(c => Math.max(0, c - 120)).join(' ')})`);
}

export function setBackgroundImage(imageUrl: string) {
  const root = document.documentElement;
  if (imageUrl) {
    root.style.setProperty('--background-image', `url("${imageUrl}")`);
    root.style.setProperty('--background-overlay', 'rgba(255,255,255,0.85)');
  } else {
    root.style.setProperty('--background-image', 'none');
    root.style.setProperty('--background-overlay', 'transparent');
  }
}