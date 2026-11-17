import React from 'react';
import { PortraitPreset } from '../data/defaultContent';

export function KittyPeek({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left Ear */}
      <path
        d="M22 36 C16 14, 24 6, 40 18 Z"
        fill="#FFFFFF"
        stroke="#4B3434"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path d="M25 30 C23 19, 27 15, 35 21 Z" fill="#FAD2DF" />

      {/* Right Ear */}
      <path
        d="M98 36 C104 14, 96 6, 80 18 Z"
        fill="#FFFFFF"
        stroke="#4B3434"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path d="M95 30 C97 19, 93 15, 85 21 Z" fill="#FAD2DF" />

      {/* Head */}
      <path
        d="M17 50 C17 24, 34 15, 60 15 C86 15, 103 24, 103 50 C103 60, 94 64, 60 64 C26 64, 17 60, 17 50 Z"
        fill="#FFFFFF"
        stroke="#4B3434"
        strokeWidth="2.8"
      />

      {/* Signature Pink Bow on Right Ear */}
      <g transform="translate(82, 16) rotate(14)">
        <ellipse
          cx="-10"
          cy="0"
          rx="9.5"
          ry="7.5"
          fill="#F48FB1"
          stroke="#4B3434"
          strokeWidth="2.2"
        />
        <ellipse
          cx="10"
          cy="0"
          rx="9.5"
          ry="7.5"
          fill="#F48FB1"
          stroke="#4B3434"
          strokeWidth="2.2"
        />
        <circle
          cx="0"
          cy="0"
          r="5"
          fill="#F8BBD0"
          stroke="#4B3434"
          strokeWidth="2.2"
        />
      </g>

      {/* Eyes */}
      <ellipse cx="42" cy="42" rx="3.3" ry="4.4" fill="#4B3434" />
      <ellipse cx="78" cy="42" rx="3.3" ry="4.4" fill="#4B3434" />

      {/* Blush */}
      <ellipse cx="34" cy="48" rx="5.5" ry="3" fill="#FAD2DF" opacity="0.85" />
      <ellipse cx="86" cy="48" rx="5.5" ry="3" fill="#FAD2DF" opacity="0.85" />

      {/* Nose */}
      <ellipse
        cx="60"
        cy="47"
        rx="4"
        ry="2.8"
        fill="#F7C948"
        stroke="#4B3434"
        strokeWidth="1.6"
      />

      {/* Whiskers */}
      <path
        d="M24 41 L11 39 M23 47 L9 48 M25 53 L12 56"
        stroke="#4B3434"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M96 41 L109 39 M97 47 L111 48 M95 53 L108 56"
        stroke="#4B3434"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Paws resting on title bar */}
      <ellipse
        cx="38"
        cy="64"
        rx="9.5"
        ry="6.5"
        fill="#FFFFFF"
        stroke="#4B3434"
        strokeWidth="2.5"
      />
      <ellipse
        cx="82"
        cy="64"
        rx="9.5"
        ry="6.5"
        fill="#FFFFFF"
        stroke="#4B3434"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function WashiTape({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 84 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 4 L78 4 L74 11 L79 17 L74 23 L78 28 L6 28 L10 22 L5 16 L10 10 Z"
        fill="#F7B7CB"
        stroke="#4B3434"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line x1="20" y1="5" x2="14" y2="27" stroke="#FCE5EC" strokeWidth="3.5" />
      <line x1="34" y1="5" x2="28" y2="27" stroke="#FCE5EC" strokeWidth="3.5" />
      <line x1="48" y1="5" x2="42" y2="27" stroke="#FCE5EC" strokeWidth="3.5" />
      <line x1="62" y1="5" x2="56" y2="27" stroke="#FCE5EC" strokeWidth="3.5" />
    </svg>
  );
}

