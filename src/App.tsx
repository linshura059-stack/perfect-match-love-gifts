import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Heart, QrCode, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { RibbonBow, TulipBouquet } from './components/KawaiiArtwork';
import { LetterSurprise } from './components/LetterSurprise';
import { GiftType, LoveGiftsHub } from './components/LoveGiftsHub';
import { PerfectMatchGame } from './components/PerfectMatchGame';
import { PersonalizeModal } from './components/PersonalizeModal';
import { SongSurprise } from './components/SongSurprise';
import { TulipsSurprise } from './components/TulipsSurprise';
import {
  CustomGiftContent,
  loadSavedContent,
  saveContent,
} from './data/defaultContent';
import { setSfxMuted } from './utils/sound';

type Stage = 'game' | 'gifts' | 'song' | 'letter' | 'tulips';

export default function App() {
  const [stage, setStage] = useState<Stage>('game');
  const [openedGifts, setOpenedGifts] = useState<GiftType[]>([]);
  const [resetSignal, setResetSignal] = useState(0);
  const [sfxMuted, setLocalSfxMuted] = useState(false);
  const [content, setContent] = useState<CustomGiftContent>(() =>
    loadSavedContent()
  );
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'qr' | 'photos' | 'letter'>('qr');

  const isGinghamBackdrop = stage === 'game' || stage === 'gifts';

  const handleToggleSfx = () => {
    const next = !sfxMuted;
    setLocalSfxMuted(next);
    setSfxMuted(next);
  };

  const handleSelectGift = (gift: GiftType) => {
    setOpenedGifts((prev) => (prev.includes(gift) ? prev : [...prev, gift]));
    setStage(gift);
  };

  const handleSaveContent = (next: CustomGiftContent) => {
    setContent(next);
    if (!saveContent(next)) {
      window.alert(
        "Couldn't save to this browser (storage is full or blocked). Your changes work for now but will be lost on reload — try fewer or smaller photos."
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Top-Left Primary Navigation Control (Restart on Game, Back on all other stages) */}
      <div className="fixed top-4 left-4 z-40 flex items-center gap-2">
        {stage === 'game' ? (
          <button
            type="button"
            onClick={() => setResetSignal((n) => n + 1)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-[1.5px] border-[#4B3434] bg-[#FFFDF7]/95 px-3.5 py-1.5 text-xs font-bold text-[#4B3434] shadow-xs backdrop-blur-xs transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restart
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStage(stage === 'gifts' ? 'game' : 'gifts')}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-[1.5px] border-[#4B3434] bg-[#FFFDF7]/95 px-3.5 py-1.5 text-xs font-bold text-[#4B3434] shadow-xs backdrop-blur-xs transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {stage === 'gifts' ? 'Back to Game' : 'Back'}
          </button>
        )}
      </div>

      {/* Top-Right Utility Controls (SFX Toggle & Personalize/Heart QR) */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleSfx}
          aria-label={sfxMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          title={sfxMuted ? 'Unmute SFX' : 'Mute SFX'}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border-[1.5px] border-[#4B3434] bg-[#FFFDF7]/95 text-[#4B3434] shadow-xs backdrop-blur-xs transition-transform hover:-translate-y-0.5"
        >
          {sfxMuted ? (
            <VolumeX className="h-3.5 w-3.5" />
          ) : (
            <Volume2 className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setModalTab('qr');
            setPersonalizeOpen(true);
          }}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-[1.5px] border-[#4B3434] bg-[#FFFDF7]/95 px-3 py-1.5 text-xs font-bold text-[#4B3434] shadow-xs backdrop-blur-xs transition-transform hover:-translate-y-0.5"
        >
          <QrCode className="h-3.5 w-3.5 text-[#B62458]" />
          Share QR
        </button>

        <button
          type="button"
          onClick={() => {
            setModalTab('photos');
            setPersonalizeOpen(true);
          }}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-[1.5px] border-[#4B3434] bg-[#FAD2DF]/95 px-3 py-1.5 text-xs font-bold text-[#4B3434] shadow-xs backdrop-blur-xs transition-transform hover:-translate-y-0.5"
        >
          <Heart className="h-3.5 w-3.5 fill-[#E55B85] text-[#4B3434]" />
          Personalize
        </button>
      </div>

      {/* Stage Content */}
      <AnimatePresence mode="wait">
        {isGinghamBackdrop ? (
          <motion.main
            key="gingham-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-pink-gingham relative flex min-h-screen w-full items-center justify-center px-4 py-20"
          >
            {/* Decorative Top-Right Ribbon Bow */}
            <div className="pointer-events-none absolute top-8 right-2 z-0 w-28 opacity-90 sm:top-12 sm:right-8 sm:w-44">
              <RibbonBow className="h-auto w-full rotate-12" />
            </div>

            {/* Decorative Bottom-Left Tulip Bouquet */}
            <div className="pointer-events-none absolute bottom-2 left-2 z-0 w-32 opacity-95 sm:bottom-5 sm:left-8 sm:w-48">
              <TulipBouquet className="h-auto w-full -rotate-12" />
            </div>

            {/* Decorative Bottom-Right Ribbon Bow */}
            <div className="pointer-events-none absolute right-2 bottom-2 z-0 hidden w-36 opacity-85 sm:block sm:right-10 sm:bottom-6">
              <RibbonBow className="h-auto w-full -rotate-12" />
            </div>

            <div className="relative z-10 flex w-full justify-center">
              {stage === 'game' ? (
                <PerfectMatchGame
                  content={content}
                  onComplete={() => setStage('gifts')}
                  resetSignal={resetSignal}
                />
              ) : (
                <LoveGiftsHub
                  openedGifts={openedGifts}
                  onSelectGift={handleSelectGift}
                  onBackToGame={() => setStage('game')}
                />
              )}
            </div>
          </motion.main>
        ) : stage === 'song' ? (
          <motion.main
            key="song-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <SongSurprise onNext={() => setStage('gifts')} />
          </motion.main>
        ) : stage === 'letter' ? (
          <motion.main
            key="letter-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <LetterSurprise
              content={content}
              onNext={() => setStage('gifts')}
            />
          </motion.main>
        ) : (
          <motion.main
            key="tulips-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <TulipsSurprise
              content={content}
              onNext={() => setStage('gifts')}
            />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Personalize & Heart QR Modal */}
      <PersonalizeModal
        isOpen={personalizeOpen}
        initialTab={modalTab}
        content={content}
        onSave={handleSaveContent}
        onClose={() => setPersonalizeOpen(false)}
      />
    </div>
  );
}
