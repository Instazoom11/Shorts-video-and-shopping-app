// Web Audio API interactive background music generator for Hipi Shorts
// Plays clean, pleasant lofi & melodic ambient loops matching each video's vibe
// Zero external mp3 dependencies - works 100% reliably in all browsers

class HipiAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private currentGenre: string = 'Chillhop';

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTrack(genre: string) {
    this.currentGenre = genre;
    this.initCtx();
    this.stop();
    this.isPlaying = true;

    // Schedule periodic rhythmic synth pattern
    let step = 0;
    const intervalMs = genre === 'Synthwave' ? 240 : genre === 'Electro Folk' ? 280 : 320;

    const playStep = () => {
      if (!this.isPlaying || !this.ctx) return;
      this.triggerStepSound(this.currentGenre, step);
      step = (step + 1) % 16;
      this.timerId = window.setTimeout(playStep, intervalMs);
    };

    playStep();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(genre: string): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.playTrack(genre);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private triggerStepSound(genre: string, step: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Kick on 0, 8 (or 0, 4, 8, 12 for dance)
    if (step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(genre === 'Synthwave' ? 140 : 120, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    }

    // 2. Soft Hi-Hat on 2, 6, 10, 14
    if (step % 2 === 1) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(genre === 'Electro Folk' ? 1600 : 2400, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }

    // 3. Melodic chord/arpeggio
    const chordPitches: Record<string, number[]> = {
      'Chillhop': [261.63, 329.63, 392.00, 493.88], // Cmaj7 notes
      'Electro Folk': [293.66, 349.23, 440.00, 523.25], // Dm7 notes
      'Synthwave': [220.00, 261.63, 329.63, 415.30], // Am / F notes
      'Ambient': [329.63, 392.00, 493.88, 587.33], // Em7 notes
      'Deep House': [261.63, 311.13, 392.00, 466.16], // Cm7
    };

    const notes = chordPitches[genre] || chordPitches['Chillhop'];
    if (step % 2 === 0) {
      const noteIndex = Math.floor(step / 2) % notes.length;
      const freq = notes[noteIndex];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = genre === 'Synthwave' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(genre === 'Synthwave' ? 0.05 : 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    }
  }
}

export const hipiAudio = new HipiAudioPlayer();
