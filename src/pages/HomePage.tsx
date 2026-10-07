import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  ShoppingBag,
  Download,
  Star,
  ArrowRight,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Feather,
  Baby,
} from 'lucide-react';
import { BOOKS } from '../data/catalog';
import { DEFAULT_IMPRINTS } from '../data/imprints';
import { useCart } from '../context/CartContext';

export const HomePage: React.FC = () => {
  const [selectedImprintFilter, setSelectedImprintFilter] = useState<string>('all');
  const { addToCart } = useCart();

  const filteredBooks =
    selectedImprintFilter === 'all'
      ? BOOKS
      : BOOKS.filter((b) => b.imprintId === selectedImprintFilter);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-slate-700">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Publishing Directorate • publish.buana.studio</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Curated Literature & Thought Across Distinct Generations.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-medium">
            From playful childhood picture books under <strong className="text-emerald-400">FALAH</strong>, bold youth leadership treatises with <strong className="text-indigo-400">SYABAB</strong>, to timeless classical preservation under <strong className="text-amber-400">HIFZUN</strong>.
          </p>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#catalog"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Book Catalog</span>
            </a>

            <Link
              to="/calc"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center space-x-2"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Cover Dimension Calculator (/calc)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Imprint Highlight Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {DEFAULT_IMPRINTS.map((imp) => {
          const isSelected = selectedImprintFilter === imp.id;
          const isKids = imp.id === 'falah';
          const isYouth = imp.id === 'syabab';

          return (
            <div
              key={imp.id}
              onClick={() => setSelectedImprintFilter(isSelected ? 'all' : imp.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                isSelected
                  ? 'ring-2 ring-slate-900 shadow-md bg-white border-slate-900'
                  : 'bg-white hover:shadow-md border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xs"
                  style={{ backgroundColor: imp.accentHex }}
                >
                  {isKids ? <Baby className="w-5 h-5" /> : isYouth ? <Feather className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {imp.targetAge}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                {imp.name}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {imp.tagline}
              </p>
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
                {imp.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>ISBN: {imp.isbnPrefix}XXXX</span>
                <span className="text-amber-600 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>View Books</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Catalog & Filter */}
      <section id="catalog" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Published Titles & Bookstore
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Available in high-grade offset print and instant digital e-Book delivery
            </p>
          </div>

          {/* Imprint Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedImprintFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedImprintFilter === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Imprints ({BOOKS.length})
            </button>
            {DEFAULT_IMPRINTS.map((imp) => {
              const count = BOOKS.filter((b) => b.imprintId === imp.id).length;
              return (
                <button
                  key={imp.id}
                  onClick={() => setSelectedImprintFilter(imp.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    selectedImprintFilter === imp.id
                      ? `${imp.badgeBg} ring-2 ring-slate-400 font-extrabold shadow-xs`
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {imp.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Book Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const imprint = DEFAULT_IMPRINTS.find((i) => i.id === book.imprintId);

            return (
              <div
                key={book.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Book Cover Visual Mockup Header */}
                <div
                  className={`h-52 bg-gradient-to-br ${book.coverBg} p-5 flex flex-col justify-between text-white relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />

                  <div className="flex items-start justify-between relative z-10">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs tracking-wider">
                      {imprint?.name || book.imprintId}
                    </span>
                    <span className="text-[10px] font-semibold bg-black/40 px-2 py-0.5 rounded text-white/90">
                      {book.trimSize}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-lg font-black leading-tight drop-shadow">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-white/80 mt-0.5 line-clamp-1">
                      {book.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Author & Rating */}
                    <div className="flex items-center justify-between text-xs">
                      <Link
                        to={`/author/${book.authorPenName}`}
                        className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors truncate"
                      >
                        by {book.authorName}
                      </Link>

                      <div className="flex items-center space-x-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{book.rating}</span>
                        <span className="text-slate-400 font-normal">({book.reviewsCount})</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {book.description}
                    </p>

                    <div className="text-[11px] text-slate-400 font-mono">
                      ISBN: {book.isbn} • {book.pageCount} Pages • {book.bindingType}
                    </div>
                  </div>

                  {/* Pricing & Add to Cart Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-2.5">
                    {/* Price Bar */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Print Edition</div>
                        <div className="text-sm font-black text-slate-900">
                          Rp {book.pricePrintIdr.toLocaleString('id-ID')}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Digital ePub</div>
                        <div className="text-xs font-bold text-emerald-700">
                          Rp {book.priceDigitalIdr.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => addToCart(book, 'print')}
                        className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1 shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Buy Print</span>
                      </button>

                      <button
                        onClick={() => addToCart(book, 'digital')}
                        className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-600" />
                        <span>Digital</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Creator & Publishing Services CTA */}
      <section className="bg-slate-100 rounded-3xl p-8 sm:p-10 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              For Authors, Illustrators & Creators
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              Publish Your Book with Buana Studio Direct
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Use our dedicated cover calculator to generate precision-engineered cover templates (PDF, PNG @ 300 DPI, and SVG) tailored to FALAH, SYABAB, or HIFZUN imprints.
            </p>
            <div className="pt-2 flex items-center space-x-3">
              <Link
                to="/calc"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Open Cover Calculator</span>
              </Link>

              <Link
                to="/repo"
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Writer Repository (/repo)
              </Link>
            </div>
          </div>

          <div className="space-y-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full-Stack Publishing Infrastructure</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Official ISBN & Barcode Generation</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Global Print-on-Demand & Amazon KDP Specs</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Automated Royalty & Digital Repository (/repo)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
