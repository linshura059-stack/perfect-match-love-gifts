import React, { useState } from 'react';
import { KittyPeek, WashiTape } from './KawaiiArtwork';

interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  maxWidthClass?: string;
}

export function RetroWindow({
  title,
  children,
  onClose,
  maxWidthClass = 'max-w-[660px]',
}: RetroWindowProps) {
  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`relative w-full transition-all duration-300 ${
        expanded ? 'max-w-[820px]' : maxWidthClass
      }`}
    >
      {/* Cute Kitty Peeking Over Top-Left */}
      <div className="pointer-events-none absolute -top-[44px] left-5 z-20 w-[86px] sm:w-[96px]">
        <KittyPeek className="h-auto w-full drop-shadow-sm" />
      </div>

      {/* Cute Pink Striped Washi Tape Top-Right */}
      <div className="pointer-events-none absolute -top-3 -right-4 z-20 w-[72px] rotate-[24deg]">
        <WashiTape className="h-auto w-full drop-shadow-sm" />
      </div>

      {/* Window Shell */}
      <div className="relative z-10 overflow-hidden rounded-2xl border-2 border-[#4B3434] bg-[#FFFDF7] shadow-[0_14px_34px_rgba(92,50,60,0.16)]">
        {/* Sage Green Title Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#4B3434] bg-[#DCE6C2] px-4 py-2.5">
          <span className="pl-24 text-sm font-bold tracking-tight text-[#4B3434] sm:pl-28">
            {title}
          </span>

          {/* Functional Window Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMinimized((m) => !m)}
              aria-label={minimized ? 'Restore window' : 'Minimize window'}
              title={minimized ? 'Restore' : 'Minimize'}
              className="flex h-6 w-6 items-center justify-center rounded-md border-[1.5px] border-[#4B3434] bg-[#FFFDF7] text-xs font-bold text-[#4B3434] transition-transform hover:scale-105 active:scale-95"
            >
              —
            </button>
            <button
              type="button"
              onClick={() => {
                setMinimized(false);
                setExpanded((e) => !e);
              }}
              aria-label={expanded ? 'Restore window size' : 'Expand window'}
              title={expanded ? 'Restore size' : 'Expand'}
              className="flex h-6 w-6 items-center justify-center rounded-md border-[1.5px] border-[#4B3434] bg-[#FFFDF7] text-xs font-bold text-[#4B3434] transition-transform hover:scale-105 active:scale-95"
            >
              □
            </button>
            <button
              type="button"
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  setMinimized(false);
                }
              }}
              aria-label="Reset or close window"
              title="Reset"
              className="flex h-6 w-6 items-center justify-center rounded-md border-[1.5px] border-[#4B3434] bg-[#FAD2DF] text-xs font-bold text-[#4B3434] transition-transform hover:scale-105 active:scale-95"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        {minimized ? (
          <div className="flex items-center justify-between px-6 py-5 text-sm text-[#6E5353]">
            <span>Window tucked away ♡</span>
            <button
              type="button"
              onClick={() => setMinimized(false)}
              className="rounded-lg border-[1.5px] border-[#4B3434] bg-[#DCE6C2] px-3 py-1 text-xs font-bold text-[#4B3434] hover:bg-[#cfddaf]"
            >
              Open again
            </button>
          </div>
        ) : (
          <div className="px-5 py-5 sm:px-8 sm:py-6">{children}</div>
        )}
      </div>
    </div>
  );
}
