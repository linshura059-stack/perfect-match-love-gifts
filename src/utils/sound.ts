// Synthesized Web Audio API sound effects & polyphonic romantic song engine

let sharedAudioCtx: AudioContext | null = null;
let globalSfxMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

export function setSfxMuted(muted: boolean) {
  globalSfxMuted = muted;
}

export function isSfxMuted(): boolean {
  return globalSfxMuted;
}

export function playFlipSound() {
  if (globalSfxMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(760, now + 0.08);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.09, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.12);
}

export function playMatchChime() {
  if (globalSfxMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [659.25, 830.61, 987.77]; // E5, G#5, B5
  notes.forEach((freq, idx) => {
    const start = ctx.currentTime + idx * 0.065;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.08, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.3);
  });
}

export function playVictoryFanfare() {
  if (globalSfxMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, idx) => {
    const start = ctx.currentTime + idx * 0.09;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.1, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.58);
  });
}

export function playGiftUnwrapSound() {
  if (globalSfxMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [587.33, 739.99, 880, 1174.66]; // D5 F#5 A5 D6
  notes.forEach((freq, idx) => {
    const start = ctx.currentTime + idx * 0.055;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.075, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.38);
  });
}

export interface TrackDefinition {
  id: string;
  title: string;
  artist: string;
  youtubeId?: string;
  durationSec: number;
  bpm: number;
  chords: number[][];
  melody: number[];
}

export const ROMANTIC_TRACKS: TrackDefinition[] = [
  {
    id: 'stay-with-me',
    title: 'Stay With Me',
    artist: 'Miki Matsubara',
    youtubeId: '-uyCMdjWK5Y',
    durationSec: 312,
    bpm: 92,
    chords: [
      [174.61, 220.0, 261.63, 329.63],
      [164.81, 207.65, 246.94, 293.66],
      [220.0, 261.63, 329.63, 392.0],
      [196.0, 233.08, 293.66, 349.23],
    ],
    melody: [
      659.25, 783.99, 880.0, 783.99,
      659.25, 587.33, 523.25, 587.33,
      659.25, 783.99, 880.0, 1046.5,
      880.0, 783.99, 659.25, 587.33,
    ],
  },
  {
    id: '4starlove',
    title: '4STARLOVE',
    artist: 'TEPPISETH',
    youtubeId: '5SPzRfWHxo0',
    durationSec: 180,
    bpm: 84,
    chords: [
      [164.81, 246.94, 293.66, 369.99],
      [130.81, 196.0, 246.94, 293.66],
      [110.0, 196.0, 246.94, 329.63],
      [123.47, 185.0, 220.0, 311.13],
    ],
    melody: [
      739.99, 659.25, 587.33, 493.88,
      587.33, 659.25, 739.99, 659.25,
      587.33, 523.25, 493.88, 523.25,
      587.33, 659.25, 587.33, 493.88,
    ],
  },
];

export class SongPlayerEngine {
  private trackIndex = 0;
  private isPlaying = false;
  private currentSec = 0;
  private volume = 0.72;
  private stepTimer: number | null = null;
  private tickTimer: number | null = null;
  private stepIndex = 0;
  private masterGain: GainNode | null = null;
  private customAudioUrls: Record<string, string> = {};
  private audioEl: HTMLAudioElement | null = null;
  private customDurationSec = 0;
  private onUpdate: (state: {
    trackIndex: number;
    isPlaying: boolean;
    currentSec: number;
    durationSec: number;
  }) => void;

  constructor(
    onUpdate: (state: {
      trackIndex: number;
      isPlaying: boolean;
      currentSec: number;
      durationSec: number;
    }) => void
  ) {
    this.onUpdate = onUpdate;
  }

  private activeCustomUrl(): string | undefined {
    const track = ROMANTIC_TRACKS[this.trackIndex];
    return this.customAudioUrls[track.id];
  }

  private getDurationSec(): number {
    if (this.activeCustomUrl() && this.customDurationSec > 0) {
      return this.customDurationSec;
    }
    return ROMANTIC_TRACKS[this.trackIndex].durationSec;
  }

  private emit() {
    this.onUpdate({
      trackIndex: this.trackIndex,
      isPlaying: this.isPlaying,
      currentSec: this.currentSec,
      durationSec: this.getDurationSec(),
    });
  }

  public setCustomAudio(trackId: string, url: string) {
    this.customAudioUrls[trackId] = url;
    const currentTrack = ROMANTIC_TRACKS[this.trackIndex];
    if (currentTrack.id === trackId) {
      this.setTrack(this.trackIndex, true);
    }
  }

