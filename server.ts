import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI on server
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ==========================================
// In-Memory Live Watch Party Rooms (Real-time)
// ==========================================
interface RoomReaction {
  id: string;
  emoji: string;
  sender: string;
  timestamp: number;
}

interface RoomMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

interface RoomState {
  roomId: string;
  videoId: string;
  host: string;
  title: string;
  isPlaying: boolean;
  currentTime: number;
  updatedAt: number;
  viewers: { id: string; name: string; avatar: string }[];
  reactions: RoomReaction[];
  messages: RoomMessage[];
}

const rooms = new Map<string, RoomState>();

// Helper to seed or get room
function getOrCreateRoom(roomId: string, videoId = 'video-1', host = 'Alex_Creator', title = 'Viral Party'): RoomState {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      roomId,
      videoId,
      host,
      title,
      isPlaying: true,
      currentTime: 0,
      updatedAt: Date.now(),
      viewers: [
        { id: 'v1', name: 'Maya_Vibes', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
        { id: 'v2', name: 'Kai_Tech', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
        { id: 'v3', name: 'Elena_Style', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      ],
      reactions: [
        { id: 'r1', emoji: '🔥', sender: 'Maya_Vibes', timestamp: Date.now() - 5000 },
        { id: 'r2', emoji: '🤯', sender: 'Kai_Tech', timestamp: Date.now() - 2000 },
      ],
      messages: [
        { id: 'm1', user: 'Maya_Vibes', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', text: 'This edit is INSANE!! 🔥', time: 'Just now' },
        { id: 'm2', user: 'Kai_Tech', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', text: 'Wait for that sound transition 👀', time: 'Just now' },
      ],
    });
  }
  return rooms.get(roomId)!;
}

// Pre-seed a default room
getOrCreateRoom('fyp-live-party');

// Room endpoints
app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = getOrCreateRoom(roomId);
  res.json(room);
});

app.post('/api/rooms/:roomId/join', (req, res) => {
  const { roomId } = req.params;
  const { name, avatar } = req.body;
  const room = getOrCreateRoom(roomId);
  const existing = room.viewers.find((v) => v.name === name);
  if (!existing && name) {
    room.viewers.push({
      id: `v-${Date.now()}`,
      name: name || 'Guest',
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    });
  }
  res.json(room);
});

app.post('/api/rooms/:roomId/sync', (req, res) => {
  const { roomId } = req.params;
  const { isPlaying, currentTime, videoId } = req.body;
  const room = getOrCreateRoom(roomId);
  if (typeof isPlaying === 'boolean') room.isPlaying = isPlaying;
  if (typeof currentTime === 'number') room.currentTime = currentTime;
  if (videoId) room.videoId = videoId;
  room.updatedAt = Date.now();
  res.json({ success: true, room });
});

