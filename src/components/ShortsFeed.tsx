import React, { useState, useEffect, useRef } from 'react';
import { ShortVideo, Product } from '../types';
import { hipiAudio } from '../utils/audioSynth';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Music2, 
  ShoppingBag, 
  Check, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Sparkles,
  Zap,
  Play,
  Pause
} from 'lucide-react';

interface ShortsFeedProps {
  shorts: ShortVideo[];
  allProducts: Product[];
  onOpenShoppableSheet: (short: ShortVideo) => void;
  onOpenCommentsSheet: (short: ShortVideo) => void;
  onOpenShareModal: (short: ShortVideo) => void;
  onOpenCreatorModal: (creator: ShortVideo['creator']) => void;
  onToggleLike: (shortId: string) => void;
  onToggleSave: (shortId: string) => void;
  onToggleFollow: (creatorId: string) => void;
  onOpenProductModal: (product: Product) => void;
  onEarnCoins: (amount: number, reason: string) => void;
}

export const ShortsFeed: React.FC<ShortsFeedProps> = ({
  shorts,
  allProducts,
  onOpenShoppableSheet,
  onOpenCommentsSheet,
  onOpenShareModal,
  onOpenCreatorModal,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onOpenProductModal,
  onEarnCoins
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [heartsList, setHeartsList] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showEarnedBadge, setShowEarnedBadge] = useState<string | null>(null);
  const [activeHotspotProduct, setActiveHotspotProduct] = useState<Product | null>(null);
  
  // Track watched shorts for rewards
  const watchedShorts = useRef<Set<string>>(new Set());
  const touchStartY = useRef<number | null>(null);

  const currentShort = shorts[currentIndex] || shorts[0];

  // Resolve tagged products for the current short
  const currentTaggedProducts = allProducts.filter((p) =>
    currentShort.taggedProductIds.includes(p.id)
  );

  // Sound sync
  useEffect(() => {
    if (!isMuted && isPlaying) {
      hipiAudio.playTrack(currentShort.music.genre);
    } else {
      hipiAudio.stop();
    }
  }, [currentIndex, isMuted, isPlaying, currentShort.music.genre]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      hipiAudio.stop();
    };
  }, []);

  // Reward coins when watching a short for 4 seconds
  useEffect(() => {
    if (!currentShort) return;
    const timer = setTimeout(() => {
      if (!watchedShorts.current.has(currentShort.id)) {
        watchedShorts.current.add(currentShort.id);
        onEarnCoins(10, `Watched short: ${currentShort.caption.slice(0, 24)}...`);
        setShowEarnedBadge('+10 Hipi Gems');
        setTimeout(() => setShowEarnedBadge(null), 2500);
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [currentIndex, currentShort, onEarnCoins]);

  // Keyboard navigation (ArrowUp, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        goToPrev();
      } else if (e.key === 'm') {
        toggleMute();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, shorts.length]);

  const goToNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop back to start
      setCurrentIndex(0);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY < -40) {
      goToNext();
    } else if (deltaY > 40) {
      goToPrev();
    }
    touchStartY.current = null;
  };

  // Wheel handling with debounce
  const wheelLock = useRef(false);
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelLock.current) return;
    if (Math.abs(e.deltaY) > 30) {
      wheelLock.current = true;
      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
      setTimeout(() => {
        wheelLock.current = false;
      }, 500);
    }
  };

  // Double tap to like with heart animation
  const lastTapRef = useRef<number>(0);
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (now - lastTapRef.current < 300) {
      // Double tap!
      onToggleLike(currentShort.id);
      const newHeart = { id: now, x, y };
      setHeartsList((prev) => [...prev, newHeart]);
      setTimeout(() => {
        setHeartsList((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 1000);
    } else {
      // Single tap toggle pause
      setIsPlaying((prev) => !prev);
    }
    lastTapRef.current = now;
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      hipiAudio.playTrack(currentShort.music.genre);
    } else {
      hipiAudio.stop();
    }
  };

  return (
    <div 
      className="relative w-full h-[calc(100vh-4rem)] max-h-[880px] bg-neutral-950 flex items-center justify-center overflow-hidden select-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Ambient Background Blur */}
      <div 
        className="absolute inset-0 opacity-40 blur-3xl scale-125 transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `url(${currentShort.thumbnailUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Main 9:16 Shorts Canvas Container */}
      <div className="relative h-full aspect-[9/16] max-w-[430px] bg-neutral-900 rounded-none sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between border-0 sm:border border-neutral-800">

        {/* Video / Visual Layer */}
        <div 
          onClick={handleScreenClick}
          className="absolute inset-0 cursor-pointer overflow-hidden"
        >
          <img
            src={currentShort.thumbnailUrl}
            alt={currentShort.caption}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? 'scale-105' : 'scale-100 filter brightness-90'
            }`}
          />

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-2xs pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20">
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Contrast Scrims */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />

          {/* Interactive Outfit Hotspots / Tags */}
          {currentShort.hotspots?.map((hotspot) => {
            const product = allProducts.find((p) => p.id === hotspot.productId);
            if (!product) return null;

            return (
              <div
                key={hotspot.productId}
                style={{ left: `${hotspot.xPercent}%`, top: `${hotspot.yPercent}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenShoppableSheet(currentShort);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
              >
                {/* Pulsing Target Ring */}
                <div className="relative flex items-center">
                  <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-rose-500 opacity-75" />
                  <div className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-rose-400 text-white shadow-xl hover:scale-105 transition-transform">
                    <ShoppingBag className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="text-[11px] font-bold whitespace-nowrap">
                      {hotspot.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Double-tap Floating Hearts */}
          {heartsList.map((heart) => (
            <div
              key={heart.id}
              style={{ left: heart.x, top: heart.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-in zoom-in-50 fade-in duration-300"
            >
              <Heart className="w-20 h-20 text-rose-500 fill-rose-500 filter drop-shadow-lg animate-bounce" />
            </div>
          ))}
        </div>

        {/* Top Floating Controls */}
        <div className="relative z-20 flex items-center justify-between px-4 pt-4 text-white">
          {/* Feed Filter Pill */}
          <div className="flex items-center gap-3 text-sm font-bold">
            <span className="text-white border-b-2 border-white pb-0.5 cursor-pointer">
              For You
            </span>
            <span className="text-white/60 hover:text-white cursor-pointer">
              Following
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Coins Earned Floating Badge */}
            {showEarnedBadge && (
              <div className="bg-amber-400 text-neutral-950 font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-in zoom-in-75 duration-200">
                <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />
                <span>{showEarnedBadge}</span>
              </div>
            )}

            {/* Sound Toggle */}
            <button
              onClick={toggleMute}
              className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/70 transition-all"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white/80" />
              ) : (
                <Volume2 className="w-4 h-4 text-rose-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Right Action Sidebar (Thumb Zone) */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4 text-white">
          
          {/* Creator Avatar with Follow Plus Button */}
          <div className="relative">
            <button
              onClick={() => onOpenCreatorModal(currentShort.creator)}
              className="w-11 h-11 rounded-full border-2 border-white overflow-hidden p-0.5 bg-neutral-800 shadow-lg active:scale-95 transition-transform"
            >
              <img
                src={currentShort.creator.avatar}
                alt={currentShort.creator.name}
                className="w-full h-full object-cover rounded-full"
              />
            </button>
            <button
              onClick={() => onToggleFollow(currentShort.creator.id)}
              className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-all ${
                currentShort.isFollowing
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              {currentShort.isFollowing ? (
                <Check className="w-3 h-3" />
              ) : (
                <Plus className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Like Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onToggleLike(currentShort.id)}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center hover:bg-black/60 active:scale-125 transition-transform"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  currentShort.isLiked
                    ? 'fill-rose-500 stroke-rose-500 text-rose-500'
                    : 'text-white'
                }`}
              />
            </button>
            <span className="text-[11px] font-bold mt-1 tabular-nums drop-shadow">
              {(currentShort.stats.likes / 1000).toFixed(1)}K
            </span>
          </div>

          {/* Comments Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onOpenCommentsSheet(currentShort)}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center hover:bg-black/60 active:scale-110 transition-transform"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </button>
            <span className="text-[11px] font-bold mt-1 tabular-nums drop-shadow">
              {currentShort.commentsList.length}
            </span>
          </div>

          {/* Bookmark Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onToggleSave(currentShort.id)}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center hover:bg-black/60 active:scale-110 transition-transform"
            >
              <Bookmark
                className={`w-6 h-6 transition-colors ${
                  currentShort.isSaved
                    ? 'fill-amber-400 stroke-amber-400 text-amber-400'
                    : 'text-white'
                }`}
              />
            </button>
            <span className="text-[11px] font-bold mt-1 tabular-nums drop-shadow">
              {(currentShort.stats.saves / 1000).toFixed(1)}K
            </span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onOpenShareModal(currentShort)}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center hover:bg-black/60 active:scale-110 transition-transform"
            >
              <Share2 className="w-6 h-6 text-white" />
            </button>
            <span className="text-[11px] font-bold mt-1 uppercase text-[10px] drop-shadow">
              Share
            </span>
          </div>

          {/* Spinning Vinyl Record */}
          <div className="relative pt-2">
            <div 
              className={`w-10 h-10 rounded-full bg-gradient-to-tr from-neutral-900 via-neutral-700 to-neutral-900 border-2 border-neutral-600 flex items-center justify-center shadow-lg ${
                !isMuted && isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            >
              <div className="w-4 h-4 rounded-full bg-rose-600 border border-white flex items-center justify-center">
                <Music2 className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Details & Shoppable Banner */}
        <div className="relative z-20 px-4 pb-4 text-white flex flex-col gap-2.5">
          
          {/* 🛍️ Floating "Shop The Look" Action Bar */}
          {currentTaggedProducts.length > 0 && (
            <div
              onClick={() => onOpenShoppableSheet(currentShort)}
              className="group w-full max-w-[340px] bg-neutral-900/90 hover:bg-neutral-900 backdrop-blur-md border border-white/20 hover:border-rose-400 rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-2xl cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-neutral-800 border border-white/10">
                  <img
                    src={currentTaggedProducts[0].image}
                    alt={currentTaggedProducts[0].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-rose-600 text-white text-[8px] font-bold px-1 rounded-bl">
                    SALE
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Shop The Look ({currentTaggedProducts.length})
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white truncate leading-tight mt-0.5">
                    {currentTaggedProducts[0].name}
                  </p>
                  <p className="text-xs font-extrabold text-white mt-0.5">
                    ₹{currentTaggedProducts[0].price.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] font-normal text-white/60 line-through">
                      ₹{currentTaggedProducts[0].originalPrice.toLocaleString('en-IN')}
                    </span>
                  </p>
                </div>
              </div>

              <button className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl flex items-center gap-1 shadow-md shrink-0">
                <span>View</span>
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Creator Handle & Caption */}
          <div className="pr-12">
            <div className="flex items-center gap-2">
              <span
                onClick={() => onOpenCreatorModal(currentShort.creator)}
                className="font-bold text-sm hover:underline cursor-pointer flex items-center gap-1 text-white"
              >
                {currentShort.creator.name}
              </span>
              <span className="text-xs text-white/60">
                {currentShort.creator.handle}
              </span>
            </div>

            <p className="text-xs text-white/90 mt-1 line-clamp-2 leading-relaxed font-normal">
              {currentShort.caption}
            </p>

            {/* Hashtags */}
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {currentShort.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold text-rose-300 hover:underline cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Audio Track Ticker */}
            <div className="flex items-center gap-2 mt-2 text-[11px] text-white/80">
              <Music2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <div className="overflow-hidden whitespace-nowrap">
                <span className="inline-block animate-marquee">
                  {currentShort.music.title} · {currentShort.music.artist}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Video Scrub Progress Line */}
        <div className="w-full h-1 bg-white/20">
          <div 
            className="h-full bg-rose-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / shorts.length) * 100}%` }}
          />
        </div>

      </div>

      {/* Desktop Quick Nav Controls */}
      <div className="hidden lg:flex flex-col gap-3 ml-6 z-20">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="w-11 h-11 rounded-full bg-neutral-900/80 hover:bg-neutral-800 disabled:opacity-30 border border-neutral-700 text-white flex items-center justify-center transition-all shadow-lg"
          title="Previous short (Up Arrow)"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        <div className="text-center text-xs font-bold text-white/60 tabular-nums">
          {currentIndex + 1} / {shorts.length}
        </div>

        <button
          onClick={goToNext}
          className="w-11 h-11 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center transition-all shadow-lg"
          title="Next short (Down Arrow)"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
};