export function RibbonBow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left Ribbon Tail */}
      <path
        d="M84 72 C68 95, 50 118, 28 138 L46 130 L56 144 C70 120, 82 98, 90 76 Z"
        fill="#F29DB7"
        stroke="#B35C7A"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Right Ribbon Tail */}
      <path
        d="M96 72 C112 95, 130 118, 152 138 L134 130 L124 144 C110 120, 98 98, 90 76 Z"
        fill="#EB88A6"
        stroke="#B35C7A"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Left Loop */}
      <path
        d="M88 64 C62 24, 14 26, 20 62 C24 88, 60 88, 88 70 Z"
        fill="#F8BBD0"
        stroke="#B35C7A"
        strokeWidth="2.4"
      />
      <path
        d="M80 65 C62 46, 36 48, 38 62 C40 74, 62 74, 82 67"
        fill="#E57E9D"
        opacity="0.45"
      />
      {/* Right Loop */}
      <path
        d="M92 64 C118 24, 166 26, 160 62 C156 88, 120 88, 92 70 Z"
        fill="#F4A5BE"
        stroke="#B35C7A"
        strokeWidth="2.4"
      />
      <path
        d="M100 65 C118 46, 144 48, 142 62 C140 74, 118 74, 98 67"
        fill="#DC6E8F"
        opacity="0.45"
      />
      {/* Center Knot */}
      <rect
        x="79"
        y="55"
        width="22"
        height="22"
        rx="8"
        fill="#F48FB1"
        stroke="#B35C7A"
        strokeWidth="2.4"
      />
      {/* Subtle satin highlight */}
      <path
        d="M34 52 C44 42, 60 44, 72 54"
        stroke="#FFF5F8"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M146 52 C136 42, 120 44, 108 54"
        stroke="#FFF5F8"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function TulipBouquet({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Back Wrapper Paper */}
      <path
        d="M42 108 L110 242 L178 108 L152 84 L110 100 L68 84 Z"
        fill="#F2D7C4"
        stroke="#9A6A5B"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M52 110 L110 226 L168 110"
        fill="#FBECE0"
        opacity="0.65"
      />

      {/* Leaves */}
      <path
        d="M84 128 C64 95, 56 64, 68 42 C82 65, 92 98, 96 126 Z"
        fill="#84B885"
        stroke="#4B6E4C"
        strokeWidth="2"
      />
      <path
        d="M136 128 C156 95, 164 64, 152 42 C138 65, 128 98, 124 126 Z"
        fill="#84B885"
        stroke="#4B6E4C"
        strokeWidth="2"
      />
      <path
        d="M108 130 C104 92, 106 54, 112 34 C118 58, 118 94, 114 130 Z"
        fill="#96C897"
        stroke="#4B6E4C"
        strokeWidth="2"
      />

      {/* Tulips (7 rich layered pink/rose blooms) */}
      {/* Top Center Tulip */}
      <g transform="translate(110, 48)">
        <path
          d="M-14 0 C-16 -24, -4 -34, 0 -34 C4 -34, 16 -24, 14 0 C12 12, -12 12, -14 0 Z"
          fill="#F06292"
          stroke="#7A324B"
          strokeWidth="2"
        />
        <path
          d="M-10 -4 C-10 -22, -2 -28, 0 -28 C2 -28, 10 -22, 10 -4 C8 8, -8 8, -10 -4 Z"
          fill="#F898B8"
        />
      </g>

      {/* Top Left Tulip */}
      <g transform="translate(76, 62) rotate(-18)">
        <path
          d="M-13 0 C-15 -22, -4 -32, 0 -32 C4 -32, 15 -22, 13 0 C11 11, -11 11, -13 0 Z"
          fill="#F48FB1"
          stroke="#7A324B"
          strokeWidth="2"
        />
        <path
          d="M-7 -3 C-7 -18, 0 -25, 0 -25 C4 -22, 8 -14, 7 -3 Z"
          fill="#FCC4D6"
        />
      </g>

      {/* Top Right Tulip */}
      <g transform="translate(144, 62) rotate(18)">
        <path
          d="M-13 0 C-15 -22, -4 -32, 0 -32 C4 -32, 15 -22, 13 0 C11 11, -11 11, -13 0 Z"
          fill="#F48FB1"
          stroke="#7A324B"
          strokeWidth="2"
        />
        <path
          d="M-7 -3 C-7 -18, 0 -25, 0 -25 C4 -22, 8 -14, 7 -3 Z"
          fill="#FCC4D6"
        />
      </g>

      {/* Mid Left Tulip */}
      <g transform="translate(62, 92) rotate(-26)">
        <path
          d="M-12 0 C-14 -20, -3 -28, 0 -28 C3 -28, 14 -20, 12 0 C10 10, -10 10, -12 0 Z"
          fill="#EC6F98"
          stroke="#7A324B"
          strokeWidth="2"
        />
        <path
          d="M-6 -2 C-5 -16, 0 -22, 0 -22 C4 -19, 6 -12, 6 -2 Z"
          fill="#F7A8C2"
        />
      </g>

      {/* Mid Right Tulip */}
      <g transform="translate(158, 92) rotate(26)">
        <path
          d="M-12 0 C-14 -20, -3 -28, 0 -28 C3 -28, 14 -20, 12 0 C10 10, -10 10, -12 0 Z"
          fill="#EC6F98"
          stroke="#7A324B"
          strokeWidth="2"
        />
        <path
          d="M-6 -2 C-5 -16, 0 -22, 0 -22 C4 -19, 6 -12, 6 -2 Z"
          fill="#F7A8C2"
        />
      </g>

      {/* Front Center-Left Tulip */}
      <g transform="translate(92, 94) rotate(-7)">
        <path
          d="M-14 0 C-16 -22, -4 -31, 0 -31 C4 -31, 16 -22, 14 0 C12 11, -12 11, -14 0 Z"
          fill="#F69BB9"
          stroke="#7A324B"
          strokeWidth="2"
        />
        <path
          d="M-8 -3 C-6 -18, 0 -24, 0 -24 C5 -20, 8 -12, 8 -3 Z"
          fill="#FFD4E2"
        />
      </g>

      {/* Front Center-Right Tulip */}
      <g transform="translate(128, 94) rotate(8)">
        <path
          d="M-14 0 C-16 -22, -4 -31, 0 -31 C4 -31, 16 -22, 14 0 C12 11, -12 11, -14 0 Z"
          fill="#EC6F98"
          stroke="#7A324B"
          strokeWidth="2"
        />
        <path
          d="M-8 -3 C-6 -18, 0 -24, 0 -24 C5 -20, 8 -12, 8 -3 Z"
          fill="#F9B5CB"
        />
      </g>

      {/* Front Wrap Cone */}
      <path
        d="M44 114 C70 132, 150 132, 176 114 L118 244 L102 244 Z"
        fill="#E9C3AC"
        stroke="#9A6A5B"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M52 120 C76 135, 144 135, 168 120 L110 232 Z"
        fill="#F5DAC7"
      />

      {/* Ribbon Bow on Bouquet */}
      <g transform="translate(110, 174)">
        <path
          d="M-6 4 C-20 28, -32 46, -40 58 L-24 52 L-16 62 C-10 42, -5 24, -2 6 Z"
          fill="#F083A8"
          stroke="#7A324B"
          strokeWidth="2"
        />
        <path
          d="M6 4 C20 28, 32 46, 40 58 L24 52 L16 62 C10 42, 5 24, 2 6 Z"
          fill="#EA6D97"
          stroke="#7A324B"
          strokeWidth="2"
        />
        <path
          d="M-2 -2 C-24 -22, -44 -8, -36 10 C-30 22, -10 14, -2 4 Z"
          fill="#F7A8C2"
          stroke="#7A324B"
          strokeWidth="2"
        />
        <path
          d="M2 -2 C24 -22, 44 -8, 36 10 C30 22, 10 14, 2 4 Z"
          fill="#F48FB1"
          stroke="#7A324B"
          strokeWidth="2"
        />
        <circle
          cx="0"
          cy="1"
          r="7"
          fill="#F48FB1"
          stroke="#7A324B"
          strokeWidth="2"
        />
        {/* Tiny Heart Tag */}
        <g transform="translate(0, 26) rotate(-5)">
          <rect
            x="-9"
            y="-4"
            width="18"
            height="24"
            rx="3"
            fill="#FFFDF9"
            stroke="#9A6A5B"
            strokeWidth="1.6"
          />
          <path
            d="M0 13 C-4 9, -5 5, -2.5 3.5 C-1 2.5, 0 4, 0 5 C0 4, 1 2.5, 2.5 3.5 C5 5, 4 9, 0 13 Z"
            fill="#EA6D97"
          />
        </g>
      </g>
    </svg>
  );
}

