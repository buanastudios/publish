import React from 'react';
import { Sparkles, Feather, Bookmark, Baby, BookOpen } from 'lucide-react';
import type { Imprint } from '../types';

interface ImprintBannerProps {
  imprint: Imprint;
  onOpenManager: () => void;
}

export const ImprintBanner: React.FC<ImprintBannerProps> = ({ imprint, onOpenManager }) => {
  const getIcon = () => {
    switch (imprint.logoIcon) {
      case 'falah-star':
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'syabab-flame':
        return <Feather className="w-5 h-5 text-indigo-600" />;
      case 'hifzun-shield':
      case 'book-open':
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      default:
        return <Bookmark className="w-5 h-5 text-slate-600" />;
    }
  };

  const getAgeIcon = () => {
    if (imprint.ageCategory === 'kids') {
      return <Baby className="w-4 h-4 text-emerald-600" />;
    }
    return <Feather className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-sm ${imprint.badgeBg} relative overflow-hidden mb-6`}>
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/30 to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-slate-200/60">
            {getIcon()}
          </div>

          <div>
            <div className="flex items-center space-x-2.5 flex-wrap">
              <h2 className="text-lg font-black tracking-tight text-slate-900">
                {imprint.name}
              </h2>
              <span className="inline-flex items-center space-x-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-700 shadow-xs">
                {getAgeIcon()}
                <span>{imprint.targetAge}</span>
              </span>
              <span className="text-xs font-semibold text-slate-500 font-mono">
                ISBN Prefix: {imprint.isbnPrefix}XXXX
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              {imprint.description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-center">
          <button
            onClick={onOpenManager}
            className="text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
          >
            Configure Imprint
          </button>
        </div>
      </div>
    </div>
  );
};
