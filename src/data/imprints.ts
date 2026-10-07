import type { Imprint } from '../types';

export const DEFAULT_IMPRINTS: Imprint[] = [
  {
    id: 'falah',
    name: 'FALAH',
    tagline: 'Inspiring Young Hearts & Minds',
    targetAge: 'Below 13 yo (Children & Picture Books)',
    ageCategory: 'kids',
    description: 'Specialized imprint for children illustrated stories, Islamic values, picture books, activity workbooks, and early STEM.',
    badgeColor: 'text-emerald-700 dark:text-emerald-300',
    badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    badgeBorder: 'border-emerald-300',
    accentHex: '#059669',
    isbnPrefix: '978-623-7890-',
    recommendedTrimSizes: ['8.5x8.5', '8.5x11', '6x9', '7x10'],
    suggestedPaper: 'white',
    logoIcon: 'falah-star'
  },
  {
    id: 'syabab',
    name: 'SYABAB',
    tagline: 'Youth Leadership & Bold Thought',
    targetAge: '13 – 24 yo (Young Adult & Youth)',
    ageCategory: 'youth',
    description: 'Imprint dedicated to youth empowerment, fiction, inspirational memoirs, graphic novels, philosophy, and personal growth.',
    badgeColor: 'text-indigo-700 dark:text-indigo-300',
    badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    badgeBorder: 'border-indigo-300',
    accentHex: '#4f46e5',
    isbnPrefix: '978-623-9510-',
    recommendedTrimSizes: ['5.5x8.5', '6x9', '5x8', 'a5'],
    suggestedPaper: 'cream',
    logoIcon: 'syabab-flame'
  },
  {
    id: 'hifzun',
    name: 'HIFZUN',
    tagline: 'Preserving Timeless Wisdom & Heritage',
    targetAge: 'All Ages / Scholars & Reference',
    ageCategory: 'scholar',
    description: 'Scholarly treatises, classical translations, Qur’anic sciences, critical editions, and deluxe hardcover collector volumes.',
    badgeColor: 'text-amber-800 dark:text-amber-300',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
    badgeBorder: 'border-amber-300',
    accentHex: '#d97706',
    isbnPrefix: '978-623-1122-',
    recommendedTrimSizes: ['6x9', '7x10', 'a5', 'b5'],
    suggestedPaper: 'cream',
    logoIcon: 'hifzun-shield'
  }
];
