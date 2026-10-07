import React, { useState, useMemo } from 'react';
import { ImprintBanner } from '../components/ImprintBanner';
import { CalculatorForm } from '../components/CalculatorForm';
import { InteractiveCoverPreview } from '../components/InteractiveCoverPreview';
import { DimensionResultsPanel } from '../components/DimensionResultsPanel';
import { DownloadModal } from '../components/DownloadModal';
import { ImprintManagerModal } from '../components/ImprintManagerModal';
import { PublishingGuideModal } from '../components/PublishingGuideModal';
import { DEFAULT_IMPRINTS } from '../data/imprints';
import { calculateBookCover } from '../utils/calculator';
import type { CalculationInput, Imprint } from '../types';

const STORAGE_KEY_IMPRINTS = 'buana_studio_imprints_v1';

export const CalculatorPage: React.FC = () => {
  const [imprints, setImprints] = useState<Imprint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_IMPRINTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_IMPRINTS;
  });

  const [selectedImprintId, setSelectedImprintId] = useState<string>('falah');

  const [input, setInput] = useState<CalculationInput>({
    imprintId: 'falah',
    bindingType: 'paperback',
    interiorType: 'premium_color',
    paperType: 'white',
    readingDirection: 'ltr',
    unit: 'in',
    trimPresetId: '8.5x8.5',
    trimWidth: 8.5,
    trimHeight: 8.5,
    pageCount: 32,
    bookTitle: 'Bintang Cilik & Misteri Langit',
    authorName: 'Fatimah Az-Zahra',
    isbn: '978-623-7890-001',
    includeBarcodeBox: true,
  });

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isImprintManagerOpen, setIsImprintManagerOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const activeImprint = useMemo(() => {
    return imprints.find((i) => i.id === selectedImprintId) || imprints[0] || DEFAULT_IMPRINTS[0];
  }, [imprints, selectedImprintId]);

  const handleSelectImprint = (imprint: Imprint) => {
    setSelectedImprintId(imprint.id);

    if (imprint.id === 'falah') {
      setInput((prev) => ({
        ...prev,
        imprintId: imprint.id,
        interiorType: 'premium_color',
        paperType: 'white',
        trimPresetId: '8.5x8.5',
        trimWidth: prev.unit === 'in' ? 8.5 : 215.9,
        trimHeight: prev.unit === 'in' ? 8.5 : 215.9,
        pageCount: 32,
        bookTitle: 'Bintang Cilik & Misteri Langit',
        authorName: 'Fatimah Az-Zahra',
        isbn: `${imprint.isbnPrefix}0101`,
      }));
    } else if (imprint.id === 'syabab') {
      setInput((prev) => ({
        ...prev,
        imprintId: imprint.id,
        interiorType: 'black_white',
        paperType: 'cream',
        trimPresetId: '5.5x8.5',
        trimWidth: prev.unit === 'in' ? 5.5 : 139.7,
        trimHeight: prev.unit === 'in' ? 8.5 : 215.9,
        pageCount: 184,
        bookTitle: 'Manifesto Jiwa Muda',
        authorName: 'Dr. Ahmad Syabani',
        isbn: `${imprint.isbnPrefix}0202`,
      }));
    } else if (imprint.id === 'hifzun') {
      setInput((prev) => ({
        ...prev,
        imprintId: imprint.id,
        interiorType: 'black_white',
        paperType: 'cream',
        trimPresetId: '6x9',
        trimWidth: prev.unit === 'in' ? 6.0 : 152.4,
        trimHeight: prev.unit === 'in' ? 9.0 : 228.6,
        pageCount: 360,
        bookTitle: 'Matan Ushul & Anotasi Kontemporer',
        authorName: 'Ustadz Hifzun Al-Kareem',
        isbn: `${imprint.isbnPrefix}0303`,
      }));
    } else {
      setInput((prev) => ({
        ...prev,
        imprintId: imprint.id,
        isbn: `${imprint.isbnPrefix}0001`,
      }));
    }
  };

  const handleSaveImprints = (updated: Imprint[]) => {
    setImprints(updated);
    try {
      localStorage.setItem(STORAGE_KEY_IMPRINTS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const calculationResult = useMemo(() => {
    return calculateBookCover(input);
  }, [input]);

  const handleInputChange = (updated: Partial<CalculationInput>) => {
    setInput((prev) => {
      const next = { ...prev, ...updated };
      if (updated.imprintId && updated.imprintId !== prev.imprintId) {
        setSelectedImprintId(updated.imprintId);
      }
      return next;
    });
  };

  const handleReset = () => {
    setInput({
      imprintId: selectedImprintId,
      bindingType: 'paperback',
      interiorType: 'black_white',
      paperType: 'white',
      readingDirection: 'ltr',
      unit: 'in',
      trimPresetId: '6x9',
      trimWidth: 6.0,
      trimHeight: 9.0,
      pageCount: 120,
      bookTitle: '',
      authorName: '',
      isbn: `${activeImprint.isbnPrefix}0001`,
      includeBarcodeBox: true,
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Imprint Banner */}
      <ImprintBanner
        imprint={activeImprint}
        onOpenManager={() => setIsImprintManagerOpen(true)}
      />

      {/* 2-Column Calculator & Preview Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <CalculatorForm
            input={input}
            imprints={imprints}
            onChange={handleInputChange}
            onCalculate={() => {}}
            onReset={handleReset}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
            spineWarning={calculationResult.spineTextNote}
            spineTextAllowed={calculationResult.spineTextAllowed}
          />
        </div>

        {/* Right Column: Live Visual Preview & Specs Table */}
        <div className="lg:col-span-7 space-y-6">
          <InteractiveCoverPreview
            input={input}
            result={calculationResult}
            imprint={activeImprint}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
          />

          <DimensionResultsPanel
            input={input}
            result={calculationResult}
            imprint={activeImprint}
          />
        </div>
      </div>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        input={input}
        result={calculationResult}
        imprint={activeImprint}
      />

      {/* Imprint Manager Modal */}
      <ImprintManagerModal
        isOpen={isImprintManagerOpen}
        onClose={() => setIsImprintManagerOpen(false)}
        imprints={imprints}
        onSaveImprints={handleSaveImprints}
        onSelectImprint={handleSelectImprint}
        activeImprintId={activeImprint.id}
      />

      {/* Publishing Specs Guide Modal */}
      <PublishingGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
};