app.post('/api/rooms/:roomId/reaction', (req, res) => {
  const { roomId } = req.params;
  const { emoji, sender } = req.body;
  const room = getOrCreateRoom(roomId);
  const reaction: RoomReaction = {
    id: `r-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    emoji: emoji || '❤️',
    sender: sender || 'Viewer',
    timestamp: Date.now(),
  };
  room.reactions.push(reaction);
  if (room.reactions.length > 30) room.reactions.shift();
  res.json(reaction);
});

app.post('/api/rooms/:roomId/message', (req, res) => {
  const { roomId } = req.params;
  const { user, avatar, text } = req.body;
  const room = getOrCreateRoom(roomId);
  const msg: RoomMessage = {
    id: `m-${Date.now()}`,
    user: user || 'Anonymous',
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    text: text || '',
    time: 'Just now',
  };
  room.messages.push(msg);
  if (room.messages.length > 50) room.messages.shift();
  res.json(msg);
});

// ==========================================
// AI-Powered Video Editing Endpoints (Gemini)
// ==========================================

// 1. AI Viral Hooks & Scripts Generator
app.post('/api/ai/viral-hooks', async (req, res) => {
  try {
    const { topic, niche, videoDuration } = req.body;
    if (!ai) {
      // Graceful fallback if API key is not yet set
      return res.json({
        hooks: [
          { hook: `Stop scrolling! If you care about ${topic || 'this'}, you need to hear this right now.`, retentionScore: 96, style: 'Curiosity Gap' },
          { hook: `I spent 30 days testing ${topic || 'this trend'} so you don't have to... here's what happened.`, retentionScore: 94, style: 'Proof & Story' },
          { hook: `99% of people are doing ${topic || 'this'} completely wrong. Here is the secret fix.`, retentionScore: 98, style: 'Contrarian Challenge' },
        ],
        hashtags: [`#${(topic || 'viral').replace(/\s+/g, '')}`, '#fyp', '#viralhacks', '#trending', '#mustwatch'],
        caption: `You won't believe what happens at second 7! Save this before it gets taken down. 👇✨`,
      });
    }

    const prompt = `You are a world-class viral short-form video strategist (TikTok/Reels/Shorts).
Generate 3 ultra-viral opening hook lines, trending hashtags, and an engaging caption for a ${videoDuration || '15-30s'} video about:
"${topic || 'a shocking everyday discovery'}" in the niche: "${niche || 'lifestyle/entertainment'}".

Return strictly valid JSON in this exact structure:
{
  "hooks": [
    { "hook": "...", "retentionScore": 95, "style": "Curiosity Gap / Contrarian / Bold Claim" },
    { "hook": "...", "retentionScore": 92, "style": "..." },
    { "hook": "...", "retentionScore": 97, "style": "..." }
  ],
  "hashtags": ["#fyp", "#...", "#..."],
  "caption": "Short punchy TikTok caption with emojis and call to action"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini hook generation spike, serving resilient fallback:', error.message);
    const topic = req.body.topic || 'this viral secret';
    res.json({
      hooks: [
        { hook: `Stop scrolling! If you care about ${topic}, you need to hear this right now.`, retentionScore: 97, style: 'Curiosity Gap' },
        { hook: `I spent 30 days testing ${topic} so you don't have to... here is what happened.`, retentionScore: 94, style: 'Story Proof' },
        { hook: `99% of people are doing ${topic} completely wrong. Here is the secret fix.`, retentionScore: 98, style: 'Contrarian Challenge' },
      ],
      hashtags: [`#${topic.replace(/[^a-zA-Z0-9]/g, '') || 'viral'}`, '#fyp', '#viralhacks', '#trending', '#mustwatch'],
      caption: `You won't believe what happens at second 7! Save this before it gets taken down. 👇✨`,
    });
  }
});