export function TurntableIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Open Lid */}
      <path
        d="M28 48 L36 14 C37 10, 41 8, 45 8 L108 8 C112 8, 115 11, 114 15 L106 48 Z"
        fill="#F9BBD0"
        stroke="#4B3434"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Musical note on lid */}
      <path
        d="M68 20 L68 35 M68 20 L82 17 L82 32"
        stroke="#D85B88"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="64" cy="36" r="4" fill="#D85B88" />
      <circle cx="78" cy="33" r="4" fill="#D85B88" />

      {/* Suitcase Base */}
      <rect
        x="22"
        y="46"
        width="96"
        height="56"
        rx="10"
        fill="#FAD4E1"
        stroke="#4B3434"
        strokeWidth="2.5"
      />
      <rect
        x="26"
        y="50"
        width="88"
        height="48"
        rx="7"
        fill="#FFF5F8"
        stroke="#4B3434"
        strokeWidth="1.8"
      />

      {/* Vinyl Disc */}
      <circle
        cx="64"
        cy="74"
        r="21"
        fill="#32282B"
        stroke="#4B3434"
        strokeWidth="2"
      />
      <circle
        cx="64"
        cy="74"
        r="14"
        stroke="#57474B"
        strokeWidth="1"
        strokeDasharray="6 4"
      />
      <circle cx="64" cy="74" r="7" fill="#F48FB1" />
      <circle cx="64" cy="74" r="2.2" fill="#FFF5F8" />

      {/* Tonearm */}
      <circle
        cx="99"
        cy="60"
        r="5.5"
        fill="#E6B2C3"
        stroke="#4B3434"
        strokeWidth="1.8"
      />
      <path
        d="M98 63 L85 84 L80 86"
        stroke="#4B3434"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Knobs */}
      <circle cx="100" cy="88" r="3.5" fill="#F48FB1" stroke="#4B3434" strokeWidth="1.6" />
      <circle cx="90" cy="88" r="2.5" fill="#DCE6C2" stroke="#4B3434" strokeWidth="1.6" />
    </svg>
  );
}

