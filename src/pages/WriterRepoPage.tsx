import React from 'react';
import { Link } from 'react-router-dom';
import {
  Archive,
  FileText,
  Download,
  Calculator,
  ShieldCheck,
  BookOpen,
  User,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BOOKS } from '../data/catalog';

export const WriterRepoPage: React.FC = () => {
  const { user, login, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 mx-auto flex items-center justify-center shadow-sm">
          <Archive className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">
            Writer & Digital Repository Access
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Sign in with your author credentials to access your published digital manuscripts, ISBN proof files, and sales metrics.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => login('author')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center space-x-2 mx-auto"
          >
            <User className="w-4 h-4" />
            <span>Sign In as Author (Dr. Ahmad Syabani)</span>
          </button>
        </div>
      </div>
    );
  }

  const authorBooks = BOOKS.filter(
    (b) => b.authorPenName === user?.penNameSlug || b.authorName.toLowerCase().includes(user?.name.toLowerCase() || '')
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-400/20">
            <Archive className="w-3.5 h-3.5" />
            <span>Writer Digital Repository (/repo)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Manage your official published manuscripts, download print-ready proofs, and track ISBN registrations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/calc"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Calculator className="w-4 h-4" />
            <span>Cover Calculator</span>
          </Link>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Published Titles</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{authorBooks.length}</div>
          <p className="text-[11px] text-slate-500">Across SYABAB & HIFZUN</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Total Readers Reached</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">1,420+</div>
          <p className="text-[11px] text-emerald-700 font-semibold">+18% this month</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>ISBN Status</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">100% Active</div>
          <p className="text-[11px] text-slate-500">Perpusnas & KDP Registered</p>
        </div>
      </div>

      {/* Digital Manuscript Repository Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Your Digital Manuscripts & Master Proofs
            </h3>
            <p className="text-xs text-slate-500">
              Download approved print interiors, cover assets, and ePub packages
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {authorBooks.map((book) => (
            <div
              key={book.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-3.5">
                <div
                  className={`w-12 h-16 rounded-lg bg-gradient-to-b ${book.coverBg} flex flex-col justify-between p-1 text-white shadow-xs flex-shrink-0`}
                >
                  <span className="text-[6px] font-black uppercase">{book.imprintId}</span>
                  <span className="text-[7px] font-bold leading-tight line-clamp-2">
                    {book.title}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{book.title}</h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono text-[11px]">ISBN: {book.isbn}</span>
                    <span>•</span>
                    <span>{book.pageCount} Pages ({book.trimSize})</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 font-semibold mt-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Print Ready & Globally Distributed</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <button
                  onClick={() => alert(`Downloading Print Master Proof for ${book.title}...`)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Proof PDF</span>
                </button>

                <button
                  onClick={() => alert(`Downloading eBook Package for ${book.title}...`)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  <span>ePub</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
