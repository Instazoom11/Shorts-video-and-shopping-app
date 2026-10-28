import React from 'react';
import { Sparkles, ShoppingBag, Tv } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderNavProps {
  feedType: 'following' | 'foryou' | 'live';
  onChangeFeedType: (type: 'following' | 'foryou' | 'live') => void;
  onOpenSearch: () => void;
  onOpenStudio: () => void;
  onOpenCart?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  feedType,
  onChangeFeedType,
  onOpenSearch,
  onOpenStudio,
  onOpenCart,
}) => {
  const { totalCount, openCart } = useCart();
  const handleCartClick = onOpenCart || openCart;

  return (
    <div className="absolute top-0 inset-x-0 h-14 flex items-center justify-between px-4 z-30 pointer-events-none max-w-lg mx-auto">
      {/* Left: Live TV Indicator / Button */}
      <button
        onClick={() => onChangeFeedType('live')}
        className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-bold hover:bg-black/60 transition"
      >
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <Tv className="w-3.5 h-3.5 text-rose-400" />
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">
          Live
        </span>
      </button>

      {/* Center: Following | For You */}
      <div className="pointer-events-auto flex items-center gap-4">
        <button
          onClick={() => onChangeFeedType('following')}
          className={`text-sm font-bold transition drop-shadow-md ${
            feedType === 'following'
              ? 'text-white border-b-2 border-white pb-0.5'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Following
        </button>

        <span className="text-white/30 text-xs">|</span>

        <button
          onClick={() => onChangeFeedType('foryou')}
          className={`text-sm font-black transition drop-shadow-md ${
            feedType === 'foryou'
              ? 'text-white border-b-2 border-white pb-0.5'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          For You
        </button>
      </div>

      {/* Right: Shopping Cart Bag & AI Studio */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Persistent Shopping Cart Drawer Trigger Button */}
        <button
          onClick={handleCartClick}
          title="Shopping Bag"
          className="relative w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-lg transition active:scale-90 group"
          aria-label="Open Shopping Bag Drawer"
        >
          <ShoppingBag className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
          {totalCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-black animate-in zoom-in shadow-md">
              {totalCount > 99 ? '99+' : totalCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenStudio}
          title="Open AI Studio"
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg transition active:scale-90"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