export function LoveEnvelopeIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Back Envelope Flap */}
      <path
        d="M24 46 L70 16 L116 46 Z"
        fill="#F49CB8"
        stroke="#4B3434"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Letter Peeking Out */}
      <rect
        x="34"
        y="24"
        width="72"
        height="52"
        rx="5"
        fill="#FFFDF5"
        stroke="#4B3434"
        strokeWidth="2.2"
      />
      <line x1="45" y1="36" x2="95" y2="36" stroke="#D9A7B7" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="46" x2="86" y2="46" stroke="#D9A7B7" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="56" x2="76" y2="56" stroke="#D9A7B7" strokeWidth="2.5" strokeLinecap="round" />

      {/* Envelope Body */}
      <rect
        x="24"
        y="46"
        width="92"
        height="58"
        rx="8"
        fill="#FAD2DF"
        stroke="#4B3434"
        strokeWidth="2.4"
      />
      <path
        d="M26 48 L70 79 L114 48"
        stroke="#4B3434"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M26 101 L54 74 M114 101 L86 74"
        stroke="#4B3434"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Wax Heart Seal */}
      <path
        d="M70 86 C60 77, 58 67, 64 63 C67 61, 70 64, 70 66 C70 64, 73 61, 76 63 C82 67, 80 77, 70 86 Z"
        fill="#EC5B89"
        stroke="#4B3434"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CalicoHeartCat({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 175"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Floating Hearts */}
      <path
        d="M112 24 C106 18, 106 12, 110 10 C112 9, 114 11, 114 12 C114 11, 116 9, 118 10 C122 12, 122 18, 112 24 Z"
        fill="#E94E66"
        stroke="#4B3434"
        strokeWidth="1.6"
      />
      <path
        d="M136 42 C131 37, 131 32, 134 30 C136 29, 137 31, 137 32 C137 31, 138 29, 140 30 C143 32, 143 37, 136 42 Z"
        fill="#E94E66"
        stroke="#4B3434"
        strokeWidth="1.6"
      />
      <path
        d="M148 16 C144 12, 144 8, 146.5 7 C148 6.5, 149 7.5, 149 8.5 C149 7.5, 150 6.5, 151.5 7 C154 8, 154 12, 148 16 Z"
        fill="#F48FB1"
      />

      {/* Cat Ears */}
      <path
        d="M28 56 L22 22 L54 38 Z"
        fill="#D6874A"
        stroke="#4B3434"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M126 56 L132 22 L100 38 Z"
        fill="#533B36"
        stroke="#4B3434"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Cat Body & Head */}
      <path
        d="M18 148 C14 96, 26 36, 77 36 C128 36, 140 96, 136 148 Z"
        fill="#FFF9EF"
        stroke="#4B3434"
        strokeWidth="3"
      />
      {/* Calico Patches */}
      <path
        d="M24 72 C28 48, 48 38, 66 39 C62 58, 48 74, 24 72 Z"
        fill="#D6874A"
      />
      <path
        d="M128 70 C124 48, 108 38, 92 39 C96 56, 110 72, 128 70 Z"
        fill="#533B36"
      />

      {/* Face */}
      <ellipse cx="55" cy="75" rx="4.5" ry="5.5" fill="#4B3434" />
      <ellipse cx="99" cy="75" rx="4.5" ry="5.5" fill="#4B3434" />
      <circle cx="53.5" cy="73" r="1.5" fill="#FFFFFF" />
      <circle cx="97.5" cy="73" r="1.5" fill="#FFFFFF" />
      <ellipse cx="44" cy="84" rx="7" ry="4" fill="#F9B5C7" />
      <ellipse cx="110" cy="84" rx="7" ry="4" fill="#F9B5C7" />
      <path
        d="M71 81 Q77 88 83 81"
        stroke="#4B3434"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Big Red Heart Being Hugged */}
      <path
        d="M84 160 C46 134, 42 102, 61 92 C72 86, 82 94, 84 102 C86 94, 96 86, 107 92 C126 102, 122 134, 84 160 Z"
        fill="#E53955"
        stroke="#4B3434"
        strokeWidth="3"
      />
      <path
        d="M58 106 C58 100, 64 96, 70 98"
        stroke="#FF8FA3"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Paws Hugging Heart */}
      <ellipse
        cx="54"
        cy="120"
        rx="12"
        ry="9"
        transform="rotate(20 54 120)"
        fill="#FFF9EF"
        stroke="#4B3434"
        strokeWidth="2.8"
      />
      <ellipse
        cx="114"
        cy="120"
        rx="12"
        ry="9"
        transform="rotate(-20 114 120)"
        fill="#FFF9EF"
        stroke="#4B3434"
        strokeWidth="2.8"
      />
    </svg>
  );
}

