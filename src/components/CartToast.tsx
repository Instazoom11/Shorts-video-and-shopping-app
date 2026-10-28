import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, X } from 'lucide-react';

export const CartToast: React.FC = () => {
  const { toast, dismissToast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm pointer-events-auto animate-in slide-in-from-top-4 duration-200">
      <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900/95 border border-pink-500/40 text-white shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {toast.productImage ? (
            <img
              src={toast.productImage}
              alt="Cart preview"
              className="w-9 h-9 rounded-xl object-cover border border-neutral-800 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          )}

          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate leading-tight">
              {toast.message}
            </p>
            <p className="text-[10px] text-pink-400 font-medium">
              Saved to your persistent bag
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {toast.actionLabel && toast.onAction && (
            <button
              onClick={() => {
                toast.onAction?.();
                dismissToast();
              }}
              className="px-2.5 py-1 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-[11px] font-black transition active:scale-95 shadow"
            >
              {toast.actionLabel}
            </button>
          )}

          <button
            onClick={dismissToast}
            className="w-6 h-6 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
