import type { TrimPreset } from '../types';

export const TRIM_PRESETS: TrimPreset[] = [
  {
    id: '5x8',
    name: '5" x 8" (127 x 203.2 mm)',
    widthIn: 5.0,
    heightIn: 8.0,
    widthMm: 127.0,
    heightMm: 203.2,
    popularFor: 'Novels, Poetry, Compact Paperbacks'
  },
  {
    id: '5.25x8',
    name: '5.25" x 8" (133.35 x 203.2 mm)',
    widthIn: 5.25,
    heightIn: 8.0,
    widthMm: 133.35,
    heightMm: 203.2,
    popularFor: 'Fiction, Memoirs'
  },
  {
    id: '5.5x8.5',
    name: '5.5" x 8.5" (139.7 x 215.9 mm) — Digest',
    widthIn: 5.5,
    heightIn: 8.5,
    widthMm: 139.7,
    heightMm: 215.9,
    popularFor: 'Non-Fiction, Literature, YA Novels (BAYAN PRESS)'
  },
  {
    id: '6x9',
    name: '6" x 9" (152.4 x 228.6 mm) — Standard Trade (Most Popular)',
    widthIn: 6.0,
    heightIn: 9.0,
    widthMm: 152.4,
    heightMm: 228.6,
    popularFor: 'Industry Standard for Paperbacks & Hardcovers'
  },
  {
    id: '6.14x9.21',
    name: '6.14" x 9.21" (156 x 234 mm) — Royal Octavo',
    widthIn: 6.14,
    heightIn: 9.21,
    widthMm: 156.0,
    heightMm: 233.93,
    popularFor: 'Academic, Hardcover Reference'
  },
  {
    id: '7x10',
    name: '7" x 10" (177.8 x 254 mm) — Executive',
    widthIn: 7.0,
    heightIn: 10.0,
    widthMm: 177.8,
    heightMm: 254.0,
    popularFor: 'Textbooks, Manuals, Middle Grade Storybooks'
  },
  {
    id: '7.5x9.25',
    name: '7.5" x 9.25" (190.5 x 235 mm)',
    widthIn: 7.5,
    heightIn: 9.25,
    widthMm: 190.5,
    heightMm: 234.95,
    popularFor: 'Journals, Activity Books'
  },
  {
    id: '8x10',
    name: '8" x 10" (203.2 x 254 mm)',
    widthIn: 8.0,
    heightIn: 10.0,
    widthMm: 203.2,
    heightMm: 254.0,
    popularFor: 'Children Workbooks, Cookbooks, Illustrated'
  },
  {
    id: '8.5x8.5',
    name: '8.5" x 8.5" (215.9 x 215.9 mm) — Square',
    widthIn: 8.5,
    heightIn: 8.5,
    widthMm: 215.9,
    heightMm: 215.9,
    popularFor: 'Children Picture Books, FALAH BOOKS Special'
  },
  {
    id: '8.5x11',
    name: '8.5" x 11" (215.9 x 279.4 mm) — Letter',
    widthIn: 8.5,
    heightIn: 11.0,
    widthMm: 215.9,
    heightMm: 279.4,
    popularFor: 'Coloring Books, Workbooks, Big Picture Books'
  },
  {
    id: 'a5',
    name: 'A5 (148 x 210 mm / 5.83" x 8.27")',
    widthIn: 5.827,
    heightIn: 8.268,
    widthMm: 148.0,
    heightMm: 210.0,
    popularFor: 'International Standard, Asian & European Publishing'
  },
  {
    id: 'b5',
    name: 'B5 (176 x 250 mm / 6.93" x 9.84")',
    widthIn: 6.929,
    heightIn: 9.843,
    widthMm: 176.0,
    heightMm: 250.0,
    popularFor: 'Textbooks, Islamic Reference Books'
  },
  {
    id: 'a4',
    name: 'A4 (210 x 297 mm / 8.27" x 11.69")',
    widthIn: 8.268,
    heightIn: 11.693,
    widthMm: 210.0,
    heightMm: 297.0,
    popularFor: 'Magazines, Portfolios, Large Worksheets'
  },
  {
    id: 'custom',
    name: 'Custom Trim Size...',
    widthIn: 6.0,
    heightIn: 9.0,
    widthMm: 152.4,
    heightMm: 228.6,
    popularFor: 'Enter your custom width and height'
  }
];
