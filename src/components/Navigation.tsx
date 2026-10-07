import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Calculator,
  Archive,
  ShoppingCart,
  User,
  LogOut,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { totalCount, setIsCartOpen } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  BUANA STUDIO
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Publishing
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono hidden sm:block">
                publish.buana.studio
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Store & Catalog</span>
            </Link>

            <Link
              to="/calc"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isActive('/calc')
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Cover Calculator (/calc)</span>
            </Link>

            <Link
              to="/repo"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isActive('/repo')
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Writer Repo (/repo)</span>
            </Link>
          </nav>

          {/* Right Actions (Cart & Auth) */}
          <div className="flex items-center space-x-2.5">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all flex items-center space-x-1 shadow-2xs"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Auth */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={user?.penNameSlug ? `/author/${user.penNameSlug}` : '/repo'}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 hover:bg-indigo-100 transition-colors text-xs font-bold shadow-2xs"
                >
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs font-bold">
          <Link
            to="/"
            className={`py-1 px-2.5 rounded-lg ${
              isActive('/') && location.pathname === '/' ? 'text-amber-600 bg-amber-50' : 'text-slate-600'
            }`}
          >
            Catalog
          </Link>
          <Link
            to="/calc"
            className={`py-1 px-2.5 rounded-lg ${
              isActive('/calc') ? 'text-amber-600 bg-amber-50' : 'text-slate-600'
            }`}
          >
            Calculator (/calc)
          </Link>
          <Link
            to="/repo"
            className={`py-1 px-2.5 rounded-lg ${
              isActive('/repo') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'
            }`}
          >
            Repo (/repo)
          </Link>
        </div>
      </div>
    </header>
  );
};
