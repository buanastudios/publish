import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Feather,
  Baby,
  CheckCircle2,
} from 'lucide-react';
import type { Imprint } from '../types';

interface ImprintManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imprints: Imprint[];
  onSaveImprints: (updated: Imprint[]) => void;
  onSelectImprint: (imprint: Imprint) => void;
  activeImprintId: string;
}

export const ImprintManagerModal: React.FC<ImprintManagerModalProps> = ({
  isOpen,
  onClose,
  imprints,
  onSaveImprints,
  onSelectImprint,
  activeImprintId,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newTargetAge, setNewTargetAge] = useState('Below 13 yo');
  const [newAgeCategory, setNewAgeCategory] = useState<'kids' | 'youth' | 'scholar' | 'all'>('kids');
  const [newDescription, setNewDescription] = useState('');
  const [newIsbnPrefix, setNewIsbnPrefix] = useState('978-623-');
  const [newAccentColor, setNewAccentColor] = useState('#059669');

  if (!isOpen) return null;

  const handleCreateImprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const id = newName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newImprint: Imprint = {
      id: `custom-${id}-${Date.now()}`,
      name: newName.trim().toUpperCase(),
      tagline: newTagline.trim() || 'Custom Publishing Imprint',
      targetAge: newTargetAge,
      ageCategory: newAgeCategory,
      description: newDescription.trim() || `Specialized publishing imprint for ${newTargetAge}.`,
      badgeColor: 'text-slate-800',
      badgeBg: 'bg-slate-50 border-slate-300 text-slate-800',
      badgeBorder: 'border-slate-300',
      accentHex: newAccentColor,
      isbnPrefix: newIsbnPrefix.trim() || '978-623-',
      recommendedTrimSizes: ['6x9', '5.5x8.5'],
      suggestedPaper: 'white',
      logoIcon: 'bookmark',
    };

    const updated = [...imprints, newImprint];
    onSaveImprints(updated);
    onSelectImprint(newImprint);
    setIsAddingNew(false);
    setNewName('');
    setNewTagline('');
    setNewDescription('');
  };

  const handleDeleteImprint = (id: string) => {
    if (imprints.length <= 1) return;
    const updated = imprints.filter((i) => i.id !== id);
    onSaveImprints(updated);
    if (activeImprintId === id && updated.length > 0) {
      onSelectImprint(updated[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500 text-white font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">
                Brand Imprints & Audience Segments
              </h3>
              <p className="text-xs text-slate-300">
                Configure your publishing house imprints (e.g. FALAH, SYABAB, HIFZUN)
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Action Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Configured Imprints ({imprints.length})
            </span>
            {!isAddingNew && (
              <button
                onClick={() => setIsAddingNew(true)}
                className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Imprint</span>
              </button>
            )}
          </div>

          {/* Add New Imprint Form */}
          {isAddingNew && (
            <form
              onSubmit={handleCreateImprint}
              className="p-5 bg-slate-50 rounded-2xl border border-indigo-200 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="font-bold text-sm text-indigo-900">
                  Create New Brand Imprint
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Imprint Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NUR, ATLAS, HIKMAH"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-xs font-bold uppercase bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Segment / Age Bracket *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Below 13 yo / 13-24 yo"
                    value={newTargetAge}
                    onChange={(e) => setNewTargetAge(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Audience Category
                  </label>
                  <select
                    value={newAgeCategory}
                    onChange={(e) => setNewAgeCategory(e.target.value as any)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="kids">Children / Kids (&lt; 13 yo)</option>
                    <option value="youth">Youth / Young Adult (13-24 yo)</option>
                    <option value="scholar">Scholars & Reference</option>
                    <option value="all">General / All Ages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ISBN Prefix
                  </label>
                  <input
                    type="text"
                    value={newIsbnPrefix}
                    onChange={(e) => setNewIsbnPrefix(e.target.value)}
                    placeholder="978-623-"
                    className="w-full text-xs font-mono bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Accent Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={newAccentColor}
                      onChange={(e) => setNewAccentColor(e.target.value)}
                      className="w-9 h-8 p-0 border border-slate-300 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-600">{newAccentColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline & Mission Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe what genres and audience this imprint specializes in..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  Save Imprint
                </button>
              </div>
            </form>
          )}

          {/* List of Imprints */}
          <div className="space-y-3">
            {imprints.map((imp) => {
              const isActive = imp.id === activeImprintId;
              const isKids = imp.ageCategory === 'kids';

              return (
                <div
                  key={imp.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-200 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-xs"
                      style={{ backgroundColor: imp.accentHex }}
                    >
                      {isKids ? <Baby className="w-5 h-5" /> : <Feather className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {imp.name}
                        </h4>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {imp.targetAge}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {imp.description}
                      </p>
                      <div className="text-[11px] text-slate-500 mt-1.5 font-mono">
                        ISBN: {imp.isbnPrefix}XXXX
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {!isActive && (
                      <button
                        onClick={() => onSelectImprint(imp)}
                        className="text-xs font-bold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
                      >
                        Select
                      </button>
                    )}
                    {imprints.length > 1 && (
                      <button
                        onClick={() => handleDeleteImprint(imp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete imprint"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
