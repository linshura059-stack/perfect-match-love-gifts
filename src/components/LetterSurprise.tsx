import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { CustomGiftContent } from '../data/defaultContent';
import { CalicoHeartCat, CherryBlossomBranch } from './KawaiiArtwork';

interface LetterSurpriseProps {
  content: CustomGiftContent;
  onNext: () => void;
}

export function LetterSurprise({ content, onNext }: LetterSurpriseProps) {
  const fullText = useMemo(
    () => content.letterParagraphs.join('\n\n'),
    [content.letterParagraphs]
  );

  const [visibleChars, setVisibleChars] = useState(0);
  const isFinished = visibleChars >= fullText.length;

  useEffect(() => {
    setVisibleChars(0);
  }, [fullText]);

  useEffect(() => {
    if (isFinished) return;
    const timer = window.setInterval(() => {
      setVisibleChars((c) => {
        const next = c + 4;
        return next >= fullText.length ? fullText.length : next;
      });
    }, 24);
    return () => clearInterval(timer);
  }, [fullText, isFinished]);

  const revealedParagraphs = fullText.slice(0, visibleChars).split('\n\n');

  return (
    <div className="bg-blush-studio relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onClick={() => {
          if (!isFinished) setVisibleChars(fullText.length);
        }}
        className="bg-notebook-paper relative w-full max-w-[760px] rounded-2xl border-2 border-[#D9C2AC] px-7 py-8 shadow-[0_18px_46px_rgba(92,50,60,0.16)] sm:px-14 sm:py-11"
      >
        {/* Cherry Blossom Branch on Right Margin */}
        <div className="pointer-events-none absolute top-4 right-0 w-[105px] opacity-90 sm:w-[140px]">
          <CherryBlossomBranch className="h-auto w-full" />
        </div>

        {/* Title */}
        <h1 className="font-display relative z-10 pr-16 text-3xl font-bold text-[#9C2E4B] sm:text-4xl">
          {content.letterTitle}
        </h1>

        {/* Letter Body */}
        <div className="relative z-10 mt-6 min-h-[250px] space-y-4 pr-10 text-sm leading-[32px] font-semibold text-[#4A3535] sm:pr-24 sm:text-base">
          {revealedParagraphs.map((para, idx) => (
            <p key={idx} className="whitespace-pre-wrap">
              {para}
              {!isFinished && idx === revealedParagraphs.length - 1 && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[#9C2E4B] align-middle" />
              )}
            </p>
          ))}
        </div>

        {/* Signature */}
        <div
          className={`font-display relative z-10 mt-6 pr-8 text-right text-lg font-semibold italic text-[#B13C5B] transition-opacity duration-500 sm:pr-20 sm:text-xl ${
            isFinished ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {content.letterSignature}
        </div>

        {/* Interactive Skip Hint while typing */}
        {!isFinished && (
          <div className="relative z-10 mt-2 text-right">
            <button
              type="button"
              onClick={() => setVisibleChars(fullText.length)}
              className="cursor-pointer text-xs font-semibold text-[#9C7878] underline underline-offset-2 hover:text-[#4B3434]"
            >
              Show full letter
            </button>
          </div>
        )}

        {/* Cute Calico Cat Hugging Red Heart at Bottom-Left */}
        <div className="pointer-events-none absolute -bottom-5 -left-4 z-20 w-[118px] sm:-bottom-6 sm:-left-8 sm:w-[152px]">
          <CalicoHeartCat className="h-auto w-full drop-shadow-md" />
        </div>
      </motion.div>

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