export function CherryBlossomBranch({ className = '' }: { className?: string }) {
  const blossom = (cx: number, cy: number, scale = 1, rot = 0) => (
    <g transform={`translate(${cx}, ${cy}) scale(${scale}) rotate(${rot})`}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="0"
          cy="-10"
          rx="6.2"
          ry="9.5"
          transform={`rotate(${deg})`}
          fill="#FBBBD0"
          stroke="#DF789A"
          strokeWidth="1"
        />
      ))}
      <circle cx="0" cy="0" r="4" fill="#F06292" />
      <circle cx="0" cy="0" r="1.8" fill="#FFF3B0" />
    </g>
  );

  return (
    <svg
      viewBox="0 0 180 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M170 20 C140 60, 118 96, 128 150 C134 185, 112 224, 96 270"
        stroke="#8B5E5A"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M132 104 C105 92, 86 78, 70 64"
        stroke="#8B5E5A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M124 182 C96 176, 80 188, 66 202"
        stroke="#8B5E5A"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {blossom(138, 56, 1.05, 12)}
      {blossom(88, 72, 0.9, -15)}
      {blossom(114, 118, 1.15, 22)}
      {blossom(144, 152, 0.85, -8)}
      {blossom(82, 192, 0.95, 15)}
      {blossom(110, 232, 1.0, -10)}
      {/* Falling Petals */}
      <ellipse cx="48" cy="128" rx="5" ry="3" transform="rotate(35 48 128)" fill="#F9B8CE" />
      <ellipse cx="64" cy="248" rx="4.5" ry="2.8" transform="rotate(-25 64 248)" fill="#F9B8CE" />
      <ellipse cx="142" cy="285" rx="5" ry="3" transform="rotate(40 142 285)" fill="#F9B8CE" />
    </svg>
  );
}

