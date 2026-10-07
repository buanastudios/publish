import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  BookOpen,
  Feather,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginAs = (role: 'author' | 'reader') => {
    login(role);
    const from = (location.state as any)?.from?.pathname || '/repo';
    navigate(from, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 mx-auto flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Sign In to Buana Studio
        </h2>
        <p className="text-xs text-slate-500">
          Single Sign-On across publish.buana.studio & academy.buana.studio
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
          Select Test Persona / Account
        </div>

        {/* Option 1: Author */}
        <button
          onClick={() => handleLoginAs('author')}
          className="w-full p-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400 text-left transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Dr. Ahmad Syabani</div>
              <div className="text-[11px] text-indigo-700 font-medium">
                Author (SYABAB & HIFZUN)
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Option 2: Reader */}
        <button
          onClick={() => handleLoginAs('reader')}
          className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 text-left transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">General Reader</div>
              <div className="text-[11px] text-slate-500">
                Book Buyer & Community Member
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="pt-2 text-center">
          <p className="text-[11px] text-slate-400">
            Protected by Buana Studio Enterprise Security
          </p>
        </div>
      </div>
    </div>
  );
};
