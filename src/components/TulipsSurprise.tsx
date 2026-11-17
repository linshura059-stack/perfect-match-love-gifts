import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CustomGiftContent } from '../data/defaultContent';
import { playFlipSound } from '../utils/sound';
import { RibbonBow, TulipBouquet } from './KawaiiArtwork';

interface TulipsSurpriseProps {
  content: CustomGiftContent;
  onNext: () => void;
}

export function TulipsSurprise({ content, onNext }: TulipsSurpriseProps) {
  const [poppedIndex, setPoppedIndex] = useState<number | null>(null);

  const leftNotes = content.tulipNotes.slice(0, 3);
  const rightNotes = content.tulipNotes.slice(3, 6);

  const handleNoteTap = (idx: number) => {
    playFlipSound();
    setPoppedIndex(idx);
    window.setTimeout(() => setPoppedIndex(null), 500);
  };

  return (
    <div className="bg-blush-studio relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Delicate Floral Lace Corner Accents */}
      <svg
        viewBox="0 0 180 180"
        fill="none"
        className="pointer-events-none absolute top-0 left-0 w-36 opacity-50 sm:w-48"
        aria-hidden="true"
      >
        <path
          d="M0 0 L150 0 C130 34, 96 42, 74 74 C42 96, 34 130, 0 150 Z"
          fill="#FFFFFF"
          fillOpacity="0.65"
        />
        <circle cx="42" cy="36" r="14" stroke="#E49BB0" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="84" cy="24" r="10" stroke="#E49BB0" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="24" cy="84" r="10" stroke="#E49BB0" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>

      {/* Bottom-Right Ribbon Bow */}
      <div className="pointer-events-none absolute right-2 bottom-2 w-28 opacity-90 sm:right-6 sm:bottom-4 sm:w-40">
        <RibbonBow className="h-auto w-full" />
      </div>

      {/* Top Row Header with Next -> button */}
      <div className="relative z-10 flex w-full max-w-[820px] items-center justify-center">
        <h1 className="font-display text-center text-3xl font-bold text-[#7A354E] sm:text-5xl">
          Your Favorite Tulips
        </h1>

        <button
          type="button"
          onClick={onNext}
          className="fixed right-6 bottom-6 z-20 cursor-pointer rounded-xl border-2 border-[#4B3434] bg-[#FFFDF7] px-5 py-2 text-sm font-bold text-[#4B3434] shadow-[0_4px_0_#4B3434] transition-all hover:-translate-y-0.5 active:translate-y-0 sm:static sm:ml-6"
        >
          Next →
        </button>
      </div>

      {/* Center Bouquet + 6 Floating Speech Bubbles */}
      <div className="relative z-10 mt-8 grid w-full max-w-[920px] grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-8">
        {/* Left 3 Speech Bubbles */}
        <div className="flex flex-col items-center gap-5 md:items-end">
          {leftNotes.map((note, idx) => (
            <motion.button
              key={idx}
              type="button"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * idx, duration: 0.3 }}
              onClick={() => handleNoteTap(idx)}
              className={`relative cursor-pointer rounded-2xl border-[1.5px] border-[#C99AA8] bg-[#FFFDF9]/95 px-5 py-3 text-center text-sm font-semibold italic text-[#5B3D46] shadow-sm transition-transform hover:scale-[1.03] sm:text-base ${
                idx === 1 ? 'md:-translate-x-5' : ''
              }`}
            >
              {note}
              {poppedIndex === idx && (
                <span className="ml-1.5 inline-block text-[#D85B88]">♡</span>
              )}
              {/* Speech Bubble Tail (Desktop) */}
              <span
                aria-hidden="true"
                className="hidden md:block absolute top-1/2 -right-2 h-3.5 w-3.5 -translate-y-1/2 rotate-45 border-t-[1.5px] border-r-[1.5px] border-[#C99AA8] bg-[#FFFDF9]"
              />
            </motion.button>
          ))}
        </div>

        {/* Center Scalloped Portrait Frame with Tulip Bouquet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="scallop-frame mx-auto flex h-[320px] w-[240px] items-center justify-center rounded-[28px] border-2 border-[#E49BB0] p-4 sm:h-[360px] sm:w-[270px]"
        >
          <TulipBouquet className="h-full w-full" />
        </motion.div>

        {/* Right 3 Speech Bubbles */}
        <div className="flex flex-col items-center gap-5 md:items-start">
          {rightNotes.map((note, idx) => {
            const noteIdx = idx + 3;
            return (
              <motion.button
                key={noteIdx}
                type="button"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * idx + 0.1, duration: 0.3 }}
                onClick={() => handleNoteTap(noteIdx)}
                className={`relative cursor-pointer rounded-2xl border-[1.5px] border-[#C99AA8] bg-[#FFFDF9]/95 px-5 py-3 text-center text-sm font-semibold italic text-[#5B3D46] shadow-sm transition-transform hover:scale-[1.03] sm:text-base ${
                  idx === 1 ? 'md:translate-x-5' : ''
                }`}
              >
                {note}
                {poppedIndex === noteIdx && (
                  <span className="ml-1.5 inline-block text-[#D85B88]">♡</span>
                )}
                {/* Speech Bubble Tail (Desktop) */}
                <span
                  aria-hidden="true"
                  className="hidden md:block absolute top-1/2 -left-2 h-3.5 w-3.5 -translate-y-1/2 rotate-45 border-b-[1.5px] border-l-[1.5px] border-[#C99AA8] bg-[#FFFDF9]"
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
