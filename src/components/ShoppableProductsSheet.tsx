import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, Zap, Star, ShieldCheck, Check } from 'lucide-react';

interface ShoppableProductsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onQuickAdd: (product: Product, size: string) => void;
  onInstantBuy: (product: Product, size: string) => void;
  onOpenProductModal: (product: Product) => void;
}

export const ShoppableProductsSheet: React.FC<ShoppableProductsSheetProps> = ({
  isOpen,
  onClose,
  products,
  onQuickAdd,
  onInstantBuy,
  onOpenProductModal
}) => {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAdd = (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes[0] || 'Standard';
    onQuickAdd(product, size);
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleBuy = (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes[0] || 'Standard';
    onInstantBuy(product, size);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col z-10 overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto my-3" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Shoppable In This Short
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500 font-medium">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900 mt-0.5">
              Shop The Exact Look
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product List */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {products.map((product) => {
            const currentSize = selectedSizes[product.id] || product.sizes[0];
            const isAdded = !!addedItemIds[product.id];

            return (
              <div
                key={product.id}
                className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 hover:border-neutral-300 transition-all flex flex-col gap-3"
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div
                    onClick={() => onOpenProductModal(product)}
                    className="relative w-20 h-24 rounded-xl overflow-hidden bg-neutral-200 shrink-0 cursor-pointer group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1 left-1 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {product.discountPercent}% OFF
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 truncate">
                          {product.brand}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      
                      <h4
                        onClick={() => onOpenProductModal(product)}
                        className="text-xs font-semibold text-neutral-900 line-clamp-1 hover:text-rose-600 cursor-pointer mt-0.5"
                      >
                        {product.name}
                      </h4>
                    </div>

                    {/* Price Lockup */}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-base font-extrabold text-neutral-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-neutral-400 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">
                        Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Size Selectors */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-[10px] text-neutral-500 font-medium">Size:</span>
                        {product.sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => handleSelectSize(product.id, sz)}
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-all ${
                              currentSize === sz
                                ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                                : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-200/60">
                  <button
                    onClick={() => handleAdd(product)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border transition-all ${
                      isAdded
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleBuy(product)}
                    className="py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Instant Buy</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="p-3 bg-neutral-100 border-t border-neutral-200/80 flex items-center justify-center gap-2 text-[11px] text-neutral-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Authentic Products · Instant 7-Day Free Returns</span>
        </div>

      </div>
    </div>
  );
};
