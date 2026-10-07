import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Book, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book, format: 'print' | 'digital') => void;
  removeFromCart: (bookId: string, format: 'print' | 'digital') => void;
  updateQuantity: (bookId: string, format: 'print' | 'digital', qty: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPriceIdr: number;
  totalPriceUsd: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'buana_studio_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (book: Book, format: 'print' | 'digital') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id && item.format === format);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id && item.format === format
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, format, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (bookId: string, format: 'print' | 'digital') => {
    setCart((prev) => prev.filter((item) => !(item.book.id === bookId && item.format === format)));
  };

  const updateQuantity = (bookId: string, format: 'print' | 'digital', qty: number) => {
    if (qty <= 0) {
      removeFromCart(bookId, format);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.book.id === bookId && item.format === format ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const totalPriceIdr = cart.reduce((acc, item) => {
    const unitPrice = item.format === 'print' ? item.book.pricePrintIdr : item.book.priceDigitalIdr;
    return acc + unitPrice * item.quantity;
  }, 0);

  const totalPriceUsd = cart.reduce((acc, item) => {
    const unitPrice = item.format === 'print' ? item.book.pricePrintUsd : item.book.priceDigitalUsd;
    return acc + unitPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalPriceIdr,
        totalPriceUsd,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
