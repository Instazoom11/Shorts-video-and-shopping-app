import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToBag: (product: Product, size: string) => void;
  onOpenProductModal: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToBag,
  onOpenProductModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h2 className="text-base font-bold text-neutral-900">
              MY WISHLIST ({wishlist.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {wishlist.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-4 text-rose-400">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Your wishlist is empty</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs">
              Explore your favorite collections and tap the heart icon to save items here.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              Discover Collections
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 p-3 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors bg-white group"
              >
                <div
                  className="w-20 h-28 rounded-lg overflow-hidden bg-neutral-100 shrink-0 cursor-pointer"
                  onClick={() => {
                    onOpenProductModal(product);
                    onClose();
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        {product.brand}
                      </span>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4
                      className="text-xs font-semibold text-neutral-900 truncate cursor-pointer hover:text-rose-600"
                      onClick={() => {
                        onOpenProductModal(product);
                        onClose();
                      }}
                    >
                      {product.name}
                    </h4>

                    <div className="mt-1 flex items-baseline gap-2 tabular-nums">
                      <span className="text-sm font-extrabold text-neutral-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-neutral-400 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] font-bold text-rose-600">
                        {product.discountPercent}% OFF
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onMoveToBag(product, product.sizes[0]);
                      onRemoveFromWishlist(product.id);
                    }}
                    className="w-full mt-2 bg-neutral-900 hover:bg-rose-600 text-white py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag ({product.sizes[0]})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-neutral-50 text-center">
            <p className="text-xs text-neutral-500">
              Items remain in wishlist for as long as stocks last.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
