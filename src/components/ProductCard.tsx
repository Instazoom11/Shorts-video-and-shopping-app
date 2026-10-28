import React, { useState } from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onOpenModal: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onOpenModal,
  onQuickAdd
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSizeQuickSelect, setShowSizeQuickSelect] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Fallback image gradient if image fails
  const fallbackBg = 'bg-gradient-to-br from-neutral-100 to-neutral-200';

  return (
    <div
      className="group relative bg-white rounded-xl border border-neutral-200/80 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizeQuickSelect(false);
      }}
    >
      {/* Product Image Slot */}
      <div
        className={`relative aspect-[3/4] w-full overflow-hidden ${fallbackBg} cursor-pointer`}
        onClick={() => onOpenModal(product)}
      >
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-neutral-400">
            <span className="text-2xl font-black text-neutral-300 mb-1">GPARK</span>
            <span className="text-xs font-semibold">{product.brand}</span>
          </div>
        )}

        {/* Rating Floating Tag */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-neutral-800 flex items-center gap-1 shadow-sm">
          <span>{product.rating}</span>
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-neutral-400 text-[10px]">| {product.reviewCount}</span>
        </div>

        {/* Tag (e.g. Trending, Bestseller) */}
        {product.tag && (
          <div className="absolute top-2.5 left-2.5 bg-neutral-900/85 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
            {product.tag}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 backdrop-blur-sm text-neutral-700 hover:text-rose-600 hover:bg-white shadow-sm'
          }`}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-rose-600 text-rose-600' : ''
            }`}
          />
        </button>

        {/* Quick Add Overlay on Hover */}
        {isHovered && !showSizeQuickSelect && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSizeQuickSelect(true);
            }}
            className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md text-neutral-900 py-2.5 px-4 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 border-t border-neutral-200 transition-transform animate-in fade-in slide-in-from-bottom-2 duration-150 hover:bg-neutral-900 hover:text-white"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>QUICK ADD TO BAG</span>
          </button>
        )}

        {/* Size Selection Drawer on Hover */}
        {showSizeQuickSelect && (
          <div
            className="absolute bottom-0 inset-x-0 bg-white p-3 border-t border-neutral-200 animate-in fade-in slide-in-from-bottom-2 duration-150 shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[11px] font-bold text-neutral-600 uppercase mb-2">
              Select Size:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd(product, size);
                    setShowSizeQuickSelect(false);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Metadata & Pricing */}
      <div
        className="p-3.5 flex flex-col flex-1 cursor-pointer"
        onClick={() => onOpenModal(product)}
      >
        <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-0.5 truncate">
          {product.brand}
        </span>
        <h3 className="text-sm font-semibold text-neutral-900 truncate mb-2 group-hover:text-rose-600 transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto flex items-baseline gap-2 tabular-nums">
          <span className="text-sm sm:text-base font-extrabold text-neutral-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-neutral-400 line-through">
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-bold text-rose-600">
            ({product.discountPercent}% OFF)
          </span>
        </div>
      </div>
    </div>
  );
};
