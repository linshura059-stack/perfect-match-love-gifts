export interface PortraitPreset {
  id: string;
  label: string;
  backTone: 'sage' | 'pink';
  pose:
    | 'chin-rest'
    | 'soft-smile'
    | 'warm-gaze'
    | 'cheek-hand'
    | 'side-glance'
    | 'dreamy-tilt'
    | 'cozy-laugh'
    | 'sweet-wink';
  bgPalette: [string, string];
  outfitColor: string;
  hairAccent: string;
}

export interface CustomGiftContent {
  recipientBadge: string;
  modalHeadline: string;
  modalMessage: string;
  letterTitle: string;
  letterParagraphs: string[];
  letterSignature: string;
  tulipNotes: string[];
  customPhotos: Record<string, string>;
}

export const CARD_SLOTS: PortraitPreset[] = [
  {
    id: 'card-1',
    label: 'guess who?',
    backTone: 'sage',
    pose: 'chin-rest',
    bgPalette: ['#FCE7D8', '#E7B9A4'],
    outfitColor: '#3B2C2A',
    hairAccent: '#F8A9BD',
  },
  {
    id: 'card-2',
    label: 'peek inside',
    backTone: 'pink',
    pose: 'soft-smile',
    bgPalette: ['#F7DFD6', '#DFABA3'],
    outfitColor: '#4A3636',
    hairAccent: '#F48FB1',
  },
  {
    id: 'card-3',
    label: 'look closer',
    backTone: 'sage',
    pose: 'warm-gaze',
    bgPalette: ['#F6E2DA', '#D7A39D'],
    outfitColor: '#2F2526',
    hairAccent: '#F9B4C6',
  },
  {
    id: 'card-4',
    label: 'flip me',
    backTone: 'pink',
    pose: 'cheek-hand',
    bgPalette: ['#FBE4D8', '#E2B1A0'],
    outfitColor: '#3D2E2E',
    hairAccent: '#F39BB2',
  },
  {
    id: 'card-5',
    label: 'take a peek',
    backTone: 'pink',
    pose: 'side-glance',
    bgPalette: ['#F5DFD8', '#D8A29C'],
    outfitColor: '#352829',
    hairAccent: '#F7A8BC',
  },
  {
    id: 'card-6',
    label: 'your turn',
    backTone: 'sage',
    pose: 'dreamy-tilt',
    bgPalette: ['#FBE7DB', '#E4B8A5'],
    outfitColor: '#443232',
    hairAccent: '#F49BB2',
  },
  {
    id: 'card-7',
    label: 'one more',
    backTone: 'pink',
    pose: 'cozy-laugh',
    bgPalette: ['#F8E1D7', '#DFA99E'],
    outfitColor: '#322627',
    hairAccent: '#F9B2C4',
  },
  {
    id: 'card-8',
    label: 'found her?',
    backTone: 'sage',
    pose: 'sweet-wink',
    bgPalette: ['#FAE5DA', '#E1AFA1'],
    outfitColor: '#3B2C2C',
    hairAccent: '#F59AB2',
  },
];

export const DEFAULT_CONTENT: CustomGiftContent = {
  recipientBadge: 'the prettiest girl alive ♡',
  modalHeadline: "It's always been you ♡",
  modalMessage:
    "Every time I looked for the prettiest girl, every picture led me back to you. And even without this game, I'd choose you again and again. I love you. ♡",
  letterTitle: 'A Letter From My Heart',
  letterParagraphs: [
    "You make my life feel more beautiful and meaningful, and I feel so lucky to have you. I love you wholeheartedly, and I can't wait to continue loving you for the rest of my life.",
    'You make me smile, you make me feel safe, and you bring so much happiness into my world. I know I tell you this every day, but you truly are the most beautiful person in my eyes.',
    'Thank you for being you and for filling my heart with so much love. No matter what happens, I will always choose you.',
  ],
  letterSignature: 'Always, forever. ♡',
  tulipNotes: [
    'You make my heart bloom',
    'Life feels sweeter with you',
    'You make every moment count',
    'I choose you every day',
    'My love for you keeps growing',
    'My heart will always choose you',
  ],
  customPhotos: {},
};

const STORAGE_KEY = 'perfect_match_love_gifts_v1';

export function loadSavedContent(): CustomGiftContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONTENT;
    const parsed = JSON.parse(raw) as Partial<CustomGiftContent>;
    return {
      ...DEFAULT_CONTENT,
      ...parsed,
      letterParagraphs:
        Array.isArray(parsed.letterParagraphs) && parsed.letterParagraphs.length > 0
          ? parsed.letterParagraphs
          : DEFAULT_CONTENT.letterParagraphs,
      tulipNotes:
        Array.isArray(parsed.tulipNotes) && parsed.tulipNotes.length === 6
          ? parsed.tulipNotes
          : DEFAULT_CONTENT.tulipNotes,
      customPhotos: parsed.customPhotos || {},
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function saveContent(content: CustomGiftContent): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    return true;
  } catch {
    // Quota exceeded or storage blocked (private mode)
    return false;
  }
}
