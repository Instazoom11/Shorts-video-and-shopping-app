import React, { useRef, useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, Music2, Sparkles, Check } from 'lucide-react';
import { VideoItem, VideoFilter, ProductTag } from '../types';
import { RightActionDock } from './RightActionDock';
import { VideoProductHotspots } from './VideoProductHotspots';
import { ProductQuickViewModal } from './ProductQuickViewModal';
import { useCart } from '../context/CartContext';

interface VideoPlayerProps {
  video: VideoItem;
  isActive: boolean;
  onLike: (e?: React.MouseEvent) => void;
  onComment: () => void;
  onBookmark: (e?: React.MouseEvent) => void;
  onShare: () => void;
  onOpenStudioWithRemix: () => void;
  onToggleFollow: (e?: React.MouseEvent) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  isActive,
  onLike,
  onComment,
  onBookmark,
  onShare,
  onOpenStudioWithRemix,
  onToggleFollow,
}) => {
  const { openCart } = useCart();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [burstHearts, setBurstHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductTag | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const lastTapRef = useRef<number>(0);

  // Play/pause based on active feed index
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay policy might require mute
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play();
              setIsPlaying(true);
            }
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(cur);
    setDuration(dur);
    setProgress((cur / dur) * 100);
  };

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected: trigger like with bursting heart at mouse pos
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const heartId = Date.now();
      setBurstHearts((prev) => [...prev, { id: heartId, x, y }]);
      setTimeout(() => {
        setBurstHearts((prev) => prev.filter((h) => h.id !== heartId));
      }, 900);

      if (!video.stats.isLiked) {
        onLike();
      }
    } else {
      // Single tap toggle play
      togglePlay();
    }
    lastTapRef.current = now;
  };

  // Filter styling mapping
  const getFilterStyle = (f?: VideoFilter) => {
    switch (f) {
      case 'cyberpunk':
        return 'contrast-125 saturate-150 hue-rotate-15';
      case 'vhs':
        return 'sepia-[0.3] contrast-110 brightness-105';
      case 'sunset':
        return 'sepia-[0.25] saturate-130 brightness-105';
      case 'noir':
        return 'grayscale contrast-140';
      case 'vivid':
        return 'saturate-175 contrast-115';
      case 'glitch':
        return 'invert-[0.1] contrast-130 saturate-140';
      default:
        return '';
    }
  };

  // Find active caption segment
  const activeCaption = video.captions?.find(
    (c) => currentTime >= c.start && currentTime <= c.end
  );

  return (
    <div className="relative w-full h-full bg-black select-none overflow-hidden flex items-center justify-center">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.url}
        loop
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        className={`w-full h-full object-cover transition-all duration-300 ${getFilterStyle(
          video.filter
        )}`}
      />

      {/* Synchronized AI Voiceover Audio if attached */}
      {video.voiceoverUrl && (
        <audio
          src={video.voiceoverUrl}
          autoPlay={isActive && isPlaying}
          muted={isMuted}
          className="hidden"
        />
      )}

      {/* Tap Overlay for Play/Pause & Double-Tap Like */}
      <div
        className="absolute inset-0 cursor-pointer z-10"
        onClick={handleVideoClick}
      />

      {/* Bursting Hearts Animation on Double Tap */}
      {burstHearts.map((heart) => (
        <div
          key={heart.id}
          style={{ left: heart.x, top: heart.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 text-rose-500 animate-[ping_0.6s_ease-out] drop-shadow-2xl"
        >
          <svg className="w-20 h-20 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}

      {/* Paused Play Icon Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 animate-in zoom-in-75 duration-150">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>
      )}

      {/* Top Right Controls: Mute/Unmute */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (videoRef.current) {
              videoRef.current.muted = !isMuted;
              setIsMuted(!isMuted);
            }
          }}
          className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition shadow-md"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Video Stickers Overlay */}
      {video.stickers && video.stickers.length > 0 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/40 border border-white/40 transform -rotate-2">
            {video.stickers[0].text}
          </div>
        </div>
      )}

      {/* Kinetic Animated Captions Overlay */}
      {activeCaption && (
        <div className="absolute bottom-28 inset-x-6 flex justify-center z-20 pointer-events-none">
          <div className="text-center px-4 py-2 rounded-2xl bg-black/75 backdrop-blur-md border border-yellow-400/40 text-yellow-300 font-black text-lg md:text-xl tracking-wide shadow-lg shadow-yellow-500/20 transform transition-all animate-in zoom-in-95 duration-100">
            <span className="mr-1">{activeCaption.emoji}</span>
            <span>{activeCaption.text}</span>
          </div>
        </div>
      )}

      {/* Bottom Left Video Information (Creator, Caption, Music) */}
      <div className="absolute bottom-6 left-4 right-18 z-20 flex flex-col gap-2 pointer-events-auto">
        {/* Creator Info */}
        <div className="flex items-center gap-2">
          <span className="text-white font-extrabold text-sm drop-shadow-md">
            @{video.author.handle}
          </span>
          {video.author.verified && (
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 text-black text-[9px] font-black flex items-center justify-center">
              ✓
            </span>
          )}
          {video.filter && video.filter !== 'none' && (
            <span className="text-[10px] uppercase font-bold text-pink-300 bg-pink-500/25 border border-pink-500/30 px-2 py-0.5 rounded-full">
              {video.filter} FX
            </span>
          )}
        </div>

        {/* Video Description & Hashtags */}
        <p className="text-white text-xs leading-snug drop-shadow-md line-clamp-2">
          {video.description}{' '}
          {video.hashtags.map((h, i) => (
            <span key={i} className="font-bold text-cyan-300 mr-1 hover:underline cursor-pointer">
              {h}
            </span>
          ))}
        </p>

        {/* Marquee Audio Track */}
        <div
          onClick={onOpenStudioWithRemix}
          className="flex items-center gap-2 text-white/90 text-xs font-medium cursor-pointer hover:text-white transition group"
        >
          <Music2 className="w-3.5 h-3.5 text-pink-400 group-hover:rotate-12 transition-transform" />
          <div className="max-w-[200px] truncate drop-shadow-md">
            {video.music.name} · {video.music.author}
          </div>
        </div>
      </div>

      {/* In-Video Interactive Product Hotspot Tags & Bottom Scene Pill */}
      <VideoProductHotspots
        video={video}
        currentTime={currentTime}
        onOpenProductModal={(product) => {
          setSelectedProduct(product);
          setIsProductModalOpen(true);
        }}
      />

      {/* Right Action Dock (Likes, Comments, Share, Shop, Remix, Vinyl) */}
      <RightActionDock
        video={video}
        onLike={onLike}
        onComment={onComment}
        onBookmark={onBookmark}
        onShare={onShare}
        onOpenStudioWithRemix={onOpenStudioWithRemix}
        onToggleFollow={onToggleFollow}
        onOpenProducts={() => {
          if (video.products && video.products.length > 0) {
            setSelectedProduct(video.products[0]);
            setIsProductModalOpen(true);
          }
        }}
      />

      {/* In-Video Product Quick View Modal */}
      <ProductQuickViewModal
        product={selectedProduct}
        video={video}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onOpenCart={openCart}
      />

      {/* Bottom Progress Scrubber */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-30">
        <div
          className="h-full bg-gradient-to-r from-rose-500 to-cyan-400 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
