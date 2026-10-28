import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { ProductTag, VideoItem } from '../types';
import { useCart } from '../context/CartContext';

interface ProductQuickViewModalProps {
  product: ProductTag | null;
  video: VideoItem;
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: () => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  video,
  isOpen,
  onClose,
  onOpenCart,
}) => {
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.variants?.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.variants?.colors?.[0]?.name
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedSuccess, setIsAddedSuccess] = useState<boolean>(false);

  // Sync state if product changes
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.variants?.sizes?.[0]);
      setSelectedColor(product.variants?.colors?.[0]?.name);
      setQuantity(1);
      setIsAddedSuccess(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addItem(product, video, {
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    setIsAddedSuccess(true);
    setTimeout(() => {
      setIsAddedSuccess(false);
    }, 2000);
  };

  const handleInstantBuy = () => {
    addItem(product, video, {
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    onClose();
    onOpenCart();
  };

  const currentPriceTotal = (product.price * quantity).toFixed(2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-white animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Tagged In Video
            </span>
            {product.badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {product.badge}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
          {/* Creator Attribution Chip */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
            <div className="flex items-center gap-2.5">
              <img
                src={video.author.avatar}
                alt={video.author.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-white/30"
              />
              <div>
                <p className="text-[11px] text-neutral-400 font-medium leading-none">
                  Worn & Recommended by
                </p>
                <p className="text-xs font-bold text-white mt-0.5 leading-none">
                  @{video.author.handle}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-400/10 px-2 py-1 rounded-md border border-cyan-400/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> In Video
            </span>
          </div>

          {/* Product Hero Media & Basics */}
          <div className="flex gap-4">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.originalPrice && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-rose-600 text-[9px] font-black uppercase text-white shadow">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  {product.brand}
                </span>
                <h3 className="text-sm font-extrabold text-white leading-tight mt-0.5">
                  {product.title}
                </h3>

                {/* Rating & Sold count */}
                <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-300">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-400 text-[11px]">
                    ({product.reviewCount} reviews)
                  </span>
                  {product.soldCount && (
                    <>
                      <span className="text-neutral-500">•</span>
                      <span className="text-emerald-400 text-[11px] font-medium">
                        {product.soldCount}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Price display */}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xl font-black text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-neutral-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/50">
            {product.description}
          </p>

          {/* Color Selection if available */}
          {product.variants?.colors && product.variants.colors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Color: <span className="text-white normal-case">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.variants.colors.map((c) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 ${
                        isSelected
                          ? 'border-white bg-neutral-800 text-white shadow-md'
                          : 'border-neutral-800 bg-neutral-950/80 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection if available */}
          {product.variants?.sizes && product.variants.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Select Size
                </span>
                <span className="text-[11px] text-pink-400 font-medium">True to size</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[44px] h-9 px-3 rounded-xl border text-xs font-bold transition active:scale-95 ${
                        isSelected
                          ? 'border-pink-500 bg-pink-500/15 text-pink-300 shadow-md shadow-pink-500/20'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Stepper & Stock status */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Quantity
              </span>
              <div className="flex items-center rounded-xl bg-neutral-950 border border-neutral-800 p-0.5">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-7 h-7 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-7 h-7 rounded-lg text-neutral-400 hover:text-white flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              In Stock & Ready to Ship
            </div>
          </div>

          {/* Guarantees & Trust perks */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-neutral-400">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800/40">
              <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Fast 2-day delivery</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>30-Day Easy Returns</span>
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Buttons */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/90 flex gap-3">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-lg ${
              isAddedSuccess
                ? 'bg-emerald-500 text-white'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
            }`}
          >
            {isAddedSuccess ? (
              <>
                <Check className="w-4 h-4" /> Added to Bag!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-pink-400" />
                Add to Bag (${currentPriceTotal})
              </>
            )}
          </button>

          <button
            onClick={handleInstantBuy}
            className="flex-1 py-3 px-4 rounded-2xl font-black text-xs bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:opacity-95 text-white flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
