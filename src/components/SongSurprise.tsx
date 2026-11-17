import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ExternalLink,
  Heart,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Upload,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ROMANTIC_TRACKS, SongPlayerEngine } from '../utils/sound';

interface SongSurpriseProps {
  onNext: () => void;
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  loadVideoById: (videoId: string) => void;
  setVolume: (vol: number) => void;
  mute: () => void;
  unMute: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        options: {
          width?: string | number;
          height?: string | number;
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: {
              data: number;
              target: YTPlayerInstance;
            }) => void;
            onError?: () => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState?: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeIframeAPI(timeoutMs = 8000): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.YT && window.YT.Player) return Promise.resolve();

  return new Promise((resolve, reject) => {
    let settled = false;
    let pollId: number | null = null;
    const finish = (err?: Error) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      if (pollId !== null) window.clearInterval(pollId);
      if (err) reject(err);
      else resolve();
    };
    // Blocked network / ad-blocker / offline: never hang forever
    const timeoutId = window.setTimeout(
      () => finish(new Error('YouTube API timed out')),
      timeoutMs
    );

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevReady) prevReady();
      finish();
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    );
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      tag.onerror = () => {
        tag.remove(); // allow a clean retry next time
        finish(new Error('YouTube API failed to load'));
      };
      document.body.appendChild(tag);
    } else {
      pollId = window.setInterval(() => {
        if (window.YT && window.YT.Player) finish();
      }, 100);
    }
  });
}

