import type { CalculationInput, CalculationResult } from '../types';

export const IN_TO_MM = 25.4;
export const MM_TO_IN = 1 / 25.4;

export function getPaperThickness(
  interiorType: CalculationInput['interiorType'],
  paperType: CalculationInput['paperType'],
  customPpi?: number
): { thicknessIn: number; ppi: number } {
  if (customPpi && customPpi > 0) {
    return {
      thicknessIn: 1 / customPpi,
      ppi: customPpi,
    };
  }

  if (interiorType === 'premium_color') {
    // Premium color white: 0.002347" (426.07 PPI)
    return { thicknessIn: 0.002347, ppi: 426.07 };
  }

  if (paperType === 'cream') {
    // Cream paper (B&W or Standard): 0.0025" (400 PPI)
    return { thicknessIn: 0.0025, ppi: 400.0 };
  }

  // White paper (B&W or Standard color): 0.002252" (444.05 PPI)
  return { thicknessIn: 0.002252, ppi: 444.05 };
}

export function calculateBookCover(input: CalculationInput): CalculationResult {
  const {
    bindingType,
    interiorType,
    paperType,
    customPpi,
    unit,
    trimWidth: rawTrimWidth,
    trimHeight: rawTrimHeight,
    pageCount,
  } = input;

  // Convert trim width & height to Inches
  const trimWidthIn = unit === 'in' ? rawTrimWidth : rawTrimWidth * MM_TO_IN;
  const trimHeightIn = unit === 'in' ? rawTrimHeight : rawTrimHeight * MM_TO_IN;

  const trimWidthMm = trimWidthIn * IN_TO_MM;
  const trimHeightMm = trimHeightIn * IN_TO_MM;

  // Paper thickness per page (leaf)
  const { thicknessIn: paperThicknessPerLeafIn, ppi: calculatedPpi } = getPaperThickness(
    interiorType,
    paperType,
    customPpi
  );
  const paperThicknessPerLeafMm = paperThicknessPerLeafIn * IN_TO_MM;

  // Spine calculation
  let spineWidthIn = pageCount * paperThicknessPerLeafIn;
  if (bindingType === 'hardcover') {
    // Additional allowance for binder board and cloth/paper wrap in hinge
    spineWidthIn += 0.060;
  }
  const spineWidthMm = spineWidthIn * IN_TO_MM;

  // Spine safe margins & text eligibility
  const spineSafeMarginIn = 0.0625; // 1/16" safe margin on each side of spine
  const spineSafeMarginMm = spineSafeMarginIn * IN_TO_MM;
  const spineSafeWidthIn = Math.max(0, spineWidthIn - (spineSafeMarginIn * 2));
  const spineSafeWidthMm = spineSafeWidthIn * IN_TO_MM;

  const minPagesForSpineText = Math.ceil(0.0625 / paperThicknessPerLeafIn);
  const spineTextAllowed = pageCount >= minPagesForSpineText && spineWidthIn >= 0.0625;
  const spineTextNote = spineTextAllowed
    ? `Spine text is supported (${pageCount} pages, spine width ${unit === 'mm' ? spineWidthMm.toFixed(2) + ' mm' : spineWidthIn.toFixed(3) + ' in'}).`
    : `Spine is too narrow for text. Minimum ${minPagesForSpineText} pages required (current: ${pageCount} pages). Leave spine blank.`;

  // Standard Bleed
  const bleedIn = 0.125; // 3.175 mm
  const bleedMm = bleedIn * IN_TO_MM;

  // Safe Margin
  const safeMarginIn = 0.125; // 3.175 mm
  const safeMarginMm = safeMarginIn * IN_TO_MM;

  // Hardcover specifics
  const hingeIn = bindingType === 'hardcover' ? 0.394 : 0; // 10 mm hinge
  const hingeMm = hingeIn * IN_TO_MM;

  const wrapMarginIn = bindingType === 'hardcover' ? 0.590 : 0; // 15 mm wrap around turn-in
  const wrapMarginMm = wrapMarginIn * IN_TO_MM;

  const boardOverhangIn = bindingType === 'hardcover' ? 0.125 : 0; // board overhangs pages

  // Full Cover dimensions calculation
  let fullCoverWidthIn: number;
  let fullCoverHeightIn: number;

  if (bindingType === 'paperback') {
    fullCoverWidthIn = (trimWidthIn * 2) + spineWidthIn + (bleedIn * 2);
    fullCoverHeightIn = trimHeightIn + (bleedIn * 2);
  } else {
    // Hardcover (Case Laminate):
    fullCoverWidthIn = (trimWidthIn * 2) + spineWidthIn + (2 * hingeIn) + (2 * boardOverhangIn) + (2 * wrapMarginIn);
    fullCoverHeightIn = trimHeightIn + (2 * boardOverhangIn) + (2 * wrapMarginIn);
  }

  const fullCoverWidthMm = fullCoverWidthIn * IN_TO_MM;
  const fullCoverHeightMm = fullCoverHeightIn * IN_TO_MM;

  // Barcode dimensions
  const barcodeWidthIn = 2.0; // 50.8 mm
  const barcodeHeightIn = 1.2; // 30.48 mm
  const barcodeWidthMm = barcodeWidthIn * IN_TO_MM;
  const barcodeHeightMm = barcodeHeightIn * IN_TO_MM;

  // 300 DPI Pixel Dimensions
  const pixelWidth300Dpi = Math.round(fullCoverWidthIn * 300);
  const pixelHeight300Dpi = Math.round(fullCoverHeightIn * 300);

  return {
    unit,
    fullCoverWidthIn,
    fullCoverHeightIn,
    fullCoverWidthMm,
    fullCoverHeightMm,
    fullCoverWidthCurrent: unit === 'in' ? fullCoverWidthIn : fullCoverWidthMm,
    fullCoverHeightCurrent: unit === 'in' ? fullCoverHeightIn : fullCoverHeightMm,

    spineWidthIn,
    spineWidthMm,
    spineWidthCurrent: unit === 'in' ? spineWidthIn : spineWidthMm,
    spineSafeMarginIn,
    spineSafeMarginMm,
    spineSafeWidthIn,
    spineSafeWidthMm,
    spineTextAllowed,
    spineTextNote,

    trimWidthIn,
    trimHeightIn,
    trimWidthMm,
    trimHeightMm,
    trimWidthCurrent: unit === 'in' ? trimWidthIn : trimWidthMm,
    trimHeightCurrent: unit === 'in' ? trimHeightIn : trimHeightMm,

    bleedIn,
    bleedMm,
    bleedCurrent: unit === 'in' ? bleedIn : bleedMm,
    safeMarginIn,
    safeMarginMm,
    safeMarginCurrent: unit === 'in' ? safeMarginIn : safeMarginMm,

    hingeIn,
    hingeMm,
    wrapMarginIn,
    wrapMarginMm,

    barcodeWidthIn,
    barcodeHeightIn,
    barcodeWidthMm,
    barcodeHeightMm,

    pixelWidth300Dpi,
    pixelHeight300Dpi,

    paperThicknessPerLeafIn,
    paperThicknessPerLeafMm,
    calculatedPpi,
    calculatedAt: new Date().toISOString(),
  };
}

export function formatDimension(val: number, unit: 'mm' | 'in', precision?: number): string {
  const p = precision !== undefined ? precision : unit === 'in' ? 3 : 2;
  return `${val.toFixed(p)} ${unit}`;
}
