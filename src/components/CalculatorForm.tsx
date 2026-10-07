import React from 'react';
import {
  Download,
  Calculator,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import type { CalculationInput, Imprint, Unit, BindingType, InteriorType, PaperType, ReadingDirection } from '../types';
import { TRIM_PRESETS } from '../data/presets';

interface CalculatorFormProps {
  input: CalculationInput;
  imprints: Imprint[];
  onChange: (updated: Partial<CalculationInput>) => void;
  onCalculate: () => void;
  onReset: () => void;
  onOpenDownloadModal: () => void;
  spineWarning: string | null;
  spineTextAllowed: boolean;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  input,
  imprints,
  onChange,
  onCalculate,
  onReset,
  onOpenDownloadModal,
  spineWarning,
  spineTextAllowed,
}) => {
  const handleUnitChange = (newUnit: Unit) => {
    if (newUnit === input.unit) return;

    let newWidth = input.trimWidth;
    let newHeight = input.trimHeight;

    if (newUnit === 'mm') {
      newWidth = Number((input.trimWidth * 25.4).toFixed(1));
      newHeight = Number((input.trimHeight * 25.4).toFixed(1));
    } else {
      newWidth = Number((input.trimWidth / 25.4).toFixed(3));
      newHeight = Number((input.trimHeight / 25.4).toFixed(3));
    }

    onChange({
      unit: newUnit,
      trimWidth: newWidth,
      trimHeight: newHeight,
    });
  };

  const handlePresetChange = (presetId: string) => {
    const found = TRIM_PRESETS.find((p) => p.id === presetId);
    if (!found) return;

    if (found.id === 'custom') {
      onChange({ trimPresetId: 'custom' });
      return;
    }

    if (input.unit === 'mm') {
      onChange({
        trimPresetId: presetId,
        trimWidth: found.widthMm,
        trimHeight: found.heightMm,
      });
    } else {
      onChange({
        trimPresetId: presetId,
        trimWidth: found.widthIn,
        trimHeight: found.heightIn,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base tracking-tight">
            Enter Your Book Information
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          KDP & Print-On-Demand Spec
        </span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCalculate();
        }}
        className="p-6 space-y-5"
      >
        {/* Imprint & Audience Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Publishing Imprint & Target Segment</span>
            <span className="text-[11px] text-indigo-600 font-medium lowercase">
              custom brands
            </span>
          </label>
          <select
            value={input.imprintId}
            onChange={(e) => onChange({ imprintId: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all shadow-xs"
          >
            {imprints.map((imp) => (
              <option key={imp.id} value={imp.id}>
                {imp.name} — ({imp.targetAge})
              </option>
            ))}
          </select>
        </div>

        {/* Binding Type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Binding type
          </label>
          <select
            value={input.bindingType}
            onChange={(e) => onChange({ bindingType: e.target.value as BindingType })}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all shadow-xs"
          >
            <option value="paperback">Paperback (Softcover / Perfect Bound)</option>
            <option value="hardcover">Hardcover (Case Laminate / Wrap)</option>
          </select>
        </div>

        {/* Interior Type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Interior type
          </label>
          <select
            value={input.interiorType}
            onChange={(e) => onChange({ interiorType: e.target.value as InteriorType })}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all shadow-xs"
          >
            <option value="black_white">Black and white interior</option>
            <option value="standard_color">Standard color interior</option>
            <option value="premium_color">Premium color interior (Recommended for Picture Books)</option>
          </select>
        </div>

        {/* Paper Type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Paper type
          </label>
          <select
            value={input.paperType}
            onChange={(e) => onChange({ paperType: e.target.value as PaperType })}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all shadow-xs"
          >
            <option value="white">White paper (50# / 75-80 GSM / 444 PPI)</option>
            <option value="cream">Cream paper (55# / 80-90 GSM / 400 PPI)</option>
          </select>
        </div>

        {/* Reading Direction */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Reading Direction
          </label>
          <select
            value={input.readingDirection}
            onChange={(e) => onChange({ readingDirection: e.target.value as ReadingDirection })}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all shadow-xs"
          >
            <option value="ltr">Left to Right (English, Indonesian, Standard)</option>
            <option value="rtl">Right to Left (Arabic, Hebrew, Manga)</option>
          </select>
        </div>

        {/* Measurement Units */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Measurement units
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleUnitChange('mm')}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                input.unit === 'mm'
                  ? 'bg-amber-500 text-slate-900 border-amber-600 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Millimeters (mm)
            </button>
            <button
              type="button"
              onClick={() => handleUnitChange('in')}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                input.unit === 'in'
                  ? 'bg-amber-500 text-slate-900 border-amber-600 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Inches (in)
            </button>
          </div>
        </div>

        {/* Interior Trim Size Preset */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Interior trim size
          </label>
          <select
            value={input.trimPresetId}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all shadow-xs"
          >
            {TRIM_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Trim Width & Height Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Trim width ({input.unit})
            </label>
            <input
              type="number"
              step={input.unit === 'in' ? '0.01' : '0.5'}
              min="1"
              value={input.trimWidth}
              onChange={(e) =>
                onChange({
                  trimWidth: parseFloat(e.target.value) || 0,
                  trimPresetId: 'custom',
                })
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all shadow-xs"
              placeholder={input.unit === 'in' ? '6.0' : '152.4'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Trim height ({input.unit})
            </label>
            <input
              type="number"
              step={input.unit === 'in' ? '0.01' : '0.5'}
              min="1"
              value={input.trimHeight}
              onChange={(e) =>
                onChange({
                  trimHeight: parseFloat(e.target.value) || 0,
                  trimPresetId: 'custom',
                })
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all shadow-xs"
              placeholder={input.unit === 'in' ? '9.0' : '228.6'}
            />
          </div>
        </div>

        {/* Page Count */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Page count
            </label>
            <span className="text-[11px] text-slate-500">
              Min: 24 | Max: 828
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-1.5">
            Number of pages at your formatted interior trim size.
          </p>
          <input
            type="number"
            min="24"
            max="1000"
            value={input.pageCount}
            onChange={(e) => onChange({ pageCount: parseInt(e.target.value) || 24 })}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all shadow-xs"
            placeholder="e.g. 120"
          />

          {/* Spine Status Message */}
          <div className="mt-2 text-xs">
            {spineTextAllowed ? (
              <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Spine text supported (width ≥ 1.58 mm / 0.0625 in)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span>{spineWarning || 'Spine is narrow. Minimum ~79 pages needed for spine text.'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Optional Metadata Accordion / Inputs */}
        <div className="pt-2 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Template Labels (Optional)
            </span>
            <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={input.includeBarcodeBox}
                onChange={(e) => onChange({ includeBarcodeBox: e.target.checked })}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
              />
              <span className="font-semibold">Include Barcode Box</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              value={input.bookTitle || ''}
              onChange={(e) => onChange({ bookTitle: e.target.value })}
              placeholder="Book Title (e.g. Petualangan Falah)"
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="text"
              value={input.authorName || ''}
              onChange={(e) => onChange({ authorName: e.target.value })}
              placeholder="Author Name"
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-200 space-y-2.5">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-extrabold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
          >
            <Calculator className="w-4 h-4" />
            <span>Calculate dimensions</span>
          </button>

          <button
            type="button"
            onClick={onOpenDownloadModal}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download Template (PDF / PNG / SVG)</span>
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
            >
              Reset book information
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
