import React, { useState } from 'react';
import { Tag, ShoppingBag, Plus, Check, ExternalLink, Sparkles, ChevronRight } from 'lucide-react';
import { ProductTag, VideoItem } from '../types';
import { useCart } from '../context/CartContext';

interface VideoProductHotspotsProps {
  video: VideoItem;
  currentTime: number;
  onOpenProductModal: (product: ProductTag) => void;
}

export const VideoProductHotspots: React.FC<VideoProductHotspotsProps> = ({
  video,
  currentTime,
  onOpenProductModal,
}) => {
  const { addItem, openCart } = useCart();
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const products = video.products || [];
  if (products.length === 0) return null;

  // Check if a product is active in the current video timestamp
  const getIsProductActiveInScene = (p: ProductTag) => {
    if (!p.timestamp) return true;
    return currentTime >= p.timestamp.start && currentTime <= p.timestamp.end;
  };

  const handleQuickAdd = (e: React.MouseEvent, p: ProductTag) => {
    e.stopPropagation();
    addItem(p, video);
    setRecentlyAddedId(p.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1500);
  };

  // Find the primary product spotlighted for the scene banner
  const activeSceneProduct =
    products.find(getIsProductActiveInScene) || products[0];

  return (
    <>
      {/* 1. In-Video Hotspot Interactive Pins on Video Canvas */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {products.map((product) => {
          const isSceneActive = getIsProductActiveInScene(product);
          const isHovered = activeHoverId === product.id;
          const isJustAdded = recentlyAddedId === product.id;

          return (
            <div
              key={product.id}
              style={{
                left: `${product.hotspot.x}%`,
                top: `${product.hotspot.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
              onMouseEnter={() => setActiveHoverId(product.id)}
              onMouseLeave={() => setActiveHoverId(null)}
            >
              {/* Radar concentric pulsing ring */}
              <div
                className={`absolute inset-0 -m-2 rounded-full border border-pink-400/80 transition-opacity ${
                  isSceneActive ? 'animate-ping opacity-75' : 'opacity-0 group-hover:opacity-60'
                }`}
              />

              {/* Hotspot Pin Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProductModal(product);
                }}
                className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md shadow-2xl transition-all duration-300 border active:scale-90 cursor-pointer ${
                  isSceneActive
                    ? 'bg-black/85 text-white border-pink-500/80 ring-2 ring-pink-500/40 shadow-pink-500/30 scale-105'
                    : 'bg-black/60 text-white/90 border-white/30 hover:border-white scale-95'
                }`}
                aria-label={`View ${product.title}`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                <Tag className="w-3 h-3 text-pink-400 shrink-0" />
                <span className="text-[11px] font-black tracking-tight whitespace-nowrap drop-shadow">
                  ${product.price.toFixed(0)}
                </span>
              </button>

              {/* Hover Popover Tooltip Card */}
              {isHovered && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-2.5 rounded-2xl bg-neutral-950/95 border border-neutral-700/80 backdrop-blur-xl shadow-2xl z-50 text-white animate-in zoom-in-90 fade-in duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-2.5 items-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      {product.badge && (
                        <span className="text-[9px] font-black uppercase text-pink-400 tracking-wider">
                          {product.badge}
                        </span>
                      )}
                      <h4 className="text-xs font-bold truncate leading-tight">
                        {product.title}
                      </h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xs font-extrabold text-white">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-neutral-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions inside popover */}
                  <div className="flex gap-1.5 mt-2.5 pt-2 border-t border-neutral-800/80">
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={`flex-1 py-1 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition ${
                        isJustAdded
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/30'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3 h-3" /> Added!
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3 stroke-[3]" /> Add to Bag
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onOpenProductModal(product)}
                      className="py-1 px-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-[11px] font-semibold transition"
                    >
                      Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Floating Bottom Shoppable Scene Banner (TikTok Shop style) */}
      {activeSceneProduct && (
        <div className="absolute bottom-24 left-4 right-20 z-20 pointer-events-auto select-none">
          <div
            onClick={() => onOpenProductModal(activeSceneProduct)}
            className="flex items-center justify-between p-2 rounded-2xl bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/20 hover:border-pink-500/60 transition-all cursor-pointer shadow-xl group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-1">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-900 border border-white/20 shrink-0">
                <img
                  src={activeSceneProduct.image}
                  alt={activeSceneProduct.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              <div className="min-w-0 flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> Featured In Scene
                  </span>
                  {products.length > 1 && (
                    <span className="text-[9px] font-bold bg-neutral-800 text-neutral-300 px-1.5 py-0.2 rounded-full border border-neutral-700">
                      +{products.length - 1} more
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-extrabold text-white truncate max-w-[170px] leading-tight">
                  {activeSceneProduct.title}
                </h4>
                <div className="flex items-baseline gap-1.5 leading-none mt-0.5">
                  <span className="text-xs font-black text-white">
                    ${activeSceneProduct.price.toFixed(2)}
                  </span>
                  {activeSceneProduct.originalPrice && (
                    <span className="text-[10px] text-neutral-400 line-through">
                      ${activeSceneProduct.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick 1-tap Add to Cart Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={(e) => handleQuickAdd(e, activeSceneProduct)}
                className={`h-8 px-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1 transition active:scale-90 shadow-md ${
                  recentlyAddedId === activeSceneProduct.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                }`}
                aria-label="Quick add product to bag"
              >
                {recentlyAddedId === activeSceneProduct.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Added
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
