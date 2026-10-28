import React from 'react';
import { ShortVideo, Product } from '../types';
import { X, CheckCircle2, UserPlus, UserCheck, ShoppingBag, Heart, Eye } from 'lucide-react';

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: ShortVideo['creator'] | null;
  creatorShorts: ShortVideo[];
  allProducts: Product[];
  onSelectShort: (short: ShortVideo) => void;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onOpenProductModal: (product: Product) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  isOpen,
  onClose,
  creator,
  creatorShorts,
  allProducts,
  onSelectShort,
  isFollowing,
  onToggleFollow,
  onOpenProductModal
}) => {
  if (!isOpen || !creator) return null;

  // Extract products tagged by this creator
  const taggedProductIds = Array.from(
    new Set(creatorShorts.flatMap((s) => s.taggedProductIds))
  );
  const creatorProducts = allProducts.filter((p) => taggedProductIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl z-10 max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Cover Banner */}
        <div className="h-28 bg-gradient-to-r from-neutral-900 via-rose-950 to-neutral-900 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info Card */}
        <div className="px-6 pb-4 -mt-12 flex-1 overflow-y-auto">
          <div className="flex items-end justify-between gap-4">
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg bg-neutral-200"
              />
              {creator.verified && (
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-rose-500 fill-rose-50" />
                </div>
              )}
            </div>

            <button
              onClick={onToggleFollow}
              className={`px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
                isFollowing
                  ? 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-neutral-300'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Follow</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-extrabold text-neutral-900">
                {creator.name}
              </h2>
              {creator.verified && (
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                  Verified Creator
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500">{creator.handle}</p>
            <p className="text-xs text-neutral-700 mt-2 leading-relaxed">
              {creator.bio}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 py-3 my-4 border-y border-neutral-100 text-center">
            <div>
              <span className="block text-sm font-extrabold text-neutral-900 tabular-nums">
                {(creator.followersCount / 1000).toFixed(0)}K
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                Followers
              </span>
            </div>
            <div>
              <span className="block text-sm font-extrabold text-neutral-900 tabular-nums">
                {creatorShorts.length}
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                Shorts
              </span>
            </div>
            <div>
              <span className="block text-sm font-extrabold text-neutral-900 tabular-nums">
                {creatorProducts.length}
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                Shop Items
              </span>
            </div>
          </div>

          {/* Creator's Shoppable Shorts Grid */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center justify-between">
              <span>Shoppable Shorts</span>
              <span className="text-neutral-400 font-normal">{creatorShorts.length} videos</span>
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {creatorShorts.map((short) => (
                <div
                  key={short.id}
                  onClick={() => {
                    onSelectShort(short);
                    onClose();
                  }}
                  className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-neutral-900 cursor-pointer border border-neutral-200"
                >
                  <img
                    src={short.thumbnailUrl}
                    alt={short.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                      <Heart className="w-3 h-3 fill-white" />
                      <span className="tabular-nums">{(short.stats.likes / 1000).toFixed(1)}K</span>
                    </div>
                    {short.taggedProductIds.length > 0 && (
                      <span className="text-[8px] bg-rose-600 px-1 py-0.5 rounded font-bold w-fit mt-1 flex items-center gap-0.5">
                        <ShoppingBag className="w-2.5 h-2.5" />
                        Shop ({short.taggedProductIds.length})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Creator's Wardrobe Picks */}
            {creatorProducts.length > 0 && (
              <div className="pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2.5 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-rose-600" />
                  <span>Creator's Wardrobe Collection</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {creatorProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onOpenProductModal(p)}
                      className="p-2 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center gap-2 cursor-pointer hover:border-neutral-300 transition-colors"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-lg bg-white"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-neutral-900 truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] font-extrabold text-rose-600">
                          ₹{p.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
