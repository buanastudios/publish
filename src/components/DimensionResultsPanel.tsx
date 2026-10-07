import React, { useState } from 'react';
import {
  Ruler,
  Copy,
  Check,
  FileSpreadsheet,
  Palette,
} from 'lucide-react';
import type { CalculationInput, CalculationResult, Imprint } from '../types';

interface DimensionResultsPanelProps {
  input: CalculationInput;
  result: CalculationResult;
  imprint: Imprint;
}

export const DimensionResultsPanel: React.FC<DimensionResultsPanelProps> = ({
  input,
  result,
  imprint,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyValue = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyForCanva = () => {
    const text = `Canva Custom Size Dimensions:
Width: ${result.pixelWidth300Dpi} px (or ${result.fullCoverWidthIn.toFixed(3)} in / ${result.fullCoverWidthMm.toFixed(1)} mm)
Height: ${result.pixelHeight300Dpi} px (or ${result.fullCoverHeightIn.toFixed(3)} in / ${result.fullCoverHeightMm.toFixed(1)} mm)
DPI: 300
Imprint: ${imprint.name} (${imprint.targetAge})`;
    copyValue(text, 'canva');
  };

  const copyForAdobe = () => {
    const text = `Adobe InDesign / Photoshop Document Setup:
Document Width: ${result.fullCoverWidthIn.toFixed(3)} in (${result.fullCoverWidthMm.toFixed(1)} mm)
Document Height: ${result.fullCoverHeightIn.toFixed(3)} in (${result.fullCoverHeightMm.toFixed(1)} mm)
Spine Width Guide: ${result.spineWidthIn.toFixed(3)} in (${result.spineWidthMm.toFixed(2)} mm)
Bleed: 0.125 in (3.175 mm)
Resolution: 300 PPI (Pixels: ${result.pixelWidth300Dpi} x ${result.pixelHeight300Dpi} px)
Color Mode: CMYK`;
    copyValue(text, 'adobe');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Ruler className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base tracking-tight">
            Calculated Cover Dimensions
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Ready for Print & Design
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Highlight Grid (Total Canvas, Spine, Safe Area) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Full Cover */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Full Cover (Canvas)
              </span>
              <button
                onClick={() =>
                  copyValue(
                    `${result.fullCoverWidthCurrent.toFixed(2)} x ${result.fullCoverHeightCurrent.toFixed(2)} ${result.unit}`,
                    'fullCover'
                  )
                }
                className="text-slate-400 hover:text-slate-800 transition-colors"
                title="Copy full dimensions"
              >
                {copiedKey === 'fullCover' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="text-xl font-black text-slate-900 tracking-tight">
              {result.fullCoverWidthCurrent.toFixed(2)} × {result.fullCoverHeightCurrent.toFixed(2)} {result.unit}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              {result.unit === 'mm'
                ? `${result.fullCoverWidthIn.toFixed(3)}" × ${result.fullCoverHeightIn.toFixed(3)}"`
                : `${result.fullCoverWidthMm.toFixed(1)} × ${result.fullCoverHeightMm.toFixed(1)} mm`}
            </div>
          </div>

          {/* Spine Width */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 relative group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase text-amber-800 tracking-wider">
                Spine Width
              </span>
              <button
                onClick={() =>
                  copyValue(
                    `${result.spineWidthCurrent.toFixed(2)} ${result.unit}`,
                    'spine'
                  )
                }
                className="text-amber-600 hover:text-amber-950 transition-colors"
                title="Copy spine width"
              >
                {copiedKey === 'spine' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="text-xl font-black text-amber-900 tracking-tight">
              {result.spineWidthCurrent.toFixed(2)} {result.unit}
            </div>
            <div className="text-[11px] text-amber-700/90 mt-1 font-mono">
              {result.unit === 'mm'
                ? `${result.spineWidthIn.toFixed(3)} in (${input.pageCount} pages)`
                : `${result.spineWidthMm.toFixed(2)} mm (${input.pageCount} pages)`}
            </div>
          </div>

          {/* 300 DPI Canvas */}
          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200/80 relative group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase text-indigo-800 tracking-wider">
                300 DPI Pixels
              </span>
              <button
                onClick={() =>
                  copyValue(
                    `${result.pixelWidth300Dpi} x ${result.pixelHeight300Dpi}`,
                    'dpiPixels'
                  )
                }
                className="text-indigo-600 hover:text-indigo-950 transition-colors"
                title="Copy pixel resolution"
              >
                {copiedKey === 'dpiPixels' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="text-xl font-black text-indigo-900 tracking-tight">
              {result.pixelWidth300Dpi} × {result.pixelHeight300Dpi} px
            </div>
            <div className="text-[11px] text-indigo-700/90 mt-1">
              Canva & Photoshop Setup
            </div>
          </div>
        </div>

        {/* Detailed Spec Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <th className="py-2.5 px-4">Component</th>
                <th className="py-2.5 px-4">Millimeters (mm)</th>
                <th className="py-2.5 px-4">Inches (in)</th>
                <th className="py-2.5 px-4 text-right">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
              <tr>
                <td className="py-2.5 px-4 font-bold text-slate-900">Front / Back Trim</td>
                <td className="py-2.5 px-4 font-mono">{result.trimWidthMm.toFixed(1)} × {result.trimHeightMm.toFixed(1)} mm</td>
                <td className="py-2.5 px-4 font-mono">{result.trimWidthIn.toFixed(3)}" × {result.trimHeightIn.toFixed(3)}"</td>
                <td className="py-2.5 px-4 text-right text-slate-500">Trimmed single page size</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-slate-900">Spine Thickness</td>
                <td className="py-2.5 px-4 font-mono">{result.spineWidthMm.toFixed(2)} mm</td>
                <td className="py-2.5 px-4 font-mono">{result.spineWidthIn.toFixed(3)}"</td>
                <td className="py-2.5 px-4 text-right">
                  <span className={result.spineTextAllowed ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                    {result.spineTextAllowed ? 'Text allowed' : 'No spine text'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-slate-900">Bleed (Per Side)</td>
                <td className="py-2.5 px-4 font-mono">{result.bleedMm.toFixed(2)} mm</td>
                <td className="py-2.5 px-4 font-mono">{result.bleedIn.toFixed(3)}"</td>
                <td className="py-2.5 px-4 text-right text-slate-500">Industry standard 0.125"</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-slate-900">Safe Margin</td>
                <td className="py-2.5 px-4 font-mono">{result.safeMarginMm.toFixed(2)} mm</td>
                <td className="py-2.5 px-4 font-mono">{result.safeMarginIn.toFixed(3)}"</td>
                <td className="py-2.5 px-4 text-right text-slate-500">Inside all trim lines</td>
              </tr>
              {input.bindingType === 'hardcover' && (
                <>
                  <tr className="bg-amber-50/50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">Case Wrap-Around</td>
                    <td className="py-2.5 px-4 font-mono">{result.wrapMarginMm.toFixed(1)} mm</td>
                    <td className="py-2.5 px-4 font-mono">{result.wrapMarginIn.toFixed(3)}"</td>
                    <td className="py-2.5 px-4 text-right text-slate-500">Turned in over board</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">Hinge Score Line</td>
                    <td className="py-2.5 px-4 font-mono">{result.hingeMm.toFixed(1)} mm</td>
                    <td className="py-2.5 px-4 font-mono">{result.hingeIn.toFixed(3)}"</td>
                    <td className="py-2.5 px-4 text-right text-slate-500">Hinge flex area</td>
                  </tr>
                </>
              )}
              <tr>
                <td className="py-2.5 px-4 font-bold text-slate-900">Barcode Safe Area</td>
                <td className="py-2.5 px-4 font-mono">{result.barcodeWidthMm.toFixed(1)} × {result.barcodeHeightMm.toFixed(1)} mm</td>
                <td className="py-2.5 px-4 font-mono">{result.barcodeWidthIn.toFixed(2)}" × {result.barcodeHeightIn.toFixed(2)}"</td>
                <td className="py-2.5 px-4 text-right text-slate-500">Back cover bottom quadrant</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick Copy Presets for Software */}
        <div className="pt-2 border-t border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Quick 1-Click Copy for Design Apps
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={copyForCanva}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all flex items-start space-x-3 group"
            >
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 group-hover:bg-teal-500/20">
                <Palette className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Copy for Canva Custom Size</span>
                  {copiedKey === 'canva' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Width: {result.pixelWidth300Dpi}px, Height: {result.pixelHeight300Dpi}px
                </p>
              </div>
            </button>

            <button
              onClick={copyForAdobe}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all flex items-start space-x-3 group"
            >
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-500/20">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Copy for Adobe InDesign/PSD</span>
                  {copiedKey === 'adobe' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {result.fullCoverWidthIn.toFixed(3)}" × {result.fullCoverHeightIn.toFixed(3)}" @ 300 PPI
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
