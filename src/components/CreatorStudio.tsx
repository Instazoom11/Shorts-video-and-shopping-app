import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Volume2,
  Play,
  Pause,
  Wand2,
  Sliders,
  Type,
  Music,
  Check,
  Loader2,
  RefreshCw,
  Video,
  Mic,
  Smile,
  Layers,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CaptionSegment, VideoFilter, VideoItem } from '../types';
import { SAMPLE_TEMPLATES, SAMPLE_AUDIO_TRACKS, INITIAL_VIDEOS } from '../data/initialVideos';

interface CreatorStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (video: VideoItem) => void;
  initialTemplate?: string;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  isOpen,
  onClose,
  onPublish,
  initialTemplate,
}) => {
  // Source selection
  const [sourceMode, setSourceMode] = useState<'template' | 'camera' | 'upload'>('template');
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>(
    SAMPLE_TEMPLATES[0].url
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTemplate || SAMPLE_TEMPLATES[0].id
  );

  // Camera recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [cameraCountdown, setCameraCountdown] = useState<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  // Active AI Studio Tab
  const [activeTab, setActiveTab] = useState<'ai_captions' | 'ai_hooks' | 'ai_tts' | 'filters' | 'stickers'>('ai_captions');

  // Video state & overlays
  const [description, setDescription] = useState('My viral short created with AI Studio ✨');
  const [hashtags, setHashtags] = useState<string[]>(['#fyp', '#AIEditing', '#TikPulse', '#viral']);
  const [selectedFilter, setSelectedFilter] = useState<VideoFilter>('cyberpunk');
  const [selectedSpeed, setSelectedSpeed] = useState<number>(1.0);
  const [activeSticker, setActiveSticker] = useState<string>('WAIT FOR IT 👀');
  const [selectedMusic, setSelectedMusic] = useState(SAMPLE_AUDIO_TRACKS[0]);

  // AI Auto-Captions state
  const [captionPrompt, setCaptionPrompt] = useState('Wait till the end to see the mind-blowing result!');
  const [captions, setCaptions] = useState<CaptionSegment[]>([
    { start: 0.1, end: 1.8, text: 'WAIT TILL', highlight: 'WAIT', emoji: '👀' },
    { start: 1.9, end: 3.5, text: 'THE END', highlight: 'END', emoji: '🔥' },
    { start: 3.6, end: 6.0, text: 'MIND BLOWING RESULT', highlight: 'MIND', emoji: '🤯' },
  ]);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [captionStyle, setCaptionStyle] = useState<'yellow_neon' | 'black_box' | 'pop_bounce'>('yellow_neon');

  // AI Hooks state
  const [hookTopic, setHookTopic] = useState('Secret AI video editing tricks that 99% don’t know');
  const [generatedHooks, setGeneratedHooks] = useState<any[]>([]);
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);

  // AI TTS Voiceover state
  const [ttsScript, setTtsScript] = useState('This AI video editor turns raw footage into viral clips in seconds.');
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr'>('Kore');
  const [voiceoverAudioUrl, setVoiceoverAudioUrl] = useState<string | null>(null);
  const [isGeneratingTts, setIsGeneratingTts] = useState(false);

  // Preview Player
  const [isPlaying, setIsPlaying] = useState(true);
  const [previewCurrentTime, setPreviewCurrentTime] = useState(0);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const audioVoiceRef = useRef<HTMLAudioElement>(null);

  // Cleanup camera stream when closing or switching mode
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Sync preview time for captions
  useEffect(() => {
    const video = previewVideoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setPreviewCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // Sync playback speed on video ref
  useEffect(() => {
    if (previewVideoRef.current) {
      previewVideoRef.current.playbackRate = selectedSpeed;
    }
  }, [selectedSpeed, selectedVideoUrl]);

  // Camera start logic
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: true,
      });
      mediaStreamRef.current = stream;
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        cameraVideoRef.current.play();
      }
    } catch (err) {
      console.warn('Could not access camera, falling back to template mode:', err);
      alert('Camera access was not permitted. Switching back to templates.');
      setSourceMode('template');
    }
  };

  const handleStartRecording = () => {
    setCameraCountdown(3);
    const countTimer = setInterval(() => {
      setCameraCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countTimer);
          beginMediaRecorder();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const beginMediaRecorder = () => {
    if (!mediaStreamRef.current) return;
    setRecordedChunks([]);
    const recorder = new MediaRecorder(mediaStreamRef.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks((prev) => [...prev, e.data]);
      }
    };

    recorder.onstop = () => {
      setIsRecording(false);
      setRecordingSeconds(0);
    };

    recorder.start(100);
    setIsRecording(true);

    const timer = setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev >= 15) {
          handleStopRecording();
          clearInterval(timer);
          return 15;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Wait for blob and create url
      setTimeout(() => {
        if (recordedChunks.length > 0) {
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setSelectedVideoUrl(url);
          setSourceMode('template'); // return to studio editor with recorded clip
        }
      }, 300);
    }
  };

  // Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedVideoUrl(url);
      setSourceMode('template');
    }
  };

  // AI Auto Captions Generator
  const generateAiCaptions = async () => {
    setIsGeneratingCaptions(true);
    try {
      const res = await fetch('/api/ai/auto-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speechText: captionPrompt,
          style: captionStyle,
        }),
      });
      const data = await res.json();
      if (data.captions && Array.isArray(data.captions)) {
        setCaptions(data.captions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  // AI Viral Hooks Generator
  const generateAiHooks = async () => {
    setIsGeneratingHooks(true);
    try {
      const res = await fetch('/api/ai/viral-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: hookTopic,
          niche: 'Tech & Viral Content',
        }),
      });
      const data = await res.json();
      if (data.hooks) setGeneratedHooks(data.hooks);
      if (data.hashtags) setHashtags(data.hashtags);
      if (data.caption) setDescription(data.caption);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  // AI TTS Voiceover Generator
  const generateAiVoiceover = async () => {
    setIsGeneratingTts(true);
    try {
      const res = await fetch('/api/ai/voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ttsScript,
          voice: selectedVoice,
        }),
      });
      const data = await res.json();
      if (data.audioUrl) {
        setVoiceoverAudioUrl(data.audioUrl);
      }
    } catch (err) {
      console.error('Error generating voiceover:', err);
    } finally {
      setIsGeneratingTts(false);
    }
  };

  // Publish to Feed
  const handlePublishVideo = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const newVideo: VideoItem = {
      id: `vid-user-${Date.now()}`,
      url: selectedVideoUrl,
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
      author: {
        id: 'usr-self',
        name: 'You (Creator)',
        handle: 'your_creative_space',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        verified: true,
        followers: '1',
        isFollowing: false,
      },
      description,
      hashtags,
      music: {
        name: `${selectedMusic.name} (AI Sync)`,
        author: selectedMusic.artist,
      },
      stats: {
        likes: 1,
        comments: 0,
        shares: 0,
        bookmarks: 0,
        isLiked: true,
        isBookmarked: false,
      },
      captions,
      filter: selectedFilter,
      speed: selectedSpeed,
      voiceoverUrl: voiceoverAudioUrl || undefined,
      stickers: activeSticker ? [{ id: 'stk-1', text: activeSticker, x: 50, y: 25 }] : [],
      products: INITIAL_VIDEOS.find((v) => v.id === selectedTemplateId)?.products || INITIAL_VIDEOS[0].products,
      isUserCreated: true,
      createdAt: Date.now(),
    };

    onPublish(newVideo);
    onClose();
  };

  // Active caption text for current time
  const currentCaption = captions.find(
    (c) => previewCurrentTime >= c.start && previewCurrentTime <= c.end
  );

  // Filter CSS class mapping
  const getFilterStyle = (f: VideoFilter) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200">
      {/* Top Mobile Bar */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800 z-30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <h2 className="text-white font-bold text-xs tracking-wider uppercase">AI Creator Studio</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-full bg-neutral-800 text-neutral-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* LEFT / CENTER: Phone-Frame Video Canvas Preview */}
      <div className="relative flex-1 bg-black flex flex-col items-center justify-center p-3 md:p-6 overflow-hidden">
        {/* Source Switcher Toolbar (Top) */}
        <div className="mb-3 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-full border border-neutral-800 z-20">
          <button
            onClick={() => setSourceMode('template')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              sourceMode === 'template' ? 'bg-cyan-500 text-black shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Templates
          </button>
          <button
            onClick={() => {
              setSourceMode('camera');
              startCamera();
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              sourceMode === 'camera' ? 'bg-rose-500 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> WebCam Record
          </button>
          <label className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 text-neutral-400 hover:text-white cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" /> Upload File
            <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Video Canvas Container (9:16 Aspect Ratio) */}
        <div className="relative w-full max-w-[340px] md:max-w-[360px] h-[60vh] md:h-[78vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-800 bg-neutral-900 flex items-center justify-center group">
          {sourceMode === 'camera' ? (
            /* Live Camera Recording Screen */
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video
                ref={cameraVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />

              {/* Countdown Overlay */}
              {cameraCountdown !== null && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
                  <span className="text-7xl font-black text-rose-500 animate-ping">
                    {cameraCountdown}
                  </span>
                </div>
              )}

              {/* Recording Timer & Red Dot */}
              {isRecording && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold animate-pulse z-20">
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                  REC 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 15s
                </div>
              )}

              {/* Recording Controls */}
              <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-4 z-20">
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-rose-500 hover:bg-rose-600 shadow-xl transition active:scale-90"
                  >
                    <div className="w-6 h-6 rounded-full bg-white" />
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-black/60 shadow-xl transition active:scale-90"
                  >
                    <div className="w-6 h-6 rounded-sm bg-rose-500" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Active Video Playback with Overlays */
            <div className="relative w-full h-full">
              <video
                ref={previewVideoRef}
                src={selectedVideoUrl}
                autoPlay
                loop
                playsInline
                muted={!!voiceoverAudioUrl} // Mute background when voiceover plays
                className={`w-full h-full object-cover transition-all duration-300 ${getFilterStyle(
                  selectedFilter
                )}`}
                onClick={() => {
                  if (previewVideoRef.current) {
                    if (isPlaying) previewVideoRef.current.pause();
                    else previewVideoRef.current.play();
                    setIsPlaying(!isPlaying);
                  }
                }}
              />

              {/* Voiceover Audio Sync */}
              {voiceoverAudioUrl && (
                <audio
                  ref={audioVoiceRef}
                  src={voiceoverAudioUrl}
                  autoPlay
                  loop
                  className="hidden"
                />
              )}

              {/* Active Sticker Overlay */}
              {activeSticker && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                  <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/40 border border-white/40 transform -rotate-2 animate-bounce">
                    {activeSticker}
                  </div>
                </div>
              )}

              {/* AI Kinetic Subtitles Overlay */}
              {currentCaption && (
                <div className="absolute bottom-20 inset-x-4 flex justify-center z-20 pointer-events-none">
                  <div
                    className={`text-center px-4 py-2 rounded-xl backdrop-blur-md transform transition-all duration-100 ${
                      captionStyle === 'yellow_neon'
                        ? 'bg-black/75 text-yellow-300 font-black text-lg shadow-yellow-500/30 shadow-lg border border-yellow-400/40'
                        : captionStyle === 'black_box'
                        ? 'bg-white text-black font-extrabold text-base px-5 py-2 shadow-xl'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg shadow-lg'
                    }`}
                  >
                    <span className="mr-1">{currentCaption.emoji}</span>
                    <span className="tracking-wide">{currentCaption.text}</span>
                  </div>
                </div>
              )}

              {/* Filter Watermark Indicator */}
              <div className="absolute top-4 right-4 z-20 px-2 py-0.5 rounded-md bg-black/50 text-[10px] text-white/80 font-mono">
                {selectedFilter.toUpperCase()} · {selectedSpeed}x
              </div>

              {/* Play/Pause Overlay indicator */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                  <Play className="w-12 h-12 text-white/90 drop-shadow-lg" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR: AI Editing Tool Suite & Controls */}
      <div className="w-full md:w-[420px] bg-neutral-900 border-l border-neutral-800 flex flex-col h-[40vh] md:h-full z-20 shadow-2xl">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">AI Creator Studio</h2>
              <span className="text-neutral-400 text-xs">TikPulse Engine</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Tool Selector Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/60 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('ai_captions')}
            className={`flex-1 min-w-[75px] py-3 text-xs font-semibold flex flex-col items-center gap-1 border-b-2 transition ${
              activeTab === 'ai_captions'
                ? 'border-yellow-400 text-yellow-300 bg-yellow-500/10'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Captions</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_hooks')}
            className={`flex-1 min-w-[75px] py-3 text-xs font-semibold flex flex-col items-center gap-1 border-b-2 transition ${
              activeTab === 'ai_hooks'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Viral Hooks</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_tts')}
            className={`flex-1 min-w-[75px] py-3 text-xs font-semibold flex flex-col items-center gap-1 border-b-2 transition ${
              activeTab === 'ai_tts'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>AI Voice</span>
          </button>

          <button
            onClick={() => setActiveTab('filters')}
            className={`flex-1 min-w-[75px] py-3 text-xs font-semibold flex flex-col items-center gap-1 border-b-2 transition ${
              activeTab === 'filters'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => setActiveTab('stickers')}
            className={`flex-1 min-w-[75px] py-3 text-xs font-semibold flex flex-col items-center gap-1 border-b-2 transition ${
              activeTab === 'stickers'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>Badges</span>
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: AI Auto-Captions */}
          {activeTab === 'ai_captions' && (
            <div className="space-y-4">
              <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
                <span className="text-white font-bold text-xs flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  Kinetic Typography Subtitles
                </span>
                <p className="text-neutral-400 text-xs mb-3">
                  AI generates synchronized animated word-by-word captions to boost viewer retention.
                </p>
                <textarea
                  value={captionPrompt}
                  onChange={(e) => setCaptionPrompt(e.target.value)}
                  placeholder="Enter script or dialogue to animate..."
                  rows={3}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />

                {/* Subtitle Style Chooser */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setCaptionStyle('yellow_neon')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition ${
                      captionStyle === 'yellow_neon'
                        ? 'bg-yellow-400 text-black border-yellow-300'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    ⚡ Neon Pop
                  </button>
                  <button
                    onClick={() => setCaptionStyle('black_box')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition ${
                      captionStyle === 'black_box'
                        ? 'bg-white text-black border-white'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    🔲 White Box
                  </button>
                  <button
                    onClick={() => setCaptionStyle('pop_bounce')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition ${
                      captionStyle === 'pop_bounce'
                        ? 'bg-pink-500 text-white border-pink-400'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    🎉 Bubble
                  </button>
                </div>

                <button
                  onClick={generateAiCaptions}
                  disabled={isGeneratingCaptions}
                  className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition cursor-pointer"
                >
                  {isGeneratingCaptions ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating Timed Captions...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" /> AI Auto-Generate Captions
                    </>
                  )}
                </button>
              </div>

              {/* Active Timed Segments Display */}
              <div>
                <span className="text-neutral-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                  Generated Timed Beats ({captions.length})
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {captions.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-mono text-[11px]">
                          {c.start}s - {c.end}s
                        </span>
                        <span className="text-neutral-200 font-semibold">{c.text}</span>
                      </div>
                      <span className="text-neutral-400">{c.emoji}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI Viral Hooks & Scripts */}
          {activeTab === 'ai_hooks' && (
            <div className="space-y-4">
              <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
                <span className="text-white font-bold text-xs flex items-center gap-1.5 mb-2">
                  <Wand2 className="w-3.5 h-3.5 text-pink-400" />
                  Viral Hook & Retention Optimizer
                </span>
                <p className="text-neutral-400 text-xs mb-3">
                  Generates psychological curiosity hooks proven to stop the scroll in the first 2 seconds.
                </p>
                <input
                  type="text"
                  value={hookTopic}
                  onChange={(e) => setHookTopic(e.target.value)}
                  placeholder="Enter video topic or premise..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />

                <button
                  onClick={generateAiHooks}
                  disabled={isGeneratingHooks}
                  className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition cursor-pointer"
                >
                  {isGeneratingHooks ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing Viral Patterns...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Generate 3 Viral Hooks
                    </>
                  )}
                </button>
              </div>

              {/* Generated Hooks List */}
              {generatedHooks.length > 0 && (
                <div className="space-y-2">
                  <span className="text-neutral-400 text-xs font-semibold uppercase tracking-wider block">
                    Choose Your Hook
                  </span>
                  {generatedHooks.map((h, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setDescription(h.hook);
                        setCaptionPrompt(h.hook);
                      }}
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-pink-500/60 cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                          {h.style}
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          {h.retentionScore}% Retention
                        </span>
                      </div>
                      <p className="text-xs text-white font-medium group-hover:text-pink-300 transition">
                        "{h.hook}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI Voiceover (Gemini 3.8 Flash Lite TTS) */}
          {activeTab === 'ai_tts' && (
            <div className="space-y-4">
              <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
                <span className="text-white font-bold text-xs flex items-center gap-1.5 mb-2">
                  <Mic className="w-3.5 h-3.5 text-cyan-400" />
                  AI Voiceover Narration (Gemini TTS)
                </span>
                <p className="text-neutral-400 text-xs mb-3">
                  Turn text into studio-grade voiceover synced directly with your video clip.
                </p>

                <textarea
                  value={ttsScript}
                  onChange={(e) => setTtsScript(e.target.value)}
                  placeholder="Voiceover narration script..."
                  rows={3}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />

                {/* Voice Selection */}
                <span className="text-[11px] text-neutral-400 font-semibold block mt-3 mb-1.5">
                  Select AI Voice Persona:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'] as const).map((voice) => (
                    <button
                      key={voice}
                      onClick={() => setSelectedVoice(voice)}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                        selectedVoice === voice
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                          : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {voice}
                      <span className="block text-[9px] font-normal opacity-75">
                        {voice === 'Kore' ? 'Energetic' : voice === 'Puck' ? 'Playful' : 'Deep'}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={generateAiVoiceover}
                  disabled={isGeneratingTts}
                  className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
                >
                  {isGeneratingTts ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-black" /> Generating Speech...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-black" /> Generate & Sync Voiceover
                    </>
                  )}
                </button>
              </div>

              {voiceoverAudioUrl && (
                <div className="p-3 bg-neutral-950 rounded-xl border border-cyan-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs text-white font-semibold">Voiceover Active ({selectedVoice})</span>
                  </div>
                  <button
                    onClick={() => setVoiceoverAudioUrl(null)}
                    className="text-[11px] text-neutral-400 hover:text-rose-400"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Visual Filters & Speed */}
          {activeTab === 'filters' && (
            <div className="space-y-4">
              <div>
                <span className="text-neutral-400 text-xs font-semibold uppercase tracking-wider block mb-2.5">
                  Visual FX Filter
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'Saturated magenta & cyan' },
                    { id: 'sunset', name: 'Golden Sunset', desc: 'Warm golden hour glow' },
                    { id: 'vhs', name: 'Retro VHS', desc: 'Vintage warm tape' },
                    { id: 'noir', name: 'Cinematic B&W', desc: 'High contrast monochrome' },
                    { id: 'vivid', name: 'Hyper Vivid', desc: 'Punchy saturated colors' },
                    { id: 'none', name: 'Original Clean', desc: 'No filter modification' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFilter(f.id as VideoFilter)}
                      className={`p-3 rounded-xl border text-left transition ${
                        selectedFilter === f.id
                          ? 'bg-purple-950/80 border-purple-500 text-white shadow-md'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">{f.name}</span>
                      <span className="text-[10px] text-neutral-400">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Multiplier */}
              <div>
                <span className="text-neutral-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                  Playback Speed
                </span>
                <div className="flex gap-2">
                  {[0.5, 1.0, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSpeed(s)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        selectedSpeed === s
                          ? 'bg-white text-black border-white'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Stickers & Viral Badges */}
          {activeTab === 'stickers' && (
            <div className="space-y-4">
              <span className="text-neutral-400 text-xs font-semibold uppercase tracking-wider block">
                Viral Overlay Badges
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'WAIT FOR IT 👀',
                  'PART 1 🚨',
                  'TRENDING 🔥',
                  'MIND BLOWN 🤯',
                  'POV MOMENT ✨',
                  'SECRET HACK 💡',
                ].map((stk) => (
                  <button
                    key={stk}
                    onClick={() => setActiveSticker(activeSticker === stk ? '' : stk)}
                    className={`p-3 rounded-xl border text-xs font-bold transition ${
                      activeSticker === stk
                        ? 'bg-amber-400 text-black border-amber-300 shadow-md'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Post Details (Description & Tags) */}
          <div className="pt-2 border-t border-neutral-800/80 space-y-3">
            <div>
              <label className="text-neutral-400 text-[11px] font-semibold uppercase block mb-1">
                Post Caption
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="text-neutral-400 text-[11px] font-semibold uppercase block mb-1">
                Hashtags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer: Publish Now */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePublishVideo}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 transition active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Publish to Feed Now
          </button>
        </div>
      </div>
    </div>
  );
};