  private cleanupAudioEl() {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.src = '';
      this.audioEl = null;
    }
    this.customDurationSec = 0;
  }

  private ensureMasterGain(ctx: AudioContext): GainNode {
    if (!this.masterGain || this.masterGain.context !== ctx) {
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, ctx.currentTime);
      this.masterGain.connect(ctx.destination);
    }
    return this.masterGain;
  }

  private scheduleStep() {
    if (!this.isPlaying || this.activeCustomUrl()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const track = ROMANTIC_TRACKS[this.trackIndex];
    const master = this.ensureMasterGain(ctx);
    const now = ctx.currentTime;
    const beatSec = 60 / track.bpm;

    if (this.stepIndex % 4 === 0) {
      const chordIdx = Math.floor(this.stepIndex / 4) % track.chords.length;
      const chord = track.chords[chordIdx];
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.0005, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + beatSec * 3.8);

        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + beatSec * 3.9);
      });
    }

    const melFreq = track.melody[this.stepIndex % track.melody.length];
    const melOsc = ctx.createOscillator();
    const melGain = ctx.createGain();
    melOsc.type = 'sine';
    melOsc.frequency.setValueAtTime(melFreq, now);

    melGain.gain.setValueAtTime(0.0008, now);
    melGain.gain.linearRampToValueAtTime(0.075, now + 0.025);
    melGain.gain.exponentialRampToValueAtTime(0.001, now + beatSec * 1.15);

    melOsc.connect(melGain);
    melGain.connect(master);
    melOsc.start(now);
    melOsc.stop(now + beatSec * 1.2);

    this.stepIndex += 1;
  }

  public play() {
    if (this.isPlaying) return;
    const customUrl = this.activeCustomUrl();

    if (customUrl) {
      if (!this.audioEl || this.audioEl.src !== customUrl) {
        this.cleanupAudioEl();
        const audio = new Audio(customUrl);
        audio.volume = this.volume;
        audio.currentTime = this.currentSec;
        audio.addEventListener('loadedmetadata', () => {
          if (Number.isFinite(audio.duration) && audio.duration > 0) {
            this.customDurationSec = audio.duration;
            this.emit();
          }
        });
        audio.addEventListener('timeupdate', () => {
          this.currentSec = audio.currentTime;
          this.emit();
        });
        audio.addEventListener('ended', () => {
          this.next(true);
        });
        this.audioEl = audio;
      }
      this.isPlaying = true;
      this.audioEl.play().catch(() => {});
      this.emit();
      return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    this.isPlaying = true;
    const track = ROMANTIC_TRACKS[this.trackIndex];
    const stepMs = (60 / track.bpm) * 1000;

    this.scheduleStep();
    this.stepTimer = window.setInterval(() => {
      this.scheduleStep();
    }, stepMs);

    this.tickTimer = window.setInterval(() => {
      this.currentSec += 0.25;
      if (this.currentSec >= track.durationSec) {
        this.next(true);
        return;
      }
      this.emit();
    }, 250);

    this.emit();
  }

  public pause() {
    this.isPlaying = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.stepTimer !== null) {
      clearInterval(this.stepTimer);
      this.stepTimer = null;
    }
    if (this.tickTimer !== null) {
      clearInterval(this.tickTimer);
      this.tickTimer = null;
    }
    this.emit();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public seek(sec: number) {
    const duration = this.getDurationSec();
    this.currentSec = Math.max(0, Math.min(sec, duration));
    if (this.audioEl) {
      this.audioEl.currentTime = this.currentSec;
    } else {
      const track = ROMANTIC_TRACKS[this.trackIndex];
      this.stepIndex = Math.floor(
        (this.currentSec / (60 / track.bpm)) % track.melody.length
      );
    }
    this.emit();
  }

  public setTrack(index: number, autoPlay = true) {
    const wasPlaying = this.isPlaying;
    this.pause();
    this.cleanupAudioEl();
    this.trackIndex =
      ((index % ROMANTIC_TRACKS.length) + ROMANTIC_TRACKS.length) %
      ROMANTIC_TRACKS.length;
    this.currentSec = 0;
    this.stepIndex = 0;
    this.emit();
    if (autoPlay || wasPlaying) {
      this.play();
    }
  }

  public next(autoPlay = true) {
    this.setTrack(this.trackIndex + 1, autoPlay);
  }

  public prev(autoPlay = true) {
    this.setTrack(this.trackIndex - 1, autoPlay);
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioEl) {
      this.audioEl.volume = this.volume;
    }
    const ctx = getAudioContext();
    if (ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume, ctx.currentTime, 0.04);
    }
  }

  public destroy() {
    this.pause();
    this.cleanupAudioEl();
  }
}
