import React from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Sparkles, Plus, Check, Tag } from 'lucide-react';
import { VideoItem } from '../types';

interface RightActionDockProps {
  video: VideoItem;
  onLike: (e: React.MouseEvent) => void;
  onComment: () => void;
  onBookmark: (e: React.MouseEvent) => void;
  onShare: () => void;
  onOpenStudioWithRemix: () => void;
  onToggleFollow: (e: React.MouseEvent) => void;
  onOpenProducts?: () => void;
}

export const RightActionDock: React.FC<RightActionDockProps> = ({
  video,
  onLike,
  onComment,
  onBookmark,
  onShare,
  onOpenStudioWithRemix,
  onToggleFollow,
  onOpenProducts,
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-20 select-none">
      {/* Creator Profile Avatar with Follow Badge */}
      <div className="relative group cursor-pointer">
        <div className="w-12 h-12 rounded-full ring-2 ring-white/90 overflow-hidden shadow-lg p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400">
          <img
            src={video.author.avatar}
            alt={video.author.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        {!video.author.isFollowing && (
          <button
            onClick={onToggleFollow}
            aria-label="Follow creator"
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-transform active:scale-90"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        )}
        {video.author.isFollowing && (
          <button
            onClick={onToggleFollow}
            aria-label="Following creator"
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md"
          >
            <Check className="w-3 h-3 stroke-[3]" />
          </button>
        )}
      </div>

      {/* Like Button */}
      <button
        onClick={onLike}
        className="flex flex-col items-center group transition active:scale-75"
        aria-label="Like video"
      >
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 ${
            video.stats.isLiked
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110'
              : 'bg-black/35 hover:bg-black/55 text-white'
          }`}
        >
          <Heart
            className={`w-6 h-6 transition-all ${
              video.stats.isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'
            }`}
          />
        </div>
        <span className="text-white text-xs font-semibold mt-1 drop-shadow-md">
          {formatNumber(video.stats.likes)}
        </span>
      </button>

      {/* Comment Button */}
      <button
        onClick={onComment}
        className="flex flex-col items-center group transition active:scale-75"
        aria-label="View comments"
      >
        <div className="w-11 h-11 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-md flex items-center justify-center text-white transition-all group-hover:scale-110">
          <MessageCircle className="w-6 h-6" />
        </div>
        <span className="text-white text-xs font-semibold mt-1 drop-shadow-md">
          {formatNumber(video.stats.comments)}
        </span>
      </button>

      {/* Bookmark Button */}
      <button
        onClick={onBookmark}
        className="flex flex-col items-center group transition active:scale-75"
        aria-label="Bookmark video"
      >
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 ${
            video.stats.isBookmarked
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/40 scale-110'
              : 'bg-black/35 hover:bg-black/55 text-white'
          }`}
        >
          <Bookmark
            className={`w-6 h-6 transition-all ${
              video.stats.isBookmarked ? 'fill-current' : 'group-hover:scale-110'
            }`}
          />
        </div>
        <span className="text-white text-xs font-semibold mt-1 drop-shadow-md">
          {formatNumber(video.stats.bookmarks)}
        </span>
      </button>

      {/* Shoppable Products Tagged in Video */}
      {video.products && video.products.length > 0 && (
        <button
          onClick={onOpenProducts}
          className="flex flex-col items-center group transition active:scale-75"
          title={`Shop ${video.products.length} Products in this video`}
          aria-label="Shop products in video"
        >
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 backdrop-blur-md flex items-center justify-center text-white shadow-lg shadow-pink-500/30 transition-all group-hover:scale-110">
            <Tag className="w-5 h-5 -rotate-12 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 text-black text-[10px] font-black flex items-center justify-center border-2 border-black">
              {video.products.length}
            </span>
          </div>
          <span className="text-pink-300 text-[10px] font-black mt-1 tracking-wider drop-shadow">
            SHOP
          </span>
        </button>
      )}

      {/* Real-Time Social Share Button */}
      <button
        onClick={onShare}
        className="flex flex-col items-center group transition active:scale-75"
        aria-label="Share video & join watch party"
      >
        <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 backdrop-blur-md flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 transition-all group-hover:scale-110">
          <Share2 className="w-5 h-5 -rotate-12" />
          {/* Subtle live indicator pulse */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-300"></span>
          </span>
        </div>
        <span className="text-white text-xs font-semibold mt-1 drop-shadow-md">
          {formatNumber(video.stats.shares)}
        </span>
      </button>

      {/* AI Remix / Edit Studio Button */}
      <button
        onClick={onOpenStudioWithRemix}
        className="flex flex-col items-center group transition active:scale-75"
        title="Remix & Edit with AI"
        aria-label="AI Remix Studio"
      >
        <div className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/40 transition-all group-hover:rotate-12 group-hover:scale-110">
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="text-white text-[10px] font-bold mt-1 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-200">
          AI REMIX
        </span>
      </button>

      {/* Spinning Vinyl Record Disc with Floating Music Notes */}
      <div className="relative mt-2 cursor-pointer" onClick={onOpenStudioWithRemix}>
        <div className="w-12 h-12 rounded-full bg-neutral-900 border-2 border-white/60 p-1 flex items-center justify-center animate-[spin_6s_linear_infinite] shadow-xl">
          <img
            src={video.music.coverUrl || video.author.avatar}
            alt="music"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
