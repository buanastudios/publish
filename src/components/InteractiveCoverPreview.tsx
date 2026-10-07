import React, { useState } from 'react';
import {
  Layers,
  Eye,
  BookOpen,
  Copy,
  Check,
  Download,
} from 'lucide-react';
import type { CalculationInput, CalculationResult, Imprint } from '../types';

interface InteractiveCoverPreviewProps {
  input: CalculationInput;
  result: CalculationResult;
  imprint: Imprint;
  onOpenDownloadModal: () => void;
}

export const InteractiveCoverPreview: React.FC<InteractiveCoverPreviewProps> = ({
  input,
  result,
  imprint,
  onOpenDownloadModal,
}) => {
  const [viewMode, setViewMode] = useState<'guide' | 'mockup' | '3d'>('guide');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isRTL = input.readingDirection === 'rtl';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const totalW = result.fullCoverWidthIn;
  const totalH = result.fullCoverHeightIn;
  const aspectRatio = totalW / totalH;

  const viewBoxW = 1000;
  const viewBoxH = 1000 / aspectRatio;

  const scale = viewBoxW / totalW;
  const bleedSvg = result.bleedIn * scale;
  const trimWSvg = result.trimWidthIn * scale;
  const trimHSvg = result.trimHeightIn * scale;
  const spineWSvg = result.spineWidthIn * scale;
  const safeMarginSvg = result.safeMarginIn * scale;
  const spineSafeMarginSvg = result.spineSafeMarginIn * scale;

  let backCoverLeft = bleedSvg;
  let spineLeft = bleedSvg + trimWSvg;
  let frontCoverLeft = bleedSvg + trimWSvg + spineWSvg;

  if (isRTL) {
    frontCoverLeft = bleedSvg;
    spineLeft = bleedSvg + trimWSvg;
    backCoverLeft = bleedSvg + trimWSvg + spineWSvg;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Top Bar with Mode Controls */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between flex-wrap gap-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-sm tracking-tight">Live Cover Layout</span>
          <span className="text-xs text-slate-400 hidden md:inline">
            ({result.fullCoverWidthCurrent.toFixed(2)} x {result.fullCoverHeightCurrent.toFixed(2)} {result.unit})
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setViewMode('guide')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
              viewMode === 'guide'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Guide Grid</span>
          </button>
          <button
            onClick={() => setViewMode('mockup')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
              viewMode === 'mockup'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Flat Artwork</span>
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
              viewMode === '3d'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>3D Preview</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="p-4 sm:p-6 bg-slate-100 flex-1 flex flex-col justify-center items-center relative min-h-[380px] overflow-hidden">
        {/* Dimension Chips at Top */}
        <div className="w-full flex items-center justify-between text-xs text-slate-600 mb-3 px-1">
          <div className="flex items-center space-x-3">
            <span className="font-semibold bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              Full Width: <strong className="text-slate-900">{result.fullCoverWidthCurrent.toFixed(2)} {result.unit}</strong>
            </span>
            <span className="font-semibold bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              Spine: <strong className="text-amber-600">{result.spineWidthCurrent.toFixed(2)} {result.unit}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                copyToClipboard(
                  `${result.pixelWidth300Dpi}x${result.pixelHeight300Dpi}`,
                  'pixels'
                )
              }
              className="text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 flex items-center space-x-1 transition-all shadow-2xs"
              title="Copy 300 DPI Resolution for Canva or Photoshop"
            >
              {copiedKey === 'pixels' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{result.pixelWidth300Dpi} × {result.pixelHeight300Dpi} px (300 DPI)</span>
            </button>
          </div>
        </div>

        {/* 3D Realistic View Mode */}
        {viewMode === '3d' && (
          <div className="w-full h-full flex items-center justify-center py-6">
            <div className="relative group transition-transform duration-500 hover:rotate-y-[-15deg]">
              {/* 3D Book Container */}
              <div
                className="relative rounded-r-md shadow-2xl overflow-hidden border border-slate-300"
                style={{
                  width: `${Math.min(260, 240 * (result.trimWidthIn / 6))}px`,
                  height: `${Math.min(360, 340 * (result.trimHeightIn / 9))}px`,
                  backgroundColor: imprint.accentHex,
                  backgroundImage: `radial-gradient(circle at top left, ${imprint.accentHex}, #0f172a)`,
                }}
              >
                {/* Book Cover Design */}
                <div className="p-6 h-full flex flex-col justify-between text-white relative z-10">
                  <div>
                    <div className="inline-block bg-white/20 backdrop-blur-xs text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider mb-3">
                      {imprint.name}
                    </div>
                    <h3 className="text-xl font-black leading-tight drop-shadow-md">
                      {input.bookTitle || 'Sample Book Title'}
                    </h3>
                    <p className="text-xs text-white/80 mt-1 font-medium">
                      {input.authorName || 'Author Name'}
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="text-[10px] text-white/70">
                      <span>{input.pageCount} Pages</span> • <span>{input.bindingType}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] bg-black/40 px-2 py-0.5 rounded text-white/90">
                        {imprint.targetAge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gloss / Sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 to-transparent" />
              </div>

              {/* Book Spine 3D simulation */}
              <div
                className="absolute top-0 bottom-0 left-0 -translate-x-full origin-right bg-slate-900 text-white flex items-center justify-center px-1 shadow-inner border-r border-slate-800"
                style={{
                  width: `${Math.max(16, Math.min(48, result.spineWidthIn * 40))}px`,
                }}
              >
                <span className="text-[9px] font-bold rotate-90 whitespace-nowrap tracking-wider text-slate-300">
                  {input.bookTitle || imprint.name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2D Flat Artwork Mode */}
        {viewMode === 'mockup' && (
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden border border-slate-300 flex">
            {/* Back Cover */}
            <div className="flex-1 bg-slate-800 text-slate-100 p-6 flex flex-col justify-between relative min-h-[300px]">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Buana Studio Direct
                </div>
                <p className="text-xs text-slate-300 mt-4 leading-relaxed line-clamp-6">
                  Experience world-class publication under the prestigious {imprint.name} imprint, crafted specifically for {imprint.targetAge}.
                </p>
              </div>
              {input.includeBarcodeBox && (
                <div className="bg-white p-2 rounded w-28 text-slate-900 text-center shadow-xs">
                  <div className="h-8 bg-slate-900 rounded-2xs mb-1" />
                  <div className="text-[8px] font-mono font-bold">
                    ISBN {input.isbn || imprint.isbnPrefix + '0001'}
                  </div>
                </div>
              )}
            </div>

            {/* Spine */}
            <div
              className="bg-slate-900 text-white flex items-center justify-center border-x border-slate-700 py-4 px-1"
              style={{
                width: `${Math.max(24, Math.min(60, (result.spineWidthIn / result.fullCoverWidthIn) * 600))}px`,
              }}
            >
              {result.spineTextAllowed && (
                <span className="text-[10px] font-bold rotate-90 whitespace-nowrap tracking-wider text-amber-400">
                  {input.bookTitle || imprint.name}
                </span>
              )}
            </div>

            {/* Front Cover */}
            <div
              className="flex-1 p-6 flex flex-col justify-between text-white relative min-h-[300px]"
              style={{
                backgroundColor: imprint.accentHex,
                backgroundImage: `linear-gradient(135deg, ${imprint.accentHex} 0%, #0f172a 100%)`,
              }}
            >
              <div>
                <div className="inline-block bg-white/25 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mb-3">
                  {imprint.name}
                </div>
                <h2 className="text-xl font-black leading-tight drop-shadow">
                  {input.bookTitle || 'Book Title Here'}
                </h2>
                <p className="text-xs text-white/90 mt-1">
                  {input.authorName || 'Author Name'}
                </p>
              </div>

              <div className="text-[10px] text-white/75 flex justify-between">
                <span>{imprint.targetAge}</span>
                <span>{input.pageCount} Pages</span>
              </div>
            </div>
          </div>
        )}

        {/* Standard Guide Grid Mode */}
        {viewMode === 'guide' && (
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-3xl shadow-lg rounded-sm overflow-hidden bg-white border border-slate-300">
              <svg
                viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
                className="w-full h-auto block select-none"
              >
                <defs>
                  <pattern
                    id="bleedHatchPreview"
                    width="12"
                    height="12"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="12"
                      stroke="rgba(244,63,94,0.35)"
                      strokeWidth="2.5"
                    />
                  </pattern>
                </defs>

                {/* Bleed Background */}
                <rect x="0" y="0" width={viewBoxW} height={viewBoxH} fill="#ffe4e6" />
                <rect x="0" y="0" width={viewBoxW} height={viewBoxH} fill="url(#bleedHatchPreview)" />

                {/* Clean Interior */}
                <rect
                  x={bleedSvg}
                  y={bleedSvg}
                  width={viewBoxW - bleedSvg * 2}
                  height={viewBoxH - bleedSvg * 2}
                  fill="#ffffff"
                />

                {/* Trim Line */}
                <rect
                  x={bleedSvg}
                  y={bleedSvg}
                  width={viewBoxW - bleedSvg * 2}
                  height={viewBoxH - bleedSvg * 2}
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="2"
                />

                {/* Spine Fold Lines */}
                <line
                  x1={spineLeft}
                  y1={bleedSvg}
                  x2={spineLeft}
                  y2={viewBoxH - bleedSvg}
                  stroke="#1e293b"
                  strokeWidth="2"
                />
                <line
                  x1={spineLeft + spineWSvg}
                  y1={bleedSvg}
                  x2={spineLeft + spineWSvg}
                  y2={viewBoxH - bleedSvg}
                  stroke="#1e293b"
                  strokeWidth="2"
                />
                {/* Spine Center Fold */}
                <line
                  x1={spineLeft + spineWSvg / 2}
                  y1={bleedSvg}
                  x2={spineLeft + spineWSvg / 2}
                  y2={viewBoxH - bleedSvg}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Safe Margins (Cyan) */}
                {/* Back Cover Safe */}
                <rect
                  x={backCoverLeft + safeMarginSvg}
                  y={bleedSvg + safeMarginSvg}
                  width={trimWSvg - safeMarginSvg * 2}
                  height={trimHSvg - safeMarginSvg * 2}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />
                {/* Front Cover Safe */}
                <rect
                  x={frontCoverLeft + safeMarginSvg}
                  y={bleedSvg + safeMarginSvg}
                  width={trimWSvg - safeMarginSvg * 2}
                  height={trimHSvg - safeMarginSvg * 2}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />

                {/* Spine Safe Margin if allowed */}
                {result.spineTextAllowed && spineWSvg > spineSafeMarginSvg * 2 && (
                  <rect
                    x={spineLeft + spineSafeMarginSvg}
                    y={bleedSvg + safeMarginSvg}
                    width={spineWSvg - spineSafeMarginSvg * 2}
                    height={trimHSvg - safeMarginSvg * 2}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                  />
                )}

                {/* Barcode Box */}
                {input.includeBarcodeBox && (
                  <g>
                    <rect
                      x={
                        isRTL
                          ? backCoverLeft + trimWSvg - (result.barcodeWidthIn * scale) - (0.25 * scale)
                          : backCoverLeft + 0.25 * scale
                      }
                      y={viewBoxH - bleedSvg - (0.25 * scale) - (result.barcodeHeightIn * scale)}
                      width={result.barcodeWidthIn * scale}
                      height={result.barcodeHeightIn * scale}
                      fill="#ffffff"
                      stroke="#64748b"
                      strokeWidth="1.2"
                    />
                    <text
                      x={
                        isRTL
                          ? backCoverLeft + trimWSvg - (result.barcodeWidthIn * scale) / 2 - (0.25 * scale)
                          : backCoverLeft + (0.25 * scale) + (result.barcodeWidthIn * scale) / 2
                      }
                      y={viewBoxH - bleedSvg - (0.25 * scale) - (result.barcodeHeightIn * scale) / 2 + 4}
                      fontFamily="sans-serif"
                      fontSize={Math.max(10, Math.round(scale * 0.12))}
                      textAnchor="middle"
                      fill="#475569"
                      fontWeight="bold"
                    >
                      BARCODE & ISBN
                    </text>
                  </g>
                )}

                {/* Front Cover Text */}
                <text
                  x={frontCoverLeft + trimWSvg / 2}
                  y={bleedSvg + trimHSvg * 0.18}
                  fontFamily="sans-serif"
                  fontSize="22"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill={imprint.accentHex}
                >
                  FRONT COVER
                </text>
                <text
                  x={frontCoverLeft + trimWSvg / 2}
                  y={bleedSvg + trimHSvg * 0.25}
                  fontFamily="sans-serif"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#334155"
                >
                  {imprint.name}
                </text>
                <text
                  x={frontCoverLeft + trimWSvg / 2}
                  y={bleedSvg + trimHSvg * 0.31}
                  fontFamily="sans-serif"
                  fontSize="12"
                  textAnchor="middle"
                  fill="#64748b"
                >
                  Target: {imprint.targetAge}
                </text>

                {/* Back Cover Text */}
                <text
                  x={backCoverLeft + trimWSvg / 2}
                  y={bleedSvg + trimHSvg * 0.18}
                  fontFamily="sans-serif"
                  fontSize="22"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#1e293b"
                >
                  BACK COVER
                </text>
                <text
                  x={backCoverLeft + trimWSvg / 2}
                  y={bleedSvg + trimHSvg * 0.25}
                  fontFamily="sans-serif"
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#475569"
                >
                  BUANA STUDIO DIRECT
                </text>
                <text
                  x={backCoverLeft + trimWSvg / 2}
                  y={bleedSvg + trimHSvg * 0.31}
                  fontFamily="sans-serif"
                  fontSize="11"
                  textAnchor="middle"
                  fill="#64748b"
                >
                  {input.bindingType.toUpperCase()} • {input.pageCount} Pages
                </text>

                {/* Spine Text Preview */}
                {result.spineTextAllowed && (
                  <text
                    x={spineLeft + spineWSvg / 2}
                    y={bleedSvg + trimHSvg / 2}
                    transform={`rotate(90, ${spineLeft + spineWSvg / 2}, ${bleedSvg + trimHSvg / 2})`}
                    fontFamily="sans-serif"
                    fontSize={Math.max(10, Math.min(16, spineWSvg * 0.5))}
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="#0f172a"
                  >
                    {input.bookTitle ? `${input.bookTitle}  •  ${imprint.name}` : `BOOK TITLE  •  ${imprint.name}`}
                  </text>
                )}
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Quick Info Footer */}
      <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center space-x-4 flex-wrap gap-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 bg-rose-200 border border-rose-400 rounded-2xs inline-block" />
            <span className="text-slate-600 font-medium">Bleed ({result.bleedCurrent.toFixed(2)} {result.unit})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-0.5 bg-slate-900 inline-block" />
            <span className="text-slate-600 font-medium">Cut & Trim Line</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-0.5 bg-sky-600 border-b border-dashed border-sky-600 inline-block" />
            <span className="text-slate-600 font-medium">Safe Margin Zone</span>
          </div>
        </div>

        <button
          onClick={onOpenDownloadModal}
          className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1 hover:underline"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Template Package</span>
        </button>
      </div>
    </div>
  );
};
