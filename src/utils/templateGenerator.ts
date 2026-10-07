import { jsPDF } from 'jspdf';
import type { CalculationInput, CalculationResult, Imprint } from '../types';

/**
 * Draw a complete cover guide template on an HTML5 Canvas
 */
export function drawTemplateOnCanvas(
  canvas: HTMLCanvasElement,
  input: CalculationInput,
  result: CalculationResult,
  imprint: Imprint,
  dpi: number = 300
): void {
  const widthIn = result.fullCoverWidthIn;
  const heightIn = result.fullCoverHeightIn;

  const widthPx = Math.round(widthIn * dpi);
  const heightPx = Math.round(heightIn * dpi);

  canvas.width = widthPx;
  canvas.height = heightPx;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, widthPx, heightPx);

  const scale = dpi; // 1 inch = scale pixels
  const bleedPx = result.bleedIn * scale;
  const trimWPx = result.trimWidthIn * scale;
  const trimHPx = result.trimHeightIn * scale;
  const spineWPx = result.spineWidthIn * scale;
  const safeMarginPx = result.safeMarginIn * scale;
  const spineSafeMarginPx = result.spineSafeMarginIn * scale;

  const isRTL = input.readingDirection === 'rtl';

  // 1. Bleed Zone Shading (Pink / Salmon Hatching)
  ctx.fillStyle = 'rgba(255, 182, 193, 0.45)'; // Soft pink
  // Top bleed
  ctx.fillRect(0, 0, widthPx, bleedPx);
  // Bottom bleed
  ctx.fillRect(0, heightPx - bleedPx, widthPx, bleedPx);
  // Left bleed
  ctx.fillRect(0, 0, bleedPx, heightPx);
  // Right bleed
  ctx.fillRect(widthPx - bleedPx, 0, bleedPx, heightPx);

  // Diagonal hatch lines in bleed zone
  ctx.strokeStyle = 'rgba(230, 100, 120, 0.3)';
  ctx.lineWidth = Math.max(1, Math.round(dpi / 150));
  const hatchStep = Math.round(dpi * 0.15);
  for (let x = -heightPx; x < widthPx + heightPx; x += hatchStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + heightPx, heightPx);
    ctx.stroke();
  }

  // Clear interior area from hatching so it's clean white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(bleedPx, bleedPx, widthPx - (bleedPx * 2), heightPx - (bleedPx * 2));

  // 2. Front Cover, Spine, Back Cover Coordinates
  let backCoverLeft = bleedPx;
  let spineLeft = bleedPx + trimWPx;
  let frontCoverLeft = bleedPx + trimWPx + spineWPx;

  if (isRTL) {
    // Right to Left: Front cover is on left, Back cover is on right
    frontCoverLeft = bleedPx;
    spineLeft = bleedPx + trimWPx;
    backCoverLeft = bleedPx + trimWPx + spineWPx;
  }

  // 3. Draw Trim & Spine Fold Lines (Solid Black / Slate)
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = Math.max(2, Math.round(dpi / 100));

  // Trim Outer Box
  ctx.strokeRect(bleedPx, bleedPx, widthPx - (bleedPx * 2), heightPx - (bleedPx * 2));

  // Spine Fold Lines
  ctx.beginPath();
  // Left spine fold
  ctx.moveTo(spineLeft, bleedPx);
  ctx.lineTo(spineLeft, heightPx - bleedPx);
  // Right spine fold
  ctx.moveTo(spineLeft + spineWPx, bleedPx);
  ctx.lineTo(spineLeft + spineWPx, heightPx - bleedPx);
  ctx.stroke();

  // Spine Center Line (Dotted Gray)
  ctx.save();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = Math.max(1, Math.round(dpi / 200));
  ctx.setLineDash([Math.round(dpi * 0.04), Math.round(dpi * 0.04)]);
  ctx.beginPath();
  ctx.moveTo(spineLeft + (spineWPx / 2), bleedPx);
  ctx.lineTo(spineLeft + (spineWPx / 2), heightPx - bleedPx);
  ctx.stroke();
  ctx.restore();

  // 4. Safe Margin Zones (Cyan / Blue Dashed)
  ctx.save();
  ctx.strokeStyle = '#0284c7'; // Sky / Cyan
  ctx.lineWidth = Math.max(1.5, Math.round(dpi / 150));
  ctx.setLineDash([Math.round(dpi * 0.03), Math.round(dpi * 0.03)]);

  // Back Cover Safe Box
  const backSafeX = backCoverLeft + safeMarginPx;
  const backSafeY = bleedPx + safeMarginPx;
  const backSafeW = trimWPx - (safeMarginPx * 2);
  const backSafeH = trimHPx - (safeMarginPx * 2);
  ctx.strokeRect(backSafeX, backSafeY, backSafeW, backSafeH);

  // Front Cover Safe Box
  const frontSafeX = frontCoverLeft + safeMarginPx;
  const frontSafeY = bleedPx + safeMarginPx;
  const frontSafeW = trimWPx - (safeMarginPx * 2);
  const frontSafeH = trimHPx - (safeMarginPx * 2);
  ctx.strokeRect(frontSafeX, frontSafeY, frontSafeW, frontSafeH);

  // Spine Safe Zone (if spine is wide enough)
  if (result.spineTextAllowed && spineWPx > spineSafeMarginPx * 2) {
    const spineSafeX = spineLeft + spineSafeMarginPx;
    const spineSafeY = bleedPx + safeMarginPx;
    const spineSafeW = spineWPx - (spineSafeMarginPx * 2);
    const spineSafeH = trimHPx - (safeMarginPx * 2);
    ctx.strokeRect(spineSafeX, spineSafeY, spineSafeW, spineSafeH);
  }
  ctx.restore();

  // 5. Barcode Box (Standard Location on Back Cover)
  if (input.includeBarcodeBox) {
    const barcodeWPx = result.barcodeWidthIn * scale;
    const barcodeHPx = result.barcodeHeightIn * scale;
    const barcodeMarginXPx = 0.25 * scale;
    const barcodeMarginYPx = 0.25 * scale;

    // Place in lower quadrant of back cover
    const barcodeX = isRTL
      ? (backCoverLeft + trimWPx - barcodeWPx - barcodeMarginXPx)
      : (backCoverLeft + barcodeMarginXPx);
    const barcodeY = heightPx - bleedPx - barcodeMarginYPx - barcodeHPx;

    // White box with border
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(barcodeX, barcodeY, barcodeWPx, barcodeHPx);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = Math.max(1, Math.round(dpi / 200));
    ctx.strokeRect(barcodeX, barcodeY, barcodeWPx, barcodeHPx);

    // Simulated Barcode lines
    ctx.fillStyle = '#0f172a';
    const barStartY = barcodeY + (barcodeHPx * 0.15);
    const barHeight = barcodeHPx * 0.55;
    const barStartX = barcodeX + (barcodeWPx * 0.08);
    const barAvailW = barcodeWPx * 0.84;

    const pattern = [2,1,3,1,1,2,3,2,1,2,1,3,2,1,1,2,2,3,1,1,2,1,3,1,2,2,1,3,1,2,1,1,3,2,1];
    let curX = barStartX;
    const barScale = barAvailW / 65;
    for (let i = 0; i < pattern.length; i++) {
      const w = pattern[i] * barScale;
      if (i % 2 === 0) {
        ctx.fillRect(curX, barStartY, w, barHeight);
      }
      curX += w;
    }

    // Barcode Text & ISBN
    ctx.fillStyle = '#334155';
    ctx.font = `600 ${Math.max(10, Math.round(dpi * 0.028))}px sans-serif`;
    ctx.textAlign = 'center';
    const displayIsbn = input.isbn || `${imprint.isbnPrefix}0001`;
    ctx.fillText(`ISBN ${displayIsbn}`, barcodeX + (barcodeWPx / 2), barcodeY + (barcodeHPx * 0.88));

    ctx.font = `500 ${Math.max(8, Math.round(dpi * 0.022))}px sans-serif`;
    ctx.fillStyle = '#64748b';
    ctx.fillText('BARCODE LOCATION (DO NOT COVER)', barcodeX + (barcodeWPx / 2), barcodeY + (barcodeHPx * 0.1));
  }

  // 6. Section Labels & Imprint Branding Watermarks
  ctx.textAlign = 'center';

  // Front Cover Header & Watermark
  ctx.fillStyle = imprint.accentHex;
  ctx.font = `bold ${Math.max(18, Math.round(dpi * 0.065))}px sans-serif`;
  ctx.fillText('FRONT COVER', frontCoverLeft + (trimWPx / 2), bleedPx + (trimHPx * 0.12));

  // Imprint Badge on Front
  ctx.fillStyle = '#334155';
  ctx.font = `bold ${Math.max(14, Math.round(dpi * 0.045))}px sans-serif`;
  ctx.fillText(`IMPRINT: ${imprint.name}`, frontCoverLeft + (trimWPx / 2), bleedPx + (trimHPx * 0.17));

  ctx.font = `500 ${Math.max(11, Math.round(dpi * 0.03))}px sans-serif`;
  ctx.fillStyle = '#64748b';
  ctx.fillText(`Audience: ${imprint.targetAge}`, frontCoverLeft + (trimWPx / 2), bleedPx + (trimHPx * 0.205));

  // Front Cover Subtitle/Guidelines
  ctx.font = `normal ${Math.max(10, Math.round(dpi * 0.027))}px sans-serif`;
  ctx.fillStyle = '#475569';
  const frontNotes = [
    `Trim Size: ${result.trimWidthIn}" x ${result.trimHeightIn}" (${result.trimWidthMm.toFixed(1)} x ${result.trimHeightMm.toFixed(1)} mm)`,
    'Place your title, author name & key artwork inside the blue safe area.',
    'Extend background graphics all the way to the outer pink bleed edge.',
  ];
  frontNotes.forEach((line, idx) => {
    ctx.fillText(line, frontCoverLeft + (trimWPx / 2), bleedPx + (trimHPx * 0.25) + (idx * dpi * 0.035));
  });

  // Back Cover Header & Guidelines
  ctx.fillStyle = '#1e293b';
  ctx.font = `bold ${Math.max(18, Math.round(dpi * 0.065))}px sans-serif`;
  ctx.fillText('BACK COVER', backCoverLeft + (trimWPx / 2), bleedPx + (trimHPx * 0.12));

  ctx.font = `bold ${Math.max(13, Math.round(dpi * 0.042))}px sans-serif`;
  ctx.fillStyle = '#475569';
  ctx.fillText(`PUBLISHED BY BUANA STUDIO DIRECT`, backCoverLeft + (trimWPx / 2), bleedPx + (trimHPx * 0.17));

  ctx.font = `normal ${Math.max(10, Math.round(dpi * 0.027))}px sans-serif`;
  ctx.fillStyle = '#64748b';
  const backNotes = [
    'Place synopsis, blurb, publisher logo & bio within safe margin.',
    'Leave the lower barcode zone unobstructed.',
  ];
  backNotes.forEach((line, idx) => {
    ctx.fillText(line, backCoverLeft + (trimWPx / 2), bleedPx + (trimHPx * 0.22) + (idx * dpi * 0.035));
  });

  // Spine Text & Orientation
  if (result.spineTextAllowed) {
    ctx.save();
    ctx.translate(spineLeft + (spineWPx / 2), bleedPx + (trimHPx / 2));
    ctx.rotate(Math.PI / 2); // 90 degree rotation for spine title (Top to Bottom)
    ctx.fillStyle = '#1e293b';
    ctx.font = `bold ${Math.max(11, Math.min(Math.round(spineWPx * 0.45), Math.round(dpi * 0.04)))}px sans-serif`;
    ctx.textAlign = 'center';
    const spineTitle = input.bookTitle ? `${input.bookTitle}  |  ${input.authorName || imprint.name}` : `BOOK TITLE  •  ${imprint.name}`;
    ctx.fillText(spineTitle, 0, 0);
    ctx.restore();
  }

  // 7. Dimension Spec Card (Bottom Center / Floating Info Box)
  const specCardW = Math.min(trimWPx * 0.9, dpi * 3.8);
  const specCardH = dpi * 1.35;
  const specCardX = frontCoverLeft + (trimWPx - specCardW) / 2;
  const specCardY = heightPx - bleedPx - safeMarginPx - specCardH - (dpi * 0.1);

  ctx.fillStyle = 'rgba(248, 250, 252, 0.95)';
  ctx.fillRect(specCardX, specCardY, specCardW, specCardH);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = Math.max(1, Math.round(dpi / 200));
  ctx.strokeRect(specCardX, specCardY, specCardW, specCardH);

  // Spec card title
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0f172a';
  ctx.font = `bold ${Math.max(11, Math.round(dpi * 0.032))}px sans-serif`;
  ctx.fillText('BOOK COVER SPECIFICATIONS', specCardX + (dpi * 0.15), specCardY + (dpi * 0.22));

  ctx.font = `500 ${Math.max(9, Math.round(dpi * 0.024))}px sans-serif`;
  ctx.fillStyle = '#334155';
  const specs = [
    `Imprint: ${imprint.name} (${imprint.targetAge})`,
    `Binding: ${input.bindingType.toUpperCase()} | Paper: ${input.paperType.toUpperCase()} | Pages: ${input.pageCount}`,
    `Full Canvas: ${result.fullCoverWidthIn.toFixed(3)}" x ${result.fullCoverHeightIn.toFixed(3)}" (${result.fullCoverWidthMm.toFixed(1)} x ${result.fullCoverHeightMm.toFixed(1)} mm)`,
    `Spine Width: ${result.spineWidthIn.toFixed(3)}" (${result.spineWidthMm.toFixed(2)} mm)`,
    `Bleed: ${result.bleedIn.toFixed(3)}" (${result.bleedMm.toFixed(2)} mm) | Safe Margin: 0.125" (3.18 mm)`,
    `Canvas @ 300 DPI: ${result.pixelWidth300Dpi} x ${result.pixelHeight300Dpi} px`,
  ];
  specs.forEach((s, idx) => {
    ctx.fillText(s, specCardX + (dpi * 0.15), specCardY + (dpi * 0.42) + (idx * dpi * 0.17));
  });

  // 8. Legend at Top Banner
  const legendY = Math.max(12, Math.round(dpi * 0.05));
  ctx.font = `600 ${Math.max(9, Math.round(dpi * 0.023))}px sans-serif`;
  ctx.textAlign = 'left';

  // Legend Item 1: Pink Bleed
  ctx.fillStyle = 'rgba(230, 100, 120, 0.8)';
  ctx.fillRect(bleedPx, legendY - 6, 12, 12);
  ctx.fillStyle = '#475569';
  ctx.fillText('Bleed Area (Background must fill this)', bleedPx + 18, legendY + 4);

  // Legend Item 2: Black Trim
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(bleedPx + (dpi * 2.1), legendY - 6, 12, 12);
  ctx.fillText('Solid Line: Cut/Trim & Spine Folds', bleedPx + (dpi * 2.1) + 18, legendY + 4);

  // Legend Item 3: Cyan Safe Margin
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(bleedPx + (dpi * 4.4), legendY - 6, 12, 12);
  ctx.fillText('Dashed Line: Safe Zone (Keep text inside)', bleedPx + (dpi * 4.4) + 18, legendY + 4);
}

