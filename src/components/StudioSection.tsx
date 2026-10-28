import React, { useState } from 'react';
import { Heart, Sparkles, ShoppingBag } from 'lucide-react';
import { LookbookLook, Product } from '../types';

interface StudioSectionProps {
  looks: LookbookLook[];
  allProducts: Product[];
  onOpenProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
}

export const StudioSection: React.FC<StudioSectionProps> = ({
  looks,
  allProducts,
  onOpenProduct,
  onQuickAdd
}) => {
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [isLikedMap, setIsLikedMap] = useState<Record<string, boolean>>({});

  const handleLike = (id: string, initialLikes: number) => {
    const isLiked = isLikedMap[id];
    setIsLikedMap((prev) => ({ ...prev, [id]: !isLiked }));
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialLikes) + (isLiked ? -1 : 1)
    }));
  };

  return (
    <section className="bg-neutral-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl my-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-rose-400 uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gpark Studio · Style Inspiration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Curated Editorial Looks & Wardrobes
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Tap into looks curated by our in-house fashion directors. Click any tagged item to view sizing and add directly to your bag.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            AUTUMN / WINTER '24 EDIT
          </span>
        </div>

        {/* Lookbook Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {looks.map((look) => {
            const taggedProducts = allProducts.filter((p) =>
              look.taggedProductIds.includes(p.id)
            );
            const likesCount = likesMap[look.id] ?? look.likes;
            const isLiked = !!isLikedMap[look.id];

            return (
              <div
                key={look.id}
                className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl"
              >
                {/* Look Visual with Tag Overlay */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                  <img
                    src={look.image}
                    alt={look.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                  
                  {/* Stylist Watermark */}
                  <div className="absolute top-4 left-4 bg-neutral-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-neutral-200 border border-neutral-700">
                    {look.stylist}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(look.id, look.likes)}
                    className="absolute top-4 right-4 bg-neutral-900/80 backdrop-blur-md p-2 rounded-full text-white border border-neutral-700 hover:text-rose-400 flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                    <span>{likesCount}</span>
                  </button>

                  {/* Title and Tagline */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {look.title}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-0.5">
                      {look.tagline}
                    </p>
                  </div>
                </div>

                {/* Tagged Products in this Look */}
                <div className="p-5 space-y-3 bg-neutral-850">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    <span>Shop The Garments in This Look ({taggedProducts.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {taggedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-700/60 hover:border-neutral-500 transition-colors cursor-pointer group"
                        onClick={() => onOpenProduct(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded-md bg-neutral-800"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block truncate">
                            {product.brand}
                          </span>
                          <h4 className="text-xs font-bold text-neutral-200 group-hover:text-rose-400 truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-baseline gap-1.5 mt-0.5 tabular-nums">
                            <span className="text-xs font-extrabold text-white">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-neutral-500 line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickAdd(product, product.sizes[0]);
                          }}
                          className="p-2 bg-neutral-800 hover:bg-rose-600 rounded-lg text-neutral-300 hover:text-white transition-colors"
                          title="Add to bag"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
