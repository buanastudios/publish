import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  Image as ImageIcon,
  Code,
  FileCheck,
  Layers,
} from 'lucide-react';
import type { CalculationInput, CalculationResult, Imprint } from '../types';
import {
  downloadPngTemplate,
  downloadPdfTemplate,
  downloadSvgTemplate,
} from '../utils/templateGenerator';
import confetti from 'canvas-confetti';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  input: CalculationInput;
  result: CalculationResult;
  imprint: Imprint;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  input,
  result,
  imprint,
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // Ignore if confetti is not available
    }
  };

  const handleDownloadPng = (dpi: number = 300) => {
    setDownloadingFormat('png');
    downloadPngTemplate(input, result, imprint, dpi);
    triggerConfetti();
    setTimeout(() => setDownloadingFormat(null), 1000);
  };

  const handleDownloadPdf = () => {
    setDownloadingFormat('pdf');
    downloadPdfTemplate(input, result, imprint);
    triggerConfetti();
    setTimeout(() => setDownloadingFormat(null), 1000);
  };

  const handleDownloadSvg = () => {
    setDownloadingFormat('svg');
    downloadSvgTemplate(input, result, imprint);
    triggerConfetti();
    setTimeout(() => setDownloadingFormat(null), 1000);
  };

  const handleDownloadJson = () => {
    const data = {
      generator: 'Buana Studio Direct Cover Calculator',
      imprint: {
        id: imprint.id,
        name: imprint.name,
        targetAge: imprint.targetAge,
        isbnPrefix: imprint.isbnPrefix,
      },
      book: {
        title: input.bookTitle || 'Untitled Book',
        author: input.authorName || 'Anonymous',
        isbn: input.isbn || `${imprint.isbnPrefix}0001`,
        bindingType: input.bindingType,
        interiorType: input.interiorType,
        paperType: input.paperType,
        pageCount: input.pageCount,
        readingDirection: input.readingDirection,
      },
      dimensions: {
        unit: result.unit,
        fullCoverWidthIn: result.fullCoverWidthIn,
        fullCoverHeightIn: result.fullCoverHeightIn,
        fullCoverWidthMm: result.fullCoverWidthMm,
        fullCoverHeightMm: result.fullCoverHeightMm,
        spineWidthIn: result.spineWidthIn,
        spineWidthMm: result.spineWidthMm,
        bleedIn: result.bleedIn,
        bleedMm: result.bleedMm,
        safeMarginIn: result.safeMarginIn,
        safeMarginMm: result.safeMarginMm,
        resolution300Dpi: {
          widthPx: result.pixelWidth300Dpi,
          heightPx: result.pixelHeight300Dpi,
        },
      },
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const cleanImprintName = imprint.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.href = url;
    link.download = `${cleanImprintName}_cover_specs_${result.trimWidthIn}x${result.trimHeightIn}_${input.pageCount}p.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden relative">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">
                Download Cover Template
              </h3>
              <p className="text-xs text-slate-300">
                Imprint: <span className="font-bold text-amber-400">{imprint.name}</span> ({imprint.targetAge})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900">Format:</span> {result.trimWidthIn}" × {result.trimHeightIn}" ({result.trimWidthMm.toFixed(1)} × {result.trimHeightMm.toFixed(1)} mm)
            </div>
            <div>
              <span className="font-bold text-slate-900">Spine:</span> {result.spineWidthCurrent.toFixed(2)} {result.unit} ({input.pageCount} pages)
            </div>
          </div>

          <div className="space-y-3">
            {/* 1. PDF Vector Template */}
            <div className="p-4 rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all bg-white flex items-center justify-between group">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-slate-900">
                      Print-Ready Vector PDF Template
                    </h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Exact millimeter vector lines, spine folds & safe margins for InDesign, Illustrator & Affinity.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadPdf}
                disabled={downloadingFormat === 'pdf'}
                className="ml-3 px-4 py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 flex-shrink-0 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>

            {/* 2. PNG 300 DPI Guide Template */}
            <div className="p-4 rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all bg-white flex items-center justify-between group">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-slate-900">
                      High-Resolution PNG Guide (300 DPI)
                    </h4>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                      Canva & Photoshop
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Crisp guide layer ({result.pixelWidth300Dpi} × {result.pixelHeight300Dpi} px) with color-coded bleed and safe areas.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownloadPng(300)}
                disabled={downloadingFormat === 'png'}
                className="ml-3 px-4 py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 flex-shrink-0 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PNG (300 DPI)</span>
              </button>
            </div>

            {/* 3. SVG Vector File */}
            <div className="p-4 rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all bg-white flex items-center justify-between group">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Scalable Vector Graphics (SVG)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Editable layers ready to import directly into Figma, Illustrator, or Inkscape.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadSvg}
                disabled={downloadingFormat === 'svg'}
                className="ml-3 px-4 py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 flex-shrink-0 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SVG</span>
              </button>
            </div>

            {/* 4. JSON Spec Data */}
            <div className="p-4 rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all bg-white flex items-center justify-between group">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Publisher JSON Specification Data
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Raw calculation parameters, page caliper, spine width and barcode metadata.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadJson}
                className="ml-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* Quick Design Instructions */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>How to use your downloaded template:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1">
              <li>Open your design program (Canva, Photoshop, Illustrator, InDesign).</li>
              <li>Place this template on the bottom guide layer or top layer with 30-40% opacity.</li>
              <li>Extend background colors/photos all the way to the outer pink bleed line.</li>
              <li>Ensure all book text and logos stay inside the blue dashed safe zone.</li>
              <li>Hide or delete the template guide layer before exporting your final PDF cover.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
