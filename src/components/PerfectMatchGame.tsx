import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CARD_SLOTS, CustomGiftContent } from '../data/defaultContent';
import {
  playFlipSound,
  playMatchChime,
  playVictoryFanfare,
} from '../utils/sound';
import { PortraitIllustration } from './KawaiiArtwork';
import { RetroWindow } from './RetroWindow';

interface PerfectMatchGameProps {
  content: CustomGiftContent;
  onComplete: () => void;
  resetSignal: number;
}

export function PerfectMatchGame({
  content,
  onComplete,
  resetSignal,
}: PerfectMatchGameProps) {
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [nudgeText, setNudgeText] = useState<string | null>(null);
  const [pulseId, setPulseId] = useState<string | null>(null);

  // Reset board when parent triggers Restart
  React.useEffect(() => {
    setFlippedIds([]);
    setShowModal(false);
    setNudgeText(null);
  }, [resetSignal]);

  const matchedPairs = Math.floor(flippedIds.length / 2);
  const allRevealed = flippedIds.length === CARD_SLOTS.length;

  const handleCardClick = (id: string) => {
    if (flippedIds.includes(id)) {
      playFlipSound();
      setPulseId(id);
      window.setTimeout(() => setPulseId(null), 350);
      return;
    }

    const next = [...flippedIds, id];
    setFlippedIds(next);
    setNudgeText(null);

    if (next.length % 2 === 0) {
      playMatchChime();
    } else {
      playFlipSound();
    }
  };

  const handleVerify = () => {
    if (!allRevealed) {
      playFlipSound();
      setNudgeText(
        `Flip ${CARD_SLOTS.length - flippedIds.length} more card${
          CARD_SLOTS.length - flippedIds.length === 1 ? '' : 's'
        } to verify ♡`
      );
      return;
    }
    playVictoryFanfare();
    setShowModal(true);
  };

  const handlePlayAgain = () => {
    playFlipSound();
    setFlippedIds([]);
    setShowModal(false);
    setNudgeText(null);
  };

  const helperCopy = nudgeText
    ? nudgeText
    : matchedPairs === 0
    ? 'You only need to find matching pairs ♡'
    : matchedPairs === 1
    ? '1 pair found — keep flipping ♡'
    : matchedPairs === 2
    ? 'Halfway there — every picture looks familiar...'
    : matchedPairs === 3 && !allRevealed
    ? 'Just a little more — almost there ♡'
    : 'All 4 pairs found! Tap Verify ♡';

  // Arrange 8 cards around center counter slot (index 4 in a 3x3 grid)
  const gridCells: Array<
    { type: 'counter' } | { type: 'card'; slot: (typeof CARD_SLOTS)[number] }
  > = [
    { type: 'card', slot: CARD_SLOTS[0] },
    { type: 'card', slot: CARD_SLOTS[1] },
    { type: 'card', slot: CARD_SLOTS[2] },
    { type: 'card', slot: CARD_SLOTS[3] },
    { type: 'counter' },
    { type: 'card', slot: CARD_SLOTS[4] },
    { type: 'card', slot: CARD_SLOTS[5] },
    { type: 'card', slot: CARD_SLOTS[6] },
    { type: 'card', slot: CARD_SLOTS[7] },
  ];

  return (
    <div className="relative flex w-full items-center justify-center">
      <RetroWindow title="Perfect Match ♡" onClose={handlePlayAgain}>
        <div className="relative flex flex-col items-center text-center">
          {/* Header Prompt */}
          <p className="text-sm font-semibold text-[#5E4545] sm:text-base">
            Find the matching pictures of
          </p>
          <div className="mt-1.5 rounded-xl border-[1.5px] border-[#E09CB2] bg-[#FCE3EB] px-5 py-1.5 text-base font-bold text-[#B84A6A] shadow-xs sm:text-lg">
            {content.recipientBadge}
          </div>
          <p className="mt-2 min-h-[18px] text-xs font-semibold text-[#8A6D6D]">
            {helperCopy}
          </p>

          {/* 3x3 Card Grid */}
          <div className="mt-4 grid w-full max-w-[500px] grid-cols-3 gap-2.5 sm:gap-3">
            {gridCells.map((cell) => {
              if (cell.type === 'counter') {
                return (
                  <div
                    key="center-counter"
                    className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border-[1.5px] border-[#E3D1CA] bg-[#FFF8F3] select-none"
                  >
                    <span className="text-xl font-bold text-[#4B3434] tabular-nums sm:text-2xl">
                      {matchedPairs}/4
                    </span>
                    <span className="mt-1 h-[2px] w-8 rounded-full bg-[#D99EB0]" />
                  </div>
                );
              }

              const { slot } = cell;
              const isFlipped = flippedIds.includes(slot.id);
              const customPhoto = content.customPhotos[slot.id];

              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleCardClick(slot.id)}
                  aria-label={
                    isFlipped
                      ? `Revealed portrait card ${slot.label}`
                      : `Flip card ${slot.label}`
                  }
                  className={`perspective-1000 group relative aspect-[4/3] w-full cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C85A7B] ${
                    pulseId === slot.id ? 'scale-[1.03]' : ''
                  } transition-transform duration-150`}
                >
                  <div
                    className={`preserve-3d relative h-full w-full transition-transform duration-500 ease-out ${
                      isFlipped ? 'rotate-y-180' : 'group-hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Card Back */}
                    <div
                      className={`backface-hidden absolute inset-0 flex items-center justify-center rounded-xl border-[1.5px] border-[#4B3434] px-2 shadow-xs transition-colors ${
                        slot.backTone === 'sage'
                          ? 'bg-[#E9F0DA] group-hover:bg-[#E0EAC9]'
                          : 'bg-[#FCE6EB] group-hover:bg-[#FAD6DF]'
                      }`}
                    >
                      <span className="text-xs font-bold tracking-tight text-[#4B3434] sm:text-sm">
                        {slot.label}
                      </span>
                    </div>

                    {/* Card Front (Portrait Reveal) */}
                    <div className="backface-hidden rotate-y-180 absolute inset-0 overflow-hidden rounded-xl border-[1.5px] border-[#4B3434] bg-[#FFF8F3] shadow-xs">
                      <PortraitIllustration
                        preset={slot}
                        customPhoto={customPhoto}
                      />
                      <span
                        aria-hidden="true"
                        className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#4B3434]/50 bg-[#FFFDF7]/90 text-[10px] font-bold text-[#C85A7B] shadow-xs"
                      >
                        ♡
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Window Footer */}
          <div className="mt-5 flex w-full max-w-[500px] items-center justify-between border-t border-[#EADAD5] pt-3.5">
            <span className="text-xs font-bold text-[#7A5E5E] tabular-nums sm:text-sm">
              Matched: {matchedPairs}
            </span>

            <button
              type="button"
              onClick={handleVerify}
              className={`cursor-pointer rounded-xl border-[1.5px] border-[#4B3434] px-6 py-1.5 text-sm font-bold text-[#4B3434] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                allRevealed
                  ? 'bg-[#CFE0AA] shadow-[0_3px_0_#4B3434]'
                  : 'bg-[#E5ECD4] opacity-85 hover:opacity-100'
              }`}
            >
              Verify ♡
            </button>
          </div>

          {/* Reveal Overlay Modal ("It's always been you ♡") */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-[#FFF8F4]/85 p-3 backdrop-blur-[2px]"
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.94, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[410px] rounded-2xl border-2 border-[#4B3434] bg-[#FFFDF9] px-6 py-6 text-center shadow-[0_14px_32px_rgba(92,50,60,0.2)]"
                >
                  <p className="text-[11px] font-bold tracking-widest text-[#C85A7B]">
                    LOVE VERIFIED ♡
                  </p>
                  <div className="mt-1.5 text-2xl text-[#D65F84]">♡</div>
                  <h2 className="font-display mt-1 text-2xl font-bold text-[#4B3434]">
                    {content.modalHeadline}
                  </h2>
                  <p className="mt-2.5 text-xs leading-relaxed font-medium text-[#6B5050] sm:text-sm">
                    {content.modalMessage}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        playVictoryFanfare();
                        onComplete();
                      }}
                      className="cursor-pointer rounded-xl border-[1.5px] border-[#4B3434] bg-[#FAD2DF] px-5 py-2 text-xs font-bold text-[#4B3434] shadow-[0_2px_0_#4B3434] transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:text-sm"
                    >
                      Open Surprises ♡
                    </button>
                    <button
                      type="button"
                      onClick={handlePlayAgain}
                      className="cursor-pointer rounded-xl border-[1.5px] border-[#4B3434] bg-[#FFFDF7] px-4 py-2 text-xs font-bold text-[#6E5353] transition-colors hover:bg-[#F7EFEA] sm:text-sm"
                    >
                      Play again ♡
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </RetroWindow>
    </div>
  );
}
