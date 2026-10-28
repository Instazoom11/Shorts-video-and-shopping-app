import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, X, Sparkles, PlaySquare, Radio, Film } from 'lucide-react';
import { ProductCategory, HipiMainTab } from '../types';

interface HeaderProps {
  activeTab: HipiMainTab;
  onSelectTab: (tab: HipiMainTab) => void;
  activeCategory: ProductCategory | 'LOOKBOOK';
  onSelectCategory: (category: ProductCategory | 'LOOKBOOK') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  wishlistCount: number;
  cartCount: number;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  onOpenTrackOrder: () => void;
  recentOrdersCount: number;
  gemCount: number;
  onOpenRewards: () => void;
  onOpenCreateModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  wishlistCount,
  cartCount,
  onOpenWishlist,
  onOpenCart,
  onOpenTrackOrder,
  recentOrdersCount,
  gemCount,
  onOpenRewards,
  onOpenCreateModal
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-pink-600 to-amber-600 text-white text-[11px] py-1.5 px-4 text-center tracking-wide font-bold flex items-center justify-center gap-3">
        <span>⚡ HIPI SHORTS FEST · WATCH SHORTS & EARN 10 GEMS PER VIDEO!</span>
        <span className="hidden sm:inline text-white/60">·</span>
        <span className="hidden sm:inline text-amber-200">SHOP LOOKS AT UP TO 50% OFF WITH INSTANT BUY</span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          
          {/* Zone 1: Hipi Brand Wordmark */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => onSelectTab('shorts')}
              className="text-left group focus:outline-hidden flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-600/30">
                <PlaySquare className="w-4 h-4 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter text-white group-hover:text-rose-400 transition-colors leading-none">
                  HIPI
                </span>
                <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase leading-none mt-0.5">
                  Shorts & Shopping
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => onSelectTab('shorts')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'shorts'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <PlaySquare className="w-3.5 h-3.5" />
              <span>Shorts Feed</span>
            </button>

            <button
              onClick={() => onSelectTab('shop')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'shop'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop Mall</span>
            </button>

            <button
              onClick={() => onSelectTab('live')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'live'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <Radio className="w-3.5 h-3.5" />
              <span>Live Streams</span>
            </button>
          </nav>

          {/* Zone 3: Search, Rewards & Bag */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Search Box */}
            <div className="relative hidden sm:block">
              <div
                className={`flex items-center bg-neutral-900 rounded-xl border border-neutral-800 transition-all focus-within:border-neutral-600 ${
                  isSearchExpanded ? 'w-56' : 'w-44'
                }`}
              >
                <Search className="w-3.5 h-3.5 ml-3 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search styles, looks..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (e.target.value.trim() && activeTab !== 'shop') {
                      onSelectTab('shop');
                    }
                  }}
                  onFocus={() => setIsSearchExpanded(true)}
                  onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                  className="w-full py-1.5 px-2 text-xs bg-transparent border-0 focus:outline-hidden text-white placeholder:text-neutral-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="p-1 mr-1 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Post Short CTA */}
            <button
              onClick={onOpenCreateModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl transition-all"
            >
              <Film className="w-3.5 h-3.5 text-rose-400" />
              <span>Post Short</span>
            </button>

            {/* Gems / Rewards Coin Button */}
            <button
              onClick={onOpenRewards}
              className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/40 text-amber-400 py-1.5 px-2.5 sm:px-3 rounded-xl transition-all text-xs font-extrabold shadow-xs"
              title="View your Hipi Gems & Rewards"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="tabular-nums">{gemCount}</span>
              <span className="hidden sm:inline text-[10px] text-amber-300 font-bold uppercase">Gems</span>
            </button>

            {/* Orders Tracking */}
            {recentOrdersCount > 0 && (
              <button
                onClick={onOpenTrackOrder}
                className="hidden xl:flex items-center gap-1 text-xs font-semibold text-neutral-300 hover:text-white py-1.5 px-2 rounded-xl transition-colors"
                title="View active orders"
              >
                <span>Orders</span>
                <span className="px-1.5 py-0.2 bg-neutral-800 text-neutral-200 text-[10px] font-bold rounded">
                  {recentOrdersCount}
                </span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-neutral-300 hover:text-rose-400 hover:bg-neutral-900 rounded-xl transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 text-[9px] font-bold bg-rose-600 text-white rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Bag / Cart */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white py-1.5 px-3 rounded-xl transition-all text-xs font-bold shadow-md shadow-rose-600/20"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="min-w-[16px] h-[16px] px-1 text-[9px] font-extrabold bg-neutral-950 text-white rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
