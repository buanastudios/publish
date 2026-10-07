import React from 'react';
import {
  X,
  BookOpen,
} from 'lucide-react';

interface PublishingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishingGuideModal: React.FC<PublishingGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">
                Publishing Print Cover Guidelines
              </h3>
              <p className="text-xs text-slate-300">
                Industry standards for Amazon KDP, IngramSpark & Buana Studio Direct
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs sm:text-sm">
          {/* Section 1: Bleed & Safe Margin */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>1. Bleed Area (0.125 in / 3.2 mm)</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Bleed is the extra space on the outside edges of your cover that will be trimmed off during printing. To avoid unwanted white borders after cutting, make sure your background imagery and color fills extend all the way to the outer bleed edge.
            </p>
          </div>

          {/* Section 2: Safe Zone */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              <span>2. Safe Margin Zone (0.125 in / 3.2 mm inside trim)</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Keep all essential content—such as book titles, subtitles, author names, illustrations, and logos—at least 0.125 in (3.2 mm) inside the cut line to prevent accidental trimming.
            </p>
          </div>

          {/* Section 3: Spine Requirements */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>3. Spine Text Guidelines</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Spine text requires a minimum spine thickness of <strong>0.0625 in (1.58 mm)</strong>, which typically corresponds to <strong>79–80 pages</strong> on white or cream paper. For books with fewer pages, leave the spine blank without text.
            </p>
          </div>

          {/* Section 4: Hardcover vs Paperback */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
            <h4 className="font-bold text-amber-900 text-sm">
              Hardcover (Case Laminate) Differences
            </h4>
            <ul className="list-disc list-inside space-y-1 text-amber-800 text-xs">
              <li><strong>Turn-In Wrap Area:</strong> 0.59 in (15 mm) on all 4 sides wrapped around the binder board.</li>
              <li><strong>Hinge Score Line:</strong> 0.394 in (10 mm) flex channel on either side of the spine.</li>
              <li><strong>Board Overhang:</strong> Binder board extends 0.125 in (3.18 mm) beyond the interior pages.</li>
            </ul>
          </div>

          {/* Section 5: Barcode Placement */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block" />
              <span>5. Barcode & ISBN Placement</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              The standard barcode box is <strong>2.0 in wide × 1.2 in high (50.8 × 30.5 mm)</strong>, positioned on the lower half of the back cover, at least 0.25 in (6.35 mm) away from trim lines and spine fold lines.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