/**
 * Generate and download high resolution PNG template
 */
export function downloadPngTemplate(
  input: CalculationInput,
  result: CalculationResult,
  imprint: Imprint,
  dpi: number = 300
): void {
  const canvas = document.createElement('canvas');
  drawTemplateOnCanvas(canvas, input, result, imprint, dpi);

  const cleanImprintName = imprint.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = `${cleanImprintName}_cover_template_${result.trimWidthIn}x${result.trimHeightIn}_${input.pageCount}p_${input.bindingType}.png`;

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Generate and download vector PDF template
 */
export function downloadPdfTemplate(
  input: CalculationInput,
  result: CalculationResult,
  imprint: Imprint
): void {
  const doc = new jsPDF({
    orientation: result.fullCoverWidthMm > result.fullCoverHeightMm ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [result.fullCoverWidthMm, result.fullCoverHeightMm],
  });

  const fullW = result.fullCoverWidthMm;
  const fullH = result.fullCoverHeightMm;
  const bleed = result.bleedMm;
  const trimW = result.trimWidthMm;
  const trimH = result.trimHeightMm;
  const spineW = result.spineWidthMm;
  const safeM = result.safeMarginMm;
  const isRTL = input.readingDirection === 'rtl';

  // 1. Draw Bleed Zone (Pink fill)
  doc.setFillColor(255, 230, 235);
  doc.rect(0, 0, fullW, bleed, 'F');
  doc.rect(0, fullH - bleed, fullW, bleed, 'F');
  doc.rect(0, 0, bleed, fullH, 'F');
  doc.rect(fullW - bleed, 0, bleed, fullH, 'F');

  // 2. Cut & Fold Lines (Solid Black)
  doc.setDrawColor(20, 25, 35);
  doc.setLineWidth(0.35);

  // Trim box
  doc.rect(bleed, bleed, trimW * 2 + spineW, trimH, 'S');

  let backX = bleed;
  let spineX = bleed + trimW;
  let frontX = bleed + trimW + spineW;

  if (isRTL) {
    frontX = bleed;
    spineX = bleed + trimW;
    backX = bleed + trimW + spineW;
  }

  // Spine folds
  doc.line(spineX, bleed, spineX, fullH - bleed);
  doc.line(spineX + spineW, bleed, spineX + spineW, fullH - bleed);

  // Spine center dash line
  doc.setDrawColor(150, 160, 175);
  doc.setLineWidth(0.2);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(spineX + (spineW / 2), bleed, spineX + (spineW / 2), fullH - bleed);

  // 3. Safe Margins (Cyan / Blue Dashed)
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.25);
  doc.setLineDashPattern([3, 2], 0);

  // Front Safe
  doc.rect(frontX + safeM, bleed + safeM, trimW - (safeM * 2), trimH - (safeM * 2), 'S');
  // Back Safe
  doc.rect(backX + safeM, bleed + safeM, trimW - (safeM * 2), trimH - (safeM * 2), 'S');

  // Spine Safe if allowed
  if (result.spineTextAllowed && spineW > result.spineSafeMarginMm * 2) {
    const sSafeM = result.spineSafeMarginMm;
    doc.rect(spineX + sSafeM, bleed + safeM, spineW - (sSafeM * 2), trimH - (safeM * 2), 'S');
  }

  // Reset line dash
  doc.setLineDashPattern([], 0);

  // 4. Barcode Box
  if (input.includeBarcodeBox) {
    const bW = result.barcodeWidthMm;
    const bH = result.barcodeHeightMm;
    const bX = isRTL ? (backX + trimW - bW - 6.35) : (backX + 6.35);
    const bY = fullH - bleed - 6.35 - bH;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(100, 116, 139);
    doc.rect(bX, bY, bW, bH, 'FD');

    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text('BARCODE & ISBN LOCATION', bX + (bW / 2), bY + 5, { align: 'center' });
    doc.setFontSize(7);
    doc.text(`ISBN: ${input.isbn || imprint.isbnPrefix + 'XXXX'}`, bX + (bW / 2), bY + bH - 3, { align: 'center' });
  }

  // 5. Typography and Guidelines
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(5, 150, 105);
  doc.text(`FRONT COVER (${imprint.name})`, frontX + (trimW / 2), bleed + 15, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Target Segment: ${imprint.targetAge}`, frontX + (trimW / 2), bleed + 22, { align: 'center' });
  doc.text(`Trim: ${result.trimWidthIn}" x ${result.trimHeightIn}" (${result.trimWidthMm.toFixed(1)} x ${result.trimHeightMm.toFixed(1)} mm)`, frontX + (trimW / 2), bleed + 27, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text('BACK COVER', backX + (trimW / 2), bleed + 15, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Buana Studio Direct Publishing', backX + (trimW / 2), bleed + 22, { align: 'center' });
  doc.text(`Spine Width: ${result.spineWidthIn.toFixed(3)}" (${result.spineWidthMm.toFixed(2)} mm)`, backX + (trimW / 2), bleed + 27, { align: 'center' });

  // Specification Box
  const cardW = Math.min(trimW * 0.85, 95);
  const cardH = 34;
  const cardX = frontX + (trimW - cardW) / 2;
  const cardY = fullH - bleed - safeM - cardH - 5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(cardX, cardY, cardW, cardH, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('COVER SPECIFICATIONS', cardX + 4, cardY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text(`• Imprint: ${imprint.name} | Binding: ${input.bindingType}`, cardX + 4, cardY + 11);
  doc.text(`• Total Size: ${result.fullCoverWidthMm.toFixed(1)} x ${result.fullCoverHeightMm.toFixed(1)} mm (${result.fullCoverWidthIn.toFixed(3)}" x ${result.fullCoverHeightIn.toFixed(3)}")`, cardX + 4, cardY + 16);
  doc.text(`• Spine: ${result.spineWidthMm.toFixed(2)} mm (${result.spineWidthIn.toFixed(3)}") | Pages: ${input.pageCount}`, cardX + 4, cardY + 21);
  doc.text(`• Bleed: ${result.bleedMm.toFixed(2)} mm | Safe Margin: ${result.safeMarginMm.toFixed(2)} mm`, cardX + 4, cardY + 26);
  doc.text(`• 300 DPI Canvas: ${result.pixelWidth300Dpi} x ${result.pixelHeight300Dpi} px`, cardX + 4, cardY + 31);

  const cleanImprintName = imprint.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = `${cleanImprintName}_cover_template_${result.trimWidthIn}x${result.trimHeightIn}_${input.pageCount}p_${input.bindingType}.pdf`;

  doc.save(filename);
}

/**
 * Generate and download SVG template
 */
export function downloadSvgTemplate(
  input: CalculationInput,
  result: CalculationResult,
  imprint: Imprint
): void {
  const widthMm = result.fullCoverWidthMm;
  const heightMm = result.fullCoverHeightMm;
  const bleed = result.bleedMm;
  const trimW = result.trimWidthMm;
  const trimH = result.trimHeightMm;
  const spineW = result.spineWidthMm;
  const safeM = result.safeMarginMm;
  const isRTL = input.readingDirection === 'rtl';

  let backX = bleed;
  let spineX = bleed + trimW;
  let frontX = bleed + trimW + spineW;

  if (isRTL) {
    frontX = bleed;
    spineX = bleed + trimW;
    backX = bleed + trimW + spineW;
  }

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${widthMm} ${heightMm}" width="${widthMm}mm" height="${heightMm}mm">
  <defs>
    <pattern id="bleedHatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(230,100,120,0.4)" stroke-width="1.2" />
    </pattern>
  </defs>

  <!-- Background / Bleed Fill -->
  <rect x="0" y="0" width="${widthMm}" height="${heightMm}" fill="#ffe6eb" />
  <rect x="0" y="0" width="${widthMm}" height="${heightMm}" fill="url(#bleedHatch)" />
  <rect x="${bleed}" y="${bleed}" width="${trimW * 2 + spineW}" height="${trimH}" fill="#ffffff" />

  <!-- Trim Outline -->
  <rect x="${bleed}" y="${bleed}" width="${trimW * 2 + spineW}" height="${trimH}" fill="none" stroke="#1e293b" stroke-width="0.35" />

  <!-- Spine Folds -->
  <line x1="${spineX}" y1="${bleed}" x2="${spineX}" y2="${heightMm - bleed}" stroke="#1e293b" stroke-width="0.35" />
  <line x1="${spineX + spineW}" y1="${bleed}" x2="${spineX + spineW}" y2="${heightMm - bleed}" stroke="#1e293b" stroke-width="0.35" />
  <line x1="${spineX + spineW / 2}" y1="${bleed}" x2="${spineX + spineW / 2}" y2="${heightMm - bleed}" stroke="#94a3b8" stroke-width="0.2" stroke-dasharray="2,2" />

  <!-- Safe Margins -->
  <rect x="${frontX + safeM}" y="${bleed + safeM}" width="${trimW - safeM * 2}" height="${trimH - safeM * 2}" fill="none" stroke="#0284c7" stroke-width="0.25" stroke-dasharray="3,2" />
  <rect x="${backX + safeM}" y="${bleed + safeM}" width="${trimW - safeM * 2}" height="${trimH - safeM * 2}" fill="none" stroke="#0284c7" stroke-width="0.25" stroke-dasharray="3,2" />

  <!-- Barcode Box -->
  ${input.includeBarcodeBox ? `
  <rect x="${isRTL ? backX + trimW - 57.15 : backX + 6.35}" y="${heightMm - bleed - 36.83}" width="50.8" height="30.48" fill="#ffffff" stroke="#64748b" stroke-width="0.25" />
  <text x="${isRTL ? backX + trimW - 31.75 : backX + 31.75}" y="${heightMm - bleed - 10}" font-family="sans-serif" font-size="2.8" text-anchor="middle" fill="#334155">ISBN ${input.isbn || imprint.isbnPrefix + 'XXXX'}</text>
  ` : ''}

  <!-- Labels -->
  <text x="${frontX + trimW / 2}" y="${bleed + 14}" font-family="sans-serif" font-weight="bold" font-size="5" text-anchor="middle" fill="${imprint.accentHex}">FRONT COVER (${imprint.name})</text>
  <text x="${frontX + trimW / 2}" y="${bleed + 20}" font-family="sans-serif" font-size="3" text-anchor="middle" fill="#64748b">Audience: ${imprint.targetAge}</text>

  <text x="${backX + trimW / 2}" y="${bleed + 14}" font-family="sans-serif" font-weight="bold" font-size="5" text-anchor="middle" fill="#1e293b">BACK COVER</text>
  <text x="${backX + trimW / 2}" y="${bleed + 20}" font-family="sans-serif" font-size="3" text-anchor="middle" fill="#64748b">Buana Studio Direct</text>
</svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const cleanImprintName = imprint.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.href = url;
  link.download = `${cleanImprintName}_cover_template_${result.trimWidthIn}x${result.trimHeightIn}_${input.pageCount}p_${input.bindingType}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
