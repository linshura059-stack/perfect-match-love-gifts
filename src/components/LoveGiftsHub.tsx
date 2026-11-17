import React from 'react';
import { motion } from 'motion/react';
import { playGiftUnwrapSound } from '../utils/sound';
import {
  LoveEnvelopeIcon,
  TulipBouquet,
  TurntableIcon,
} from './KawaiiArtwork';
import { RetroWindow } from './RetroWindow';

export type GiftType = 'song' | 'letter' | 'tulips';

interface LoveGiftsHubProps {
  openedGifts: GiftType[];
  onSelectGift: (gift: GiftType) => void;
  onBackToGame: () => void;
}

export function LoveGiftsHub({
  openedGifts,
  onSelectGift,
  onBackToGame,
}: LoveGiftsHubProps) {
  const gifts: Array<{
    id: GiftType;
    label: string;
    artwork: React.ReactNode;
    accentBg: string;
  }> = [
    {
      id: 'song',
      label: 'Our Song ♫',
      artwork: <TurntableIcon className="h-24 w-28 sm:h-28 sm:w-32" />,
      accentBg: 'bg-[#FFF5F8] hover:bg-[#FCE8EE]',
    },
    {
      id: 'letter',
      label: 'My Letter ♡',
      artwork: <LoveEnvelopeIcon className="h-24 w-28 sm:h-28 sm:w-32" />,
      accentBg: 'bg-[#FFF9F2] hover:bg-[#FDF0E1]',
    },
    {
      id: 'tulips',
      label: 'Flowers ♡',
      artwork: <TulipBouquet className="h-24 w-24 sm:h-28 sm:w-28" />,
      accentBg: 'bg-[#F8FAF3] hover:bg-[#EDF4DF]',
    },
  ];

  return (
    <div className="flex w-full items-center justify-center">
      <RetroWindow title="Love Gifts ♡" onClose={onBackToGame}>
        <div className="flex flex-col items-center py-2 text-center">
          <h1 className="text-xl font-bold text-[#4B3434] sm:text-2xl">
            I made you 3 little surprises ♡
          </h1>
          <p className="mt-1 text-sm font-semibold text-[#7A5E5E]">
            Pick a gift to unwrap ♡
          </p>

          <div className="mt-6 grid w-full max-w-[560px] grid-cols-1 gap-4 sm:grid-cols-3">
            {gifts.map((gift, index) => {
              const isOpened = openedGifts.includes(gift.id);
              return (
                <motion.button
                  key={gift.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.25 }}
                  onClick={() => {
                    playGiftUnwrapSound();
                    onSelectGift(gift.id);
                  }}
                  className={`group flex cursor-pointer flex-col items-center justify-between rounded-2xl border-2 border-[#4B3434] p-4 shadow-[0_4px_0_rgba(75,52,52,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_7px_0_rgba(75,52,52,0.16)] active:translate-y-0 ${gift.accentBg}`}
                >
                  <div className="flex h-28 items-center justify-center transition-transform duration-200 group-hover:scale-105">
                    {gift.artwork}
                  </div>
                  <div className="mt-3 w-full">
                    <div className="text-base font-bold text-[#4B3434]">
                      {gift.label}
                    </div>
                    <div className="mt-0.5 text-[11px] font-semibold text-[#9C7878]">
                      {isOpened ? 'Opened ✓' : 'Tap to unwrap'}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </RetroWindow>
    </div>
  );
}
