import React, { useState } from 'react';
import { Search, Flame, Music, Sparkles, Play, Hash } from 'lucide-react';
import { VideoItem } from '../types';
import { SAMPLE_AUDIO_TRACKS } from '../data/initialVideos';

interface ExploreTabProps {
  videos: VideoItem[];
  onSelectVideo: (videoId: string) => void;
  onOpenStudio: () => void;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({
  videos,
  onSelectVideo,
  onOpenStudio,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const tags = ['All', '🛍️ Shoppable', '#AIEditing', '#Cyberpunk', '#DanceTok', '#FoodTok', '#TravelDiaries', '#ViralHacks'];

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.hashtags.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.products && v.products.some((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesTag =
      activeTag === 'All' ||
      (activeTag === '🛍️ Shoppable'
        ? Boolean(v.products && v.products.length > 0)
        : v.hashtags.some((h) => h.toLowerCase() === activeTag.toLowerCase()));

    return matchesSearch && matchesTag;
  });

  return (
    <div className="w-full h-full bg-neutral-950 text-white overflow-y-auto pb-24 pt-4 px-4 max-w-2xl mx-auto">
      {/* Search Input Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search creators, sounds, #hashtags, AI edits..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition"
        />
      </div>

      {/* Hero Banner: AI Studio Highlight */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-900 via-pink-900 to-rose-900 p-4 border border-pink-500/30 mb-5 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-pink-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Creator Spotlight
            </div>
            <h3 className="text-white font-extrabold text-base">Next-Gen AI Video Studio</h3>
            <p className="text-neutral-300 text-xs mt-0.5 max-w-xs">
              Generate kinetic captions, viral hooks, and AI voiceovers in under 30 seconds.
            </p>
          </div>
          <button
            onClick={onOpenStudio}
            className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs shadow-lg hover:bg-neutral-100 transition active:scale-95 shrink-0"
          >
            Try Studio
          </button>
        </div>
      </div>

      {/* Trending Hashtag Pills */}
      <div className="mb-5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTag === tag
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Trending Audio Tracks */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 uppercase tracking-wider">
            <Music className="w-4 h-4 text-cyan-400" />
            Trending Viral Sounds
          </div>
          <span className="text-[11px] text-cyan-400 font-medium">Updated Hourly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {SAMPLE_AUDIO_TRACKS.slice(0, 4).map((track) => (
            <div
              key={track.id}
              onClick={() =>
                setPlayingTrackId(playingTrackId === track.id ? null : track.id)
              }
              className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800/80 transition cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${
                    playingTrackId === track.id
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-neutral-800 text-neutral-300 group-hover:bg-neutral-700'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div>
                  <h4 className="text-white text-xs font-bold">{track.name}</h4>
                  <span className="text-neutral-400 text-[10px]">
                    {track.artist} · {track.duration}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-md">
                {track.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
          <Flame className="w-4 h-4 text-rose-500" />
          Featured Short Videos ({filteredVideos.length})
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video.id)}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-pink-500/60 cursor-pointer transition-all shadow-md hover:scale-[1.02]"
            >
              <img
                src={video.thumbnail || video.author.avatar}
                alt={video.description}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* View stats badge */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span className="text-[11px] font-bold text-white line-clamp-2 leading-tight drop-shadow-md">
                  {video.description}
                </span>
                <div className="flex items-center justify-between text-[10px] text-neutral-300 mt-1">
                  <span>@{video.author.handle}</span>
                  <span className="flex items-center gap-0.5">
                    ❤️ {(video.stats.likes / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>

              {/* AI Badge if edited */}
              {video.captions && (
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-yellow-300 text-[9px] font-bold">
                  AI CAPTIONS
                </div>
              )}

              {/* Shoppable Products Badge */}
              {video.products && video.products.length > 0 && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-rose-500/90 text-white text-[9px] font-black shadow-md flex items-center gap-1 border border-white/20">
                  <span>🛍️</span>
                  <span>{video.products.length}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
