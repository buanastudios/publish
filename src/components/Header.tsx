import React from 'react';
import { BookOpen, Sparkles, Layers, Sliders } from 'lucide-react';
import type { Imprint } from '../types';

interface HeaderProps {
  selectedImprint: Imprint;
  imprints: Imprint[];
  onSelectImprint: (imprint: Imprint) => void;
  onOpenImprintManager: () => void;
  onOpenGuideModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedImprint,
  imprints,
  onSelectImprint,
  onOpenImprintManager,
  onOpenGuideModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  BUANA STUDIO
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Direct Publishing
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Print Cover Calculator & Multi-Imprint Template Engine
              </p>
            </div>
          </div>

          {/* Quick Actions & Links */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenGuideModal}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center space-x-1"
            >
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="hidden md:inline">Publishing Specs</span>
            </button>

            <button
              onClick={onOpenImprintManager}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Sliders className="w-4 h-4" />
              <span>Manage Imprints</span>
            </button>
          </div>
        </div>

        {/* Imprint Quick Bar */}
        <div className="py-2.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
              Active Imprint:
            </span>
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              {imprints.map((imp) => {
                const isSelected = imp.id === selectedImprint.id;
                return (
                  <button
                    key={imp.id}
                    onClick={() => onSelectImprint(imp)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-150 flex items-center space-x-1.5 border ${
                      isSelected
                        ? `${imp.badgeBg} shadow-sm ring-2 ring-offset-1 ring-slate-400`
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{imp.name}</span>
                    <span className="text-[10px] opacity-75 font-medium">({imp.targetAge.split(' ')[0]})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic hidden lg:block">
            Amazon KDP & International Print-Ready Compatible
          </div>
        </div>
      </div>
    </header>
  );
};
