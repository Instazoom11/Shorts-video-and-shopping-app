import React from 'react';
import { Product, ShortVideo, FilterState, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { FilterBar } from './FilterBar';
import { Play, Sparkles, Flame, Clock, ShoppingBag, ArrowRight } from 'lucide-react';

interface HipiShopSectionProps {
  shorts: ShortVideo[];
  products: Product[];
  filterState: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onResetFilters: (category?: ProductCategory) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onOpenProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  onSelectShort: (short: ShortVideo) => void;
  onOpenLive: () => void;
}

export const HipiShopSection: React.FC<HipiShopSectionProps> = ({
  shorts,
  products,
  filterState,
  onUpdateFilters,
  onResetFilters,
  wishlistIds,
  onToggleWishlist,
  onOpenProduct,
  onQuickAdd,
  onSelectShort,
  onOpenLive
}) => {
  return (
    <div className="w-full pb-20">
      
      {/* 1. Shoppable Shorts Video Reels Strip */}
      <section className="bg-neutral-900 text-white py-6 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
              <div>
                <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-white">
                  Trending Shoppable Shorts
                </h2>
                <p className="text-xs text-neutral-400">
                  Tap any video to watch styling tips & shop tagged pieces
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onSelectShort(shorts[0])}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>Watch All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal Reel Cards */}
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
            {shorts.map((short) => (
              <div
                key={short.id}
                onClick={() => onSelectShort(short)}
                className="group relative w-36 sm:w-44 aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-800 shrink-0 cursor-pointer border border-neutral-700/80 shadow-lg hover:border-rose-500 transition-all hover:scale-102"
              >
                <img
                  src={short.thumbnailUrl}
                  alt={short.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Play Button Icon */}
                <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                  <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                </div>

                {/* Tagged Products Badge */}
                {short.taggedProductIds.length > 0 && (
                  <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                    <ShoppingBag className="w-2.5 h-2.5" />
                    <span>Shop ({short.taggedProductIds.length})</span>
                  </div>
                )}

                {/* Bottom Creator & Caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2.5 sm:p-3 text-white">
                  <div className="flex items-center gap-1.5 mb-1">
                    <img
                      src={short.creator.avatar}
                      alt={short.creator.name}
                      className="w-4 h-4 rounded-full object-cover border border-white"
                    />
                    <span className="text-[10px] font-bold text-neutral-200 truncate">
                      {short.creator.name}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-white line-clamp-2 leading-tight">
                    {short.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Flash Sale Promotional Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-r from-neutral-900 via-rose-950 to-neutral-900 rounded-3xl p-5 sm:p-7 text-white flex flex-col sm:flex-row items-center justify-between gap-5 border border-rose-900/40 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                FLASH SALE
              </span>
              <span className="text-xs text-rose-300 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Ends in 04h : 22m
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Wear What's Viral: Flat 50% Off Top Creator Fits
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-lg">
              Explore pieces featured in the most viewed Hipi reels this week. Free express delivery on all orders above ₹1,499.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
            <button
              onClick={onOpenLive}
              className="flex-1 sm:flex-none py-3 px-5 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Join Live Sale</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Filter Bar */}
      <FilterBar
        filterState={filterState}
        onUpdateFilters={onUpdateFilters}
        onResetFilters={onResetFilters}
        totalProductsCount={products.length}
      />

      {/* 4. Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {products.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200 p-8">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-900">
              No matching apparel found
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Try adjusting your active filters or clear search terms to see the full collection.
            </p>
            <button
              onClick={() => onResetFilters()}
              className="mt-5 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={isWishlisted}
                  onToggleWishlist={onToggleWishlist}
                  onOpenModal={onOpenProduct}
                  onQuickAdd={onQuickAdd}
                />
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
};
