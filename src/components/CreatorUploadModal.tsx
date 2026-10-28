import React, { useState } from 'react';
import { Product, ShortVideo } from '../types';
import { X, Upload, Tag, Music, Sparkles, Check, CheckCircle2, Film } from 'lucide-react';

interface CreatorUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
  onPublishShort: (newShort: ShortVideo) => void;
}

const TEMPLATE_PRESETS = [
  {
    name: 'Streetwear & Denim Loft',
    image: '/src/assets/images/short_streetwear_reel_1793094079389.jpg',
    genre: 'Chillhop',
    musicTitle: 'Loft Vibes & Grooves',
    defaultCaption: 'Minimalist street edit ☕ Relaxed layers for the season. Tap to shop!'
  },
  {
    name: 'Festive Zari Couture',
    image: '/src/assets/images/short_festive_fusion_1793094080182.jpg',
    genre: 'Electro Folk',
    musicTitle: 'Royal Sangeet Fusion',
    defaultCaption: 'Rich royal emerald fusion look ✨ Perfect for festive occasions.'
  },
  {
    name: 'Luxury EDC & Timepieces',
    image: '/src/assets/images/short_luxury_watch_1793094080929.jpg',
    genre: 'Synthwave',
    musicTitle: 'Titanium Midnight Run',
    defaultCaption: 'Everyday carry essentials 💼 Built to last. Tap to view pieces.'
  },
  {
    name: 'Dewy Skin Routine',
    image: '/src/assets/images/short_beauty_skincare_1793094079976.jpg',
    genre: 'Ambient',
    musicTitle: 'Dewy Botanical Mornings',
    defaultCaption: 'Morning skincare routine for glowing skin 💧 50% discount today!'
  }
];

export const CreatorUploadModal: React.FC<CreatorUploadModalProps> = ({
  isOpen,
  onClose,
  allProducts,
  onPublishShort
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATE_PRESETS[0]);
  const [caption, setCaption] = useState(TEMPLATE_PRESETS[0].defaultCaption);
  const [tags, setTags] = useState('#OOTD, #HipiShop, #Trending');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([allProducts[0]?.id || 'gp-men-01']);
  const [isPublished, setIsPublished] = useState(false);

  if (!isOpen) return null;

  const handleToggleProduct = (productId: string) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectTemplate = (tmpl: typeof TEMPLATE_PRESETS[0]) => {
    setSelectedTemplate(tmpl);
    setCaption(tmpl.defaultCaption);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || selectedProductIds.length === 0) return;

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const newShort: ShortVideo = {
      id: `short-user-${Date.now()}`,
      thumbnailUrl: selectedTemplate.image,
      creator: {
        id: 'user-creator-self',
        name: 'You (Creator)',
        handle: '@my_hipistudio',
        avatar: selectedTemplate.image,
        verified: true,
        followersCount: 1200,
        bio: 'Fashion curator & short video shopper on Hipi ✨'
      },
      caption: caption.trim(),
      tags: parsedTags.length > 0 ? parsedTags : ['#HipiCreator', '#ShoppableShorts'],
      music: {
        title: selectedTemplate.musicTitle,
        artist: 'Hipi Studio Sounds',
        genre: selectedTemplate.genre
      },
      stats: {
        likes: 1,
        comments: 0,
        shares: 0,
        saves: 0,
        views: 12
      },
      isLiked: true,
      isSaved: false,
      isFollowing: false,
      taggedProductIds: selectedProductIds,
      commentsList: [],
      videoVibeColor: '#e11d48'
    };

    onPublishShort(newShort);
    setIsPublished(true);
    setTimeout(() => {
      setIsPublished(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-base font-extrabold text-neutral-900">
                Hipi Creator Studio
              </h3>
              <p className="text-[11px] text-neutral-500">
                Post short video & tag products to earn 50 Gems!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isPublished ? (
          <div className="py-16 px-6 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              Short Published Successfully!
            </h3>
            <p className="text-xs text-neutral-500 max-w-xs">
              Your video is now live on the Hipi Shorts feed with shoppable product tags. You earned +50 Hipi Gems! 🪙
            </p>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* Step 1: Select Video Look */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                1. Select Video Preset / Look
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TEMPLATE_PRESETS.map((tmpl) => {
                  const isSelected = selectedTemplate.name === tmpl.name;
                  return (
                    <div
                      key={tmpl.name}
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        isSelected
                          ? 'border-rose-600 ring-2 ring-rose-400 shadow-md scale-102'
                          : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={tmpl.image}
                        alt={tmpl.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                        <span className="text-[10px] font-bold leading-tight">
                          {tmpl.name}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Tag Products */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-rose-600" />
                  <span>2. Tag Products In This Short</span>
                </label>
                <span className="text-xs text-rose-600 font-semibold">
                  {selectedProductIds.length} selected
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mb-2">
                Viewers will be able to buy these items right inside your video!
              </p>

              <div className="max-h-40 overflow-y-auto space-y-2 border border-neutral-200 rounded-xl p-2 bg-neutral-50">
                {allProducts.map((p) => {
                  const isTagged = selectedProductIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleToggleProduct(p.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        isTagged
                          ? 'bg-rose-50 border border-rose-300'
                          : 'bg-white hover:bg-neutral-100 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-9 h-9 rounded object-cover bg-neutral-200"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-900 truncate">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            ₹{p.price} · {p.brand}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center ${
                          isTagged
                            ? 'bg-rose-600 border-rose-600 text-white'
                            : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {isTagged && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Caption & Tags */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  3. Caption
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tell your viewers about your look..."
                  className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:border-rose-500 outline-hidden transition-all text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Hashtags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="#OOTD, #Style, #Sale"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300 focus:border-rose-500 outline-hidden transition-all text-neutral-900"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Audio Track: <strong>{selectedTemplate.musicTitle}</strong> ({selectedTemplate.genre})
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!caption.trim() || selectedProductIds.length === 0}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              <span>Publish Shoppable Short</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
