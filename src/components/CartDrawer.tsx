import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Truck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPriceIdr,
    totalPriceUsd,
    totalCount,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }, 1200);
  };

  const handleFinish = () => {
    clearCart();
    setCheckoutSuccess(false);
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Cart Header */}
          <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight">Your Publishing Cart</h3>
                <p className="text-xs text-slate-400">{totalCount} item(s) selected</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {checkoutSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  Thank You for Your Order!
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Your order has been placed. Digital editions have been added to your writer repository, and print copies are being scheduled for high-grade binding.
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleFinish}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our catalog across FALAH, SYABAB, and HIFZUN imprints to find your next great read.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {cart.map((item) => {
                  const isPrint = item.format === 'print';
                  const unitPriceIdr = isPrint ? item.book.pricePrintIdr : item.book.priceDigitalIdr;
                  const unitPriceUsd = isPrint ? item.book.pricePrintUsd : item.book.priceDigitalUsd;

                  return (
                    <div
                      key={`${item.book.id}-${item.format}`}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
                    >
                      {/* Mini Cover Art */}
                      <div
                        className={`w-12 h-16 rounded-md bg-gradient-to-b ${item.book.coverBg} flex-shrink-0 flex flex-col justify-between p-1.5 text-white shadow-xs`}
                      >
                        <span className="text-[6px] font-black uppercase opacity-80">
                          {item.book.imprintId}
                        </span>
                        <span className="text-[7px] font-bold leading-tight line-clamp-2">
                          {item.book.title}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-slate-900 truncate">
                          {item.book.title}
                        </h5>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                          <span
                            className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                              isPrint ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {isPrint ? 'Print Edition' : 'Digital ePub/PDF'}
                          </span>
                          <span>by {item.book.authorName}</span>
                        </div>
                        <div className="text-xs font-black text-slate-900 mt-1">
                          Rp {unitPriceIdr.toLocaleString('id-ID')}
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            (${unitPriceUsd})
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-1.5 bg-white border border-slate-300 rounded-lg p-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.book.id, item.format, item.quantity - 1)
                            }
                            className="p-1 text-slate-500 hover:text-slate-900 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.book.id, item.format, item.quantity + 1)
                            }
                            className="p-1 text-slate-500 hover:text-slate-900 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.book.id, item.format)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && !checkoutSuccess && (
            <div className="bg-slate-50 p-6 border-t border-slate-200 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    Rp {totalPriceIdr.toLocaleString('id-ID')} (${totalPriceUsd.toFixed(2)})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Print Shipping / Digital Delivery</span>
                  </span>
                  <span className="text-emerald-600 font-bold">Instant / Free</span>
                </div>
                <div className="flex items-center justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>Rp {totalPriceIdr.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {isCheckingOut ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
