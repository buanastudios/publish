export type Unit = 'mm' | 'in';

export type BindingType = 'paperback' | 'hardcover';

export type InteriorType = 'black_white' | 'standard_color' | 'premium_color';

export type PaperType = 'white' | 'cream' | 'custom';

export type ReadingDirection = 'ltr' | 'rtl';

export interface Imprint {
  id: string;
  name: string; // e.g. "FALAH", "SYABAB", "HIFZUN" (single word / 3-letter)
  tagline: string;
  targetAge: string;
  ageCategory: 'kids' | 'youth' | 'scholar' | 'all';
  description: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  accentHex: string;
  isbnPrefix: string;
  recommendedTrimSizes: string[];
  suggestedPaper: PaperType;
  logoIcon: 'falah-star' | 'syabab-flame' | 'hifzun-shield' | 'sparkles' | 'bookmark' | 'book-open';
}

export interface TrimPreset {
  id: string;
  name: string;
  widthIn: number;
  heightIn: number;
  widthMm: number;
  heightMm: number;
  popularFor?: string;
}

export interface CalculationInput {
  imprintId: string;
  bindingType: BindingType;
  interiorType: InteriorType;
  paperType: PaperType;
  customPpi?: number;
  readingDirection: ReadingDirection;
  unit: Unit;
  trimPresetId: string;
  trimWidth: number;
  trimHeight: number;
  pageCount: number;
  bookTitle?: string;
  authorName?: string;
  isbn?: string;
  includeBarcodeBox: boolean;
}

export interface CalculationResult {
  unit: Unit;
  fullCoverWidthIn: number;
  fullCoverHeightIn: number;
  fullCoverWidthMm: number;
  fullCoverHeightMm: number;
  fullCoverWidthCurrent: number;
  fullCoverHeightCurrent: number;

  spineWidthIn: number;
  spineWidthMm: number;
  spineWidthCurrent: number;
  spineSafeMarginIn: number;
  spineSafeMarginMm: number;
  spineSafeWidthIn: number;
  spineSafeWidthMm: number;
  spineTextAllowed: boolean;
  spineTextNote: string;

  trimWidthIn: number;
  trimHeightIn: number;
  trimWidthMm: number;
  trimHeightMm: number;
  trimWidthCurrent: number;
  trimHeightCurrent: number;

  bleedIn: number;
  bleedMm: number;
  bleedCurrent: number;
  safeMarginIn: number;
  safeMarginMm: number;
  safeMarginCurrent: number;

  hingeIn: number;
  hingeMm: number;
  wrapMarginIn: number;
  wrapMarginMm: number;

  barcodeWidthIn: number;
  barcodeHeightIn: number;
  barcodeWidthMm: number;
  barcodeHeightMm: number;

  pixelWidth300Dpi: number;
  pixelHeight300Dpi: number;

  paperThicknessPerLeafIn: number;
  paperThicknessPerLeafMm: number;
  calculatedPpi: number;
  calculatedAt: string;
}

export interface Author {
  penNameSlug: string;
  name: string;
  title: string;
  avatarUrl?: string;
  bio: string;
  imprints: string[]; // imprint IDs
  booksCount: number;
  location: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authorPenName: string;
  authorName: string;
  imprintId: string; // 'falah', 'syabab', 'hifzun'
  description: string;
  coverBg: string; // Gradient or hex
  coverAccent: string;
  pageCount: number;
  trimSize: string;
  bindingType: BindingType;
  isbn: string;
  pricePrintIdr: number;
  pricePrintUsd: number;
  priceDigitalIdr: number;
  priceDigitalUsd: number;
  publishedYear: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
}

export interface CartItem {
  book: Book;
  format: 'print' | 'digital';
  quantity: number;
}