export function PortraitIllustration({
  preset,
  customPhoto,
}: {
  preset: PortraitPreset;
  customPhoto?: string;
}) {
  if (customPhoto) {
    return (
      <img
        src={customPhoto}
        alt="Special portrait memory"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover"
      />
    );
  }

  const [bgLight, bgWarm] = preset.bgPalette;
  const pose = preset.pose;

  // Slight expressive variations per card so every flip reveals a unique affectionate moment
  const headTilt =
    pose === 'dreamy-tilt'
      ? -7
      : pose === 'chin-rest'
      ? 5
      : pose === 'side-glance'
      ? -4
      : pose === 'sweet-wink'
      ? 6
      : 0;

  const isWinking = pose === 'sweet-wink';
  const isLaughing = pose === 'cozy-laugh' || pose === 'soft-smile';
  const hasHandOnChin =
    pose === 'chin-rest' || pose === 'cheek-hand' || pose === 'warm-gaze';

  return (
    <svg
      viewBox="0 0 180 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full object-cover"
      aria-label="Warm portrait illustration"
    >
      <defs>
        <linearGradient id={`bg-${preset.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bgLight} />
          <stop offset="100%" stopColor={bgWarm} />
        </linearGradient>
        <radialGradient id={`glow-${preset.id}`} cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#FFF7EE" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FFF7EE" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Cozy Bedroom / Golden Hour Backdrop */}
      <rect width="180" height="120" fill={`url(#bg-${preset.id})`} />
      <rect width="180" height="120" fill={`url(#glow-${preset.id})`} />
      {/* Soft window light beam */}
      <polygon
        points="0,0 74,0 44,120 0,120"
        fill="#FFFFFF"
        opacity="0.18"
      />

      {/* Character Group */}
      <g transform={`translate(90, 66) rotate(${headTilt}) translate(-90, -66)`}>
        {/* Back Hair Volume */}
        <path
          d="M52 46 C44 68, 44 105, 50 124 L130 124 C136 105, 136 68, 128 46 C122 22, 108 14, 90 14 C72 14, 58 22, 52 46 Z"
          fill="#2D1F1D"
        />

        {/* Shoulders & Cozy Top */}
        <path
          d="M46 122 C50 96, 68 88, 90 88 C112 88, 130 96, 134 122 Z"
          fill={preset.outfitColor}
        />

        {/* Neck */}
        <rect x="81" y="75" width="18" height="20" rx="8" fill="#F4C7B2" />
        <path d="M81 80 Q90 86 99 80" fill="#E3AA91" opacity="0.5" />

        {/* Face */}
        <path
          d="M64 46 C64 28, 76 22, 90 22 C104 22, 116 28, 116 46 C116 66, 105 80, 90 80 C75 80, 64 66, 64 46 Z"
          fill="#F9D2BF"
        />

        {/* Soft Cheek Blush */}
        <ellipse cx="74" cy="59" rx="6.5" ry="3.6" fill="#F299A9" opacity="0.52" />
        <ellipse cx="106" cy="59" rx="6.5" ry="3.6" fill="#F299A9" opacity="0.52" />

        {/* Eyes */}
        {isWinking ? (
          <>
            <path
              d="M72 51 Q77 46 82 51"
              stroke="#3B2624"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse cx="102" cy="51" rx="3.4" ry="4" fill="#3B2624" />
            <circle cx="101" cy="49.5" r="1.2" fill="#FFFFFF" />
          </>
        ) : (
          <>
            <ellipse cx="78" cy="51" rx="3.4" ry="4" fill="#3B2624" />
            <circle cx="77" cy="49.5" r="1.2" fill="#FFFFFF" />
            <ellipse cx="102" cy="51" rx="3.4" ry="4" fill="#3B2624" />
            <circle cx="101" cy="49.5" r="1.2" fill="#FFFFFF" />
          </>
        )}

        {/* Eyebrows */}
        <path
          d="M72 44 Q78 41 84 44"
          stroke="#3B2624"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M96 44 Q102 41 108 44"
          stroke="#3B2624"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Nose */}
        <path
          d="M89 56 Q91 59 88 60"
          stroke="#D79982"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Lips / Smile */}
        {isLaughing ? (
          <path
            d="M83 65 Q90 72 97 65 Z"
            fill="#DC6B7E"
          />
        ) : (
          <path
            d="M84 66 Q90 70 96 66"
            stroke="#C76274"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Front Bangs & Framing Hair */}
        <path
          d="M62 48 C63 26, 78 18, 90 19 C104 18, 118 27, 118 48 C113 34, 102 30, 94 35 C86 30, 74 33, 62 48 Z"
          fill="#2D1F1D"
        />
        {/* Soft curtain hair strands */}
        <path
          d="M64 38 C56 58, 56 84, 62 104"
          stroke="#2D1F1D"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M116 38 C124 58, 124 84, 118 104"
          stroke="#2D1F1D"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Cute Hair Clip */}
        <rect
          x="106"
          y="30"
          width="10"
          height="4"
          rx="2"
          transform="rotate(24 106 30)"
          fill={preset.hairAccent}
        />

        {/* Optional Hand Resting Near Chin */}
        {hasHandOnChin && (
          <g>
            <path
              d="M72 120 L79 82 C80 77, 86 76, 87 82 L84 120 Z"
              fill="#F6CBBA"
            />
            <ellipse cx="83" cy="80" rx="7" ry="5.5" fill="#F9D2BF" />
          </g>
        )}
      </g>

      {/* Subtle Heart Sparkle */}
      <path
        d="M22 24 C19 20, 19 16, 21.5 15 C23 14.5, 24 16, 24 17 C24 16, 25 14.5, 26.5 15 C29 16, 29 20, 24 24 Z"
        fill="#FFFFFF"
        opacity="0.7"
      />
    </svg>
  );
}
