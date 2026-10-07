import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Navigation } from './components/Navigation';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { PublishingGuideModal } from './components/PublishingGuideModal';

import { HomePage } from './pages/HomePage';
import { CalculatorPage } from './pages/CalculatorPage';
import { AuthorPage } from './pages/AuthorPage';
import { WriterRepoPage } from './pages/WriterRepoPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-400 selection:text-slate-950">
            {/* Global Navbar */}
            <Navigation />

            {/* Main Content Viewport */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full">
              <Routes>
                {/* Storefront & Catalog */}
                <Route path="/" element={<HomePage />} />

                {/* Print Cover Calculator */}
                <Route path="/calc" element={<CalculatorPage />} />

                {/* Author Portfolio */}
                <Route path="/author/:authorpenname" element={<AuthorPage />} />

                {/* Writer Digital Repository */}
                <Route path="/repo" element={<WriterRepoPage />} />

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Slide-out Shopping Cart */}
            <CartDrawer />

            {/* Publishing Specs Guide Modal */}
            <PublishingGuideModal
              isOpen={isGuideModalOpen}
              onClose={() => setIsGuideModalOpen(false)}
            />

            {/* Global Footer */}
            <Footer onOpenGuide={() => setIsGuideModalOpen(true)} />
          </div>
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
