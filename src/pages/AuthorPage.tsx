import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  MapPin,
  ShoppingBag,
  Download,
  ArrowLeft,
  Feather,
} from 'lucide-react';
import { AUTHORS, BOOKS } from '../data/catalog';
import { DEFAULT_IMPRINTS } from '../data/imprints';
import { useCart } from '../context/CartContext';

export const AuthorPage: React.FC = () => {
  const { authorpenname } = useParams<{ authorpenname: string }>();
  const { addToCart } = useCart();

  const author = authorpenname ? AUTHORS[authorpenname] : undefined;

  const authorName = author?.name || (authorpenname ? authorpenname.replace(/-/g, ' ').toUpperCase() : 'Author');
  const authorBio = author?.bio || `Author and contributor to Buana Studio Publishing imprints.`;
  const authorTitle = author?.title || 'Published Author & Writer';
  const authorLocation = author?.location || 'Indonesia';

  const authorBooks = BOOKS.filter(
    (b) => b.authorPenName === authorpenname || b.authorName.toLowerCase().includes(authorName.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bookstore Catalog</span>
        </Link>
      </div>

      {/* Author Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          {/* Avatar Icon / Photo */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-500/20 flex-shrink-0">
            {authorName.charAt(0)}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {authorName}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800">
                Official Author
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              {authorTitle}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {authorBio}
            </p>

            <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1 flex-wrap">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{authorLocation}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>{authorBooks.length} Published Books</span>
              </span>
              <span>•</span>
              <span className="font-mono text-[11px] text-indigo-600">
                /author/{authorpenname}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Author's Published Bibliography */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            Published Bibliography by {authorName}
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {authorBooks.length} Title(s)
          </span>
        </div>

        {authorBooks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <Feather className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No books found for this author yet</h4>
            <p className="text-xs text-slate-500">
              Check back soon or explore our general catalog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorBooks.map((book) => {
              const imprint = DEFAULT_IMPRINTS.find((i) => i.id === book.imprintId);

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  <div
                    className={`h-48 bg-gradient-to-br ${book.coverBg} p-5 flex flex-col justify-between text-white relative`}
                  >
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs tracking-wider self-start">
                      {imprint?.name || book.imprintId}
                    </span>

                    <div>
                      <h3 className="text-lg font-black leading-tight drop-shadow">
                        {book.title}
                      </h3>
                      <p className="text-[11px] text-white/80 mt-0.5 line-clamp-1">
                        {book.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {book.description}
                      </p>
                      <div className="text-[11px] text-slate-400 font-mono">
                        ISBN: {book.isbn} • {book.pageCount} Pages
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold">Print</div>
                          <div className="text-sm font-black text-slate-900">
                            Rp {book.pricePrintIdr.toLocaleString('id-ID')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500 uppercase font-bold">Digital</div>
                          <div className="text-xs font-bold text-emerald-700">
                            Rp {book.priceDigitalIdr.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => addToCart(book, 'print')}
                          className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1"
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
        )}
      </div>
    </div>
  );
};
