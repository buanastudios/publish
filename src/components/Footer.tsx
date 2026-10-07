import React from 'react';
import { BookOpen, HelpCircle } from 'lucide-react';

interface FooterProps {
  onOpenGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGuide }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">
                BUANA STUDIO DIRECT
              </div>
              <p className="text-[11px] text-slate-500">
                Print Cover Calculator & Template System for Multi-Brand Imprints
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs">
            <button
              onClick={onOpenGuide}
              className="hover:text-white transition-colors flex items-center space-x-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Cover Specifications Guide</span>
            </button>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500">
              Compatible with Amazon KDP & Print-on-Demand
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>
            © {new Date().getFullYear()} Buana Studio Direct Publishing. All rights reserved.
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>Featuring imprints:</span>
            <strong className="text-emerald-400">FALAH BOOKS</strong>
            <span>(&lt; 13 yo) &amp;</span>
            <strong className="text-indigo-400">BAYAN PRESS</strong>
            <span>(&ge; 13 yo)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
