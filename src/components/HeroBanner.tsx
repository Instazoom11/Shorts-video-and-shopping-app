import React from 'react';
import { ArrowRight, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeroBannerProps {
  onExplore: (category: ProductCategory) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExplore }) => {
  return (
    <section className="relative bg-neutral-900 text-white overflow-hidden">
      {/* Background Hero Image with Measured Scrim */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-6 z-10 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-rose-400 uppercase">
              <span>Gpark Grand Showcase</span>
              <span>·</span>
              <span>Autumn '24 Edit</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-balance">
              Redefining Modern Indian Fashion.
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed">
              Discover effortless contemporary aesthetics, artisanal festive ensembles, architectural streetwear, and everyday staples tailored for discerning lifestyles.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onExplore('ALL')}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-3.5 rounded-lg text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-rose-600/30"
              >
                <span>EXPLORE ALL STYLES</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onExplore('MEN')}
                className="bg-neutral-800/80 hover:bg-neutral-700/80 text-white border border-neutral-700 px-5 py-3.5 rounded-lg text-sm font-semibold tracking-wide transition-colors"
              >
                MENSWEAR
              </button>
              <button
                onClick={() => onExplore('WOMEN')}
                className="bg-neutral-800/80 hover:bg-neutral-700/80 text-white border border-neutral-700 px-5 py-3.5 rounded-lg text-sm font-semibold tracking-wide transition-colors"
              >
                WOMENSWEAR
              </button>
            </div>

            {/* Trust Highlights Strip */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-neutral-800 text-neutral-300">
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-medium">100% Genuine</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <RefreshCw className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-medium">14-Day Free Returns</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Truck className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-medium">Fast Express Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] group">
              <img
                src="/src/assets/images/hero_gpark_summer_edit_1793091770554.jpg"
                alt="Gpark Fashion Campaign Models in Autumn Edit"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-rose-400 uppercase">
                    Featured Collection
                  </span>
                  <p className="text-white font-bold text-lg">
                    The Metropolitan Street & Festive Lineup
                  </p>
                  <p className="text-neutral-300 text-xs">
                    Flat 40% - 60% OFF · Exclusive to Gpark Fashion
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