// 2. AI Auto-Captions with Kinetic Typography Timings
app.post('/api/ai/auto-captions', async (req, res) => {
  try {
    const { speechText, style } = req.body;
    const textToProcess = speechText || 'Nobody expected this edit to go viral overnight. Watch closely!';

    if (!ai) {
      // Fallback timed captions
      const words = textToProcess.split(' ');
      const timed = [];
      let t = 0.3;
      for (let i = 0; i < words.length; i += 2) {
        const chunk = words.slice(i, i + 2).join(' ');
        timed.push({
          start: Number(t.toFixed(1)),
          end: Number((t + 1.2).toFixed(1)),
          text: chunk,
          highlight: words[i],
          emoji: i === 0 ? '👀' : i === words.length - 2 ? '🔥' : '',
        });
        t += 1.3;
      }
      return res.json({ captions: timed, style: style || 'tiktok-karaoke' });
    }

    const prompt = `You are an AI video editor that generates synchronized animated TikTok/Reels captions.
Generate a word/phrase breakdown with timestamps for this script:
"${textToProcess}"

For each subtitle segment (1-3 words max for rapid kinetic reading), output:
- start (in seconds, e.g. 0.2)
- end (in seconds, e.g. 1.0)
- text (the short phrase uppercase)
- highlight (one high-impact punch word inside the phrase)
- emoji (optional context emoji like ⚡, 🤯, 🚀, or empty string)

Return strictly valid JSON format:
{
  "captions": [
    { "start": 0.2, "end": 0.9, "text": "WAIT TILL", "highlight": "WAIT", "emoji": "👀" },
    { "start": 0.9, "end": 1.7, "text": "THE END", "highlight": "END", "emoji": "🔥" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini caption generation spike, serving resilient fallback:', error.message);
    const words = (req.body.speechText || 'Watch till the end for the results').split(' ');
    const timed = [];
    let t = 0.2;
    for (let i = 0; i < words.length; i += 2) {
      const chunk = words.slice(i, i + 2).join(' ');
      timed.push({
        start: Number(t.toFixed(1)),
        end: Number((t + 1.2).toFixed(1)),
        text: chunk.toUpperCase(),
        highlight: words[i].toUpperCase(),
        emoji: i === 0 ? '👀' : i >= words.length - 2 ? '🔥' : '✨',
      });
      t += 1.2;
    }
    res.json({ captions: timed, style: req.body.style || 'yellow_neon' });
  }
});

// 3. AI Text-to-Speech Voiceover (Gemini 3.8 Flash Lite TTS)
app.post('/api/ai/voiceover', async (req, res) => {
  try {
    const { text, voice, styleNote } = req.body;
    const voiceText = text || 'Welcome to the future of short video creation on TikPulse.';
    const selectedVoice = voice || 'Kore'; // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'

    if (!ai) {
      return res.status(400).json({
        error: 'Gemini API Key is not configured on the server.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: voiceText,
              speechMetadata: {
                style: styleNote || 'Fast, hyper-engaging viral TikTok creator narration',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: selectedVoice,
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio data generated' });
    }

    res.json({
      audioUrl: `data:audio/wav;base64,${base64Audio}`,
      voice: selectedVoice,
    });
  } catch (error: any) {
    console.error('Error in voiceover generation:', error);
    res.status(500).json({
      error: 'TTS generation failed',
      details: error.message,
    });
  }
});

// 4. AI Creator Smart Comment Reply Generator
app.post('/api/ai/smart-reply', async (req, res) => {
  try {
    const { comment, videoContext } = req.body;
    if (!ai) {
      return res.json({
        replies: [
          'Hahaha thanks so much! Part 2 dropping tomorrow! 🔥',
          'Good catch! Wait till you try this yourself 🚀',
          'Pinned this comment for the vibes! 📌❤️',
        ],
      });
    }

    const prompt = `As a charismatic, viral TikTok creator with 1M followers, suggest 3 funny, punchy, or appreciative replies to this user comment:
Comment: "${comment || 'Where did you get that filter?'}"
Video context: "${videoContext || 'Tech & AI video editing tips'}"

Return strictly valid JSON:
{
  "replies": ["reply 1 with emoji", "reply 2 with emoji", "reply 3 with emoji"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating smart reply:', error);
    res.status(500).json({ error: 'Failed to generate replies', details: error.message });
  }
});

// 5. AI Video Remix & Hashtag Optimizer
app.post('/api/ai/remix-ideas', async (req, res) => {
  try {
    const { videoTitle, audioName } = req.body;
    if (!ai) {
      return res.json({
        ideas: [
          'Duet Challenge: React to the plot twist with dramatic slow-mo',
          'POV Transition: Show the before & after using beat drops',
          'Tutorial Breakdown: Reveal the exact 3-step prompt formula',
        ],
        trendingSounds: ['Phonk Drift 2026', 'Lo-Fi Chill Hop Beats', 'Cyber Bass Drop'],
      });
    }

    const prompt = `Give 3 viral duet/remix concepts and sound styling ideas for this video:
Title: "${videoTitle || 'Cyber City Vibes'}"
Sound: "${audioName || 'Original Audio - DJ Neon'}"

Return JSON:
{
  "ideas": ["Idea 1", "Idea 2", "Idea 3"],
  "trendingSounds": ["Sound 1", "Sound 2", "Sound 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating remix ideas:', error);
    res.status(500).json({ error: 'Failed to generate remix ideas', details: error.message });
  }
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TikPulse server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