function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, '0')}`;
}

export function SongSurprise({ onNext }: SongSurpriseProps) {
  const engineRef = useRef<SongPlayerEngine | null>(null);
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<YTPlayerInstance | null>(null);
  const ytReadyRef = useRef(false);

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [durationSec, setDurationSec] = useState(ROMANTIC_TRACKS[0].durationSec);
  const [ytFailedIds, setYtFailedIds] = useState<Record<string, boolean>>({});
  const [liked, setLiked] = useState(true);
  const [muted, setMuted] = useState(false);
  const [customTracks, setCustomTracks] = useState<Record<string, boolean>>({});
  const [ytApiFailed, setYtApiFailed] = useState(false);

  const currentTrack = ROMANTIC_TRACKS[trackIndex];
  const isUsingYouTube =
    Boolean(currentTrack.youtubeId) &&
    !ytApiFailed &&
    !customTracks[currentTrack.id] &&
    !ytFailedIds[currentTrack.id];

  // Keep refs synced for callbacks inside YT events
  const trackIndexRef = useRef(trackIndex);
  trackIndexRef.current = trackIndex;
  const isUsingYouTubeRef = useRef(isUsingYouTube);
  isUsingYouTubeRef.current = isUsingYouTube;

  const selectTrack = useCallback(
    (nextIndex: number, autoPlay = true) => {
      const normalized =
        ((nextIndex % ROMANTIC_TRACKS.length) + ROMANTIC_TRACKS.length) %
        ROMANTIC_TRACKS.length;
      const nextTrack = ROMANTIC_TRACKS[normalized];
      const willUseYouTube =
        Boolean(nextTrack.youtubeId) &&
        !ytApiFailed &&
        !customTracks[nextTrack.id] &&
        !ytFailedIds[nextTrack.id];

      // Update the source flag first: the engine's state callback is gated on it,
      // and a stale value drops updates or overwrites the track index we set below.
      isUsingYouTubeRef.current = willUseYouTube;

      setTrackIndex(normalized);
      setCurrentSec(0);
      setDurationSec(nextTrack.durationSec);

      if (willUseYouTube && nextTrack.youtubeId) {
        engineRef.current?.pause();
        if (ytPlayerRef.current && ytReadyRef.current) {
          ytPlayerRef.current.loadVideoById(nextTrack.youtubeId);
          if (!autoPlay) {
            ytPlayerRef.current.pauseVideo();
          }
        }
      } else {
        if (ytPlayerRef.current && ytReadyRef.current) {
          ytPlayerRef.current.pauseVideo();
        }
        engineRef.current?.setTrack(normalized, autoPlay);
      }
    },
    [customTracks, ytFailedIds, ytApiFailed]
  );

  const selectTrackRef = useRef(selectTrack);
  selectTrackRef.current = selectTrack;

  // Initialize fallback Web Audio / local MP3 engine
  useEffect(() => {
    const engine = new SongPlayerEngine((state) => {
      if (!isUsingYouTubeRef.current) {
        setTrackIndex(state.trackIndex);
        setIsPlaying(state.isPlaying);
        setCurrentSec(state.currentSec);
        setDurationSec(state.durationSec);
      }
    });
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Initialize YouTube IFrame Player
  useEffect(() => {
    let cancelled = false;
    let pollId: number | null = null;

    loadYouTubeIframeAPI()
      .catch(() => {
        if (cancelled) return;
        // YouTube unreachable: switch to the built-in melody so play/pause still work
        isUsingYouTubeRef.current = false;
        setYtApiFailed(true);
        engineRef.current?.setTrack(trackIndexRef.current, false);
        return 'failed' as const;
      })
      .then((result) => {
      if (result === 'failed') return;
      if (cancelled || !ytContainerRef.current || !window.YT?.Player) return;

      // Mount inside a dedicated child node so React never loses ref reconciliation
      ytContainerRef.current.innerHTML = '';
      const mountNode = document.createElement('div');
      mountNode.style.width = '100%';
      mountNode.style.height = '100%';
      ytContainerRef.current.appendChild(mountNode);

      const initialVideoId = ROMANTIC_TRACKS[trackIndexRef.current].youtubeId || '';
      ytPlayerRef.current = new window.YT.Player(mountNode, {
        width: '100%',
        height: '100%',
        videoId: initialVideoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (e) => {
            if (cancelled) return;
            ytReadyRef.current = true;
            e.target.setVolume(72);
            const dur = e.target.getDuration();
            if (dur > 0) setDurationSec(dur);
            if (isUsingYouTubeRef.current) {
              e.target.playVideo();
            }
          },
          onStateChange: (e) => {
            if (cancelled || !isUsingYouTubeRef.current) return;
            const YTState = window.YT?.PlayerState;
            if (e.data === (YTState?.PLAYING ?? 1)) {
              setIsPlaying(true);
              const dur = e.target.getDuration();
              if (dur > 0) setDurationSec(dur);
            } else if (e.data === (YTState?.PAUSED ?? 2)) {
              setIsPlaying(false);
            } else if (e.data === (YTState?.ENDED ?? 0)) {
              selectTrackRef.current(trackIndexRef.current + 1, true);
            }
          },
          onError: () => {
            if (cancelled) return;
            const failedTrack = ROMANTIC_TRACKS[trackIndexRef.current];
            setYtFailedIds((prev) => ({ ...prev, [failedTrack.id]: true }));
            isUsingYouTubeRef.current = false;
            engineRef.current?.setTrack(trackIndexRef.current, true);
          },
        },
      });

      pollId = window.setInterval(() => {
        if (
          ytPlayerRef.current &&
          ytReadyRef.current &&
          isUsingYouTubeRef.current
        ) {
          const cur = ytPlayerRef.current.getCurrentTime?.() || 0;
          const dur = ytPlayerRef.current.getDuration?.() || 0;
          setCurrentSec(cur);
          if (dur > 0) setDurationSec(dur);
        }
      }, 400);
    });

    return () => {
      cancelled = true;
      if (pollId !== null) clearInterval(pollId);
      ytReadyRef.current = false;
      try {
        ytPlayerRef.current?.destroy();
      } catch {
        // Ignore cleanup errors
      }
      ytPlayerRef.current = null;
    };
  }, []);

  const handleTogglePlay = () => {
    if (isUsingYouTube) {
      if (!ytPlayerRef.current || !ytReadyRef.current) return; // player still loading
      if (isPlaying) {
        ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      }
    } else {
      engineRef.current?.togglePlay();
    }
  };

  const handleSeek = (sec: number) => {
    setCurrentSec(sec);
    if (isUsingYouTube) {
      if (ytPlayerRef.current && ytReadyRef.current) {
        ytPlayerRef.current.seekTo(sec, true);
      }
    } else {
      engineRef.current?.seek(sec);
    }
  };

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (ytPlayerRef.current && ytReadyRef.current) {
      if (nextMuted) {
        ytPlayerRef.current.mute();
      } else {
        ytPlayerRef.current.unMute();
      }
    }
    engineRef.current?.setVolume(nextMuted ? 0 : 0.72);
  };

  const progressPct =
    durationSec > 0 ? Math.min(100, (currentSec / durationSec) * 100) : 0;

  return (
    <div className="bg-blush-studio relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Decorative Musical Staves & Notes */}
      <svg
        viewBox="0 0 360 180"
        fill="none"
        className="pointer-events-none absolute top-10 right-0 w-[260px] opacity-40 sm:w-[360px]"
        aria-hidden="true"
      >
        <path
          d="M20 70 Q130 20, 240 65 T360 45"
          stroke="#4B3434"
          strokeWidth="1.5"
        />
        <path
          d="M20 82 Q130 32, 240 77 T360 57"
          stroke="#4B3434"
          strokeWidth="1.5"
        />
        <path
          d="M20 94 Q130 44, 240 89 T360 69"
          stroke="#4B3434"
          strokeWidth="1.5"
        />
        <circle cx="145" cy="56" r="7" fill="#4B3434" />
        <path d="M151 56 L151 24 L172 18 L172 48" stroke="#4B3434" strokeWidth="2.5" />
        <circle cx="166" cy="49" r="7" fill="#4B3434" />
        <circle cx="255" cy="70" r="6.5" fill="#4B3434" />
        <path d="M261 70 L261 36 Q274 42, 272 52" stroke="#4B3434" strokeWidth="2.5" />
      </svg>

      <svg
        viewBox="0 0 360 180"
        fill="none"
        className="pointer-events-none absolute bottom-4 left-0 w-[240px] opacity-35 sm:w-[340px]"
        aria-hidden="true"
      >
        <path
          d="M0 110 Q100 60, 200 105 T350 80"
          stroke="#4B3434"
          strokeWidth="1.5"
        />
        <path
          d="M0 122 Q100 72, 200 117 T350 92"
          stroke="#4B3434"
          strokeWidth="1.5"
        />
        <path
          d="M0 134 Q100 84, 200 129 T350 104"
          stroke="#4B3434"
          strokeWidth="1.5"
        />
        <circle cx="112" cy="108" r="7" fill="#4B3434" />
        <path d="M118 108 L118 74 L140 68 L140 98" stroke="#4B3434" strokeWidth="2.5" />
        <circle cx="134" cy="99" r="7" fill="#4B3434" />
        <circle cx="220" cy="106" r="6.5" fill="#4B3434" />
        <path d="M226 106 L226 74 Q238 80, 236 90" stroke="#4B3434" strokeWidth="2.5" />
      </svg>

      {/* Top Centered Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 text-center"
      >
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#3E272B] sm:text-5xl">
          A Song Just For You
        </h1>
        <p className="font-display mt-2 text-base italic text-[#8D6872] sm:text-xl">
          Songs that somehow sound like us
        </p>
      </motion.div>

      {/* Main Layout: Floating Dark Player Card (Left) + Spinning Vinyl (Center) */}
      <div className="relative z-10 mt-8 flex w-full max-w-[960px] flex-col-reverse items-center justify-center gap-8 lg:mt-10 lg:flex-row lg:gap-14">
        {/* Dark Floating Player Card */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="w-full max-w-[290px] rounded-2xl bg-[#1D191C] p-4 text-white shadow-[0_16px_38px_rgba(40,18,28,0.28)]"
        >
          {/* YouTube Video Box (kept visible >=200px wide for reliable YT playback) */}
          <div
            className={`relative mb-3 overflow-hidden rounded-xl bg-black ${
              isUsingYouTube ? 'block aspect-video w-full' : 'hidden'
            }`}
          >
            <div ref={ytContainerRef} className="h-full w-full" />
          </div>

          {ytFailedIds[currentTrack.id] && currentTrack.youtubeId && !customTracks[currentTrack.id] && (
            <div className="mb-3 rounded-xl bg-white/10 px-3 py-2 text-[11px] text-[#F9C6D8]">
              YouTube embed restricted by uploader — playing fallback melody.{' '}
              <a
                href={`https://youtu.be/${currentTrack.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline"
              >
                Open on YouTube ↗
              </a>
            </div>
          )}

          {/* Album & Track Info */}
          <div className="flex items-center gap-3">
            {!isUsingYouTube && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F48FB1] to-[#C85A7B] shadow-inner">
                <span className="text-base text-white">♫</span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-white">
                {currentTrack.title}
              </div>
              <div className="truncate text-xs text-[#C7B3BC]">
                {currentTrack.artist}
              </div>
            </div>

            {currentTrack.youtubeId && (
              <a
                href={`https://youtu.be/${currentTrack.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Open on YouTube"
                aria-label="Open track on YouTube"
                className="rounded-lg bg-white/10 p-1.5 text-[#E8DCE2] transition-colors hover:bg-white/20 hover:text-white"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setLiked((l) => !l)}
              aria-label={liked ? 'Remove favorite' : 'Favorite song'}
              className="cursor-pointer rounded-full p-1.5 text-[#F48FB1] transition-transform hover:scale-110"
            >
              <Heart
                className="h-4 w-4"
                fill={liked ? '#F48FB1' : 'none'}
              />
            </button>
          </div>

          {/* Interactive Scrubber */}
          <div className="mt-3.5">
            <input
              type="range"
              min={0}
              max={durationSec}
              step={0.5}
              value={currentSec}
              aria-label="Seek song position"
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-[#F48FB1]"
              style={{
                background: `linear-gradient(to right, #F48FB1 ${progressPct}%, rgba(255,255,255,0.2) ${progressPct}%)`,
              }}
            />
            <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-[#B9A4AE] tabular-nums">
              <span>{formatTime(currentSec)}</span>
              <span>{formatTime(durationSec)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="mt-2.5 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute audio' : 'Mute audio'}
              className="cursor-pointer rounded-full p-1.5 text-[#C7B3BC] transition-colors hover:text-white"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => selectTrack(trackIndex - 1, true)}
                aria-label="Previous track"
                className="cursor-pointer rounded-full p-1.5 text-[#E8DCE2] transition-transform hover:scale-110 hover:text-white"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pause song' : 'Play song'}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-[#1D191C] shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                )}
              </button>

              <button
                type="button"
                onClick={() => selectTrack(trackIndex + 1, true)}
                aria-label="Next track"
                className="cursor-pointer rounded-full p-1.5 text-[#E8DCE2] transition-transform hover:scale-110 hover:text-white"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <span className="w-7 text-right text-[10px] font-bold text-[#9C8691] tabular-nums">
              {trackIndex + 1}/{ROMANTIC_TRACKS.length}
            </span>
          </div>

          {/* Compact Track Selector */}
          <div className="mt-3.5 max-h-36 space-y-1 overflow-y-auto border-t border-white/10 pt-3 pr-0.5">
            {ROMANTIC_TRACKS.map((t, idx) => {
              const active = idx === trackIndex;
              return (
                <div
                  key={t.id}
                  className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors ${
                    active
                      ? 'bg-[#F48FB1]/20 font-bold text-[#F9C6D8]'
                      : 'text-[#C7B3BC] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectTrack(idx, true)}
                    className="min-w-0 flex-1 cursor-pointer truncate text-left"
                  >
                    {idx + 1}. {t.title}
                    {t.artist === 'TEPPISETH' ? ' — TEPPISETH' : ''}
                  </button>
                  <label
                    title={`Attach local audio file for ${t.title}`}
                    className="ml-2 shrink-0 cursor-pointer rounded p-1 text-[#B9A4AE] transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Upload className="h-3 w-3" />
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = ''; // allow re-selecting the same file
                        if (file) {
                          const url = URL.createObjectURL(file);
                          isUsingYouTubeRef.current = false;
                          setCustomTracks((prev) => ({ ...prev, [t.id]: true }));
                          if (ytPlayerRef.current && ytReadyRef.current) {
                            ytPlayerRef.current.pauseVideo();
                          }
                          engineRef.current?.setCustomAudio(t.id, url);
                          setTrackIndex(idx);
                          engineRef.current?.setTrack(idx, true);
                        }
                      }}
                    />
                  </label>
                  <span className="ml-1.5 shrink-0 text-[10px] opacity-80 tabular-nums">
                    {customTracks[t.id]
                      ? 'MP3'
                      : t.youtubeId && !ytFailedIds[t.id]
                      ? 'YT'
                      : formatTime(t.durationSec)}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Center Spinning Vinyl Disc */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative flex items-center justify-center"
        >
          {/* Clickable Vinyl Record */}
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause vinyl record' : 'Play vinyl record'}
            className="group relative cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C85A7B]"
          >
            <div
              className={`animate-vinyl-spin relative flex h-[250px] w-[250px] items-center justify-center rounded-full bg-[#151315] shadow-[0_22px_50px_rgba(45,18,28,0.3)] sm:h-[310px] sm:w-[310px] ${
                isPlaying ? '' : 'vinyl-paused'
              }`}
            >
              {/* Vinyl Grooves */}
              <div className="absolute inset-3 rounded-full border border-white/10" />
              <div className="absolute inset-7 rounded-full border border-white/10" />
              <div className="absolute inset-11 rounded-full border border-white/10" />
              <div className="absolute inset-16 rounded-full border border-white/10" />
              <div className="absolute inset-20 rounded-full border border-white/10" />

              {/* Glossy Vinyl Light Sheen */}
              <div
                className="pointer-events-none absolute inset-0 rounded-full opacity-25"
                style={{
                  background:
                    'conic-gradient(from 40deg, transparent 0deg, rgba(255,255,255,0.45) 28deg, transparent 62deg, transparent 180deg, rgba(255,255,255,0.35) 210deg, transparent 245deg)',
                }}
              />

              {/* Soft Pink Center Label */}
              <div className="relative flex h-[96px] w-[96px] flex-col items-center justify-center rounded-full border-2 border-[#E69AB4] bg-gradient-to-br from-[#FCE0EB] to-[#F3A8C1] text-center shadow-inner sm:h-[112px] sm:w-[112px]">
                <span className="text-[9px] font-bold tracking-widest text-[#7A354E] uppercase">
                  Side A
                </span>
                <span className="font-display mt-0.5 max-w-[78px] truncate text-xs font-bold text-[#4B2732]">
                  {currentTrack.title}
                </span>
                <span className="mt-0.5 text-[10px] text-[#7A354E]">♡</span>
                {/* Spindle Hole */}
                <div className="mt-1 h-3 w-3 rounded-full border border-[#4B3434]/40 bg-[#FFF8FB]" />
              </div>
            </div>
          </button>

          {/* Animated Tonearm */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -top-2 -right-4 origin-top-right transition-transform duration-500 sm:-right-7 ${
              isPlaying ? 'rotate-[22deg]' : 'rotate-0'
            }`}
          >
            <div className="flex flex-col items-end">
              <div className="h-9 w-9 rounded-full border-2 border-[#4B3434] bg-[#EED6DF] shadow-md" />
              <div className="-mt-4 mr-3.5 h-32 w-2 rounded-full bg-gradient-to-b from-[#B49BA3] to-[#6E565E] shadow-sm sm:h-40" />
              <div className="-mt-1 mr-2.5 h-5 w-3.5 rotate-12 rounded-sm bg-[#4B3434]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom-Right Next Button */}
      <button
        type="button"
        onClick={onNext}
        className="fixed right-6 bottom-6 z-20 cursor-pointer rounded-xl border-2 border-[#4B3434] bg-[#FFFDF7] px-5 py-2 text-sm font-bold text-[#4B3434] shadow-[0_4px_0_#4B3434] transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        Next →
      </button>
    </div>
  );
}
