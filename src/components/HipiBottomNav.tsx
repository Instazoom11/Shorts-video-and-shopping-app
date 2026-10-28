import React from 'react';
import { HipiMainTab } from '../types';
import { PlaySquare, ShoppingBag, Plus, Radio, Sparkles } from 'lucide-react';

interface HipiBottomNavProps {
  activeTab: HipiMainTab;
  onSelectTab: (tab: HipiMainTab) => void;
  gemCount: number;
}

export const HipiBottomNav: React.FC<HipiBottomNavProps> = ({
  activeTab,
  onSelectTab,
  gemCount
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 sm:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 text-white">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-2">
        
        {/* 1. Shorts Feed */}
        <button
          onClick={() => onSelectTab('shorts')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeTab === 'shorts' ? 'text-rose-500' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <PlaySquare className={`w-5 h-5 ${activeTab === 'shorts' ? 'fill-rose-500/20' : ''}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1">Shorts</span>
        </button>

        {/* 2. Shop Mall */}
        <button
          onClick={() => onSelectTab('shop')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeTab === 'shop' ? 'text-rose-500' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ShoppingBag className={`w-5 h-5 ${activeTab === 'shop' ? 'fill-rose-500/20' : ''}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1">Shop Mall</span>
        </button>

        {/* 3. Create Studio (Central Accent Button) */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => onSelectTab('create')}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 active:scale-95 transition-transform"
            title="Create and post short video"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Live Commerce */}
        <button
          onClick={() => onSelectTab('live')}
          className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeTab === 'live' ? 'text-rose-500' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Radio className="w-5 h-5" />
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1">Live</span>
        </button>

        {/* 5. Rewards */}
        <button
          onClick={() => onSelectTab('rewards')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeTab === 'rewards' ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${activeTab === 'rewards' ? 'fill-amber-400/20' : ''}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1 truncate max-w-[50px]">
            {gemCount} 🪙
          </span>
        </button>

      </div>
    </nav>
  );
};
