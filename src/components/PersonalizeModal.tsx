import React, { useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  Check,
  Copy,
  Download,
  Heart,
  QrCode,
  RotateCcw,
  Upload,
  X,
} from 'lucide-react';
import {
  CARD_SLOTS,
  CustomGiftContent,
  DEFAULT_CONTENT,
} from '../data/defaultContent';

interface PersonalizeModalProps {
  isOpen: boolean;
  initialTab?: 'qr' | 'photos' | 'letter';
  content: CustomGiftContent;
  onSave: (next: CustomGiftContent) => void;
  onClose: () => void;
}

interface QrMatrix {
  size: number;
  data: Uint8Array;
}

function getDefaultShareUrl(): string {
  if (typeof window === 'undefined') return 'https://love-gifts.app';
  const href = window.location.href;
  if (window.location.hostname.startsWith('ais-dev-')) {
    return href.replace('ais-dev-', 'ais-pre-');
  }
  return href;
}

function generateQrMatrix(value: string): QrMatrix | null {
  const safeValue = value.trim() || 'https://love-gifts.app';
  try {
    const qr = QRCode.create(safeValue, { errorCorrectionLevel: 'H' });
    return {
      size: qr.modules.size,
      data: qr.modules.data,
    };
  } catch {
    return null;
  }
}

export function PersonalizeModal({
  isOpen,
  initialTab = 'qr',
  content,
  onSave,
  onClose,
}: PersonalizeModalProps) {
  const [tab, setTab] = useState<'qr' | 'photos' | 'letter'>(initialTab);
  const [draft, setDraft] = useState<CustomGiftContent>(content);
  const [qrUrl, setQrUrl] = useState<string>(() => getDefaultShareUrl());
  const [qrCaption, setQrCaption] = useState<string>('Open when alone ♡');
  const [qrStyle, setQrStyle] = useState<'heart' | 'square'>('heart');
  const [copied, setCopied] = useState(false);
  // Raw textarea text: parsing into paragraphs on every keystroke would swallow
  // the blank line the user is typing, so paragraphs are split only on change.
  const [letterText, setLetterText] = useState(() =>
    content.letterParagraphs.join('\n\n')
  );

  React.useEffect(() => {
    if (isOpen) {
      setDraft(content);
      setLetterText(content.letterParagraphs.join('\n\n'));
      setTab(initialTab);
    }
  }, [isOpen, content, initialTab]);

  const qrMatrix = useMemo(() => generateQrMatrix(qrUrl), [qrUrl]);

  // Decorative lobe dots placed safely outside the rotated QR quiet zone
  const heartLobeDots = useMemo(() => {
    const dots: Array<{ x: number; y: number; size: number }> = [];
    const step = 10;
    // Left lobe center (126, 114), radius ~72
    // Right lobe center (234, 114), radius ~72
    for (let y = 34; y <= 210; y += step) {
      for (let x = 34; x <= 326; x += step) {
        const dxL = x - 120;
        const dyL = y - 114;
        const inLeftLobe = dxL * dxL + dyL * dyL <= 70 * 70;

        const dxR = x - 240;
        const dyR = y - 114;
        const inRightLobe = dxR * dxR + dyR * dyR <= 70 * 70;

        if (!inLeftLobe && !inRightLobe) continue;

        // Keep strict white quiet zone around the rotated 180x180 QR diamond centered at (180, 198)
        const relX = x - 180;
        const relY = y - 198;
        const cos = Math.SQRT1_2;
        const rotX = relX * cos + relY * cos;
        const rotY = -relX * cos + relY * cos;
        const insideQuietZone = Math.abs(rotX) <= 104 && Math.abs(rotY) <= 104;

        if (insideQuietZone) continue;

        // Deterministic organic mosaic pattern for heart lobes
        const hash = ((x * 73856093) ^ (y * 19349663)) >>> 0;
        if (hash % 10 < 7) {
          dots.push({ x: x - 4, y: y - 4, size: 7.5 });
        }
      }
    }
    return dots;
  }, []);

  if (!isOpen) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl.trim() || getDefaultShareUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  const handleDownloadPng = () => {
    if (!qrMatrix) return;

    const canvas = document.createElement('canvas');
    const width = 960;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crisp white card background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Soft outer border
    ctx.strokeStyle = '#E8B8C8';
    ctx.lineWidth = 8;
    ctx.strokeRect(24, 24, width - 48, height - 48);

    const qrColor = '#B62458';
    const lobeColor = '#D15581';

    if (qrStyle === 'heart') {
      const scale = 2.4;
      const offsetX = (width - 360 * scale) / 2;
      const offsetY = 56;

      // Draw decorative heart lobes safely outside quiet zone
      ctx.fillStyle = lobeColor;
      heartLobeDots.forEach((dot) => {
        ctx.fillRect(
          offsetX + dot.x * scale,
          offsetY + dot.y * scale,
          dot.size * scale,
          dot.size * scale
        );
      });

      // Draw real rotated QR matrix with generous white quiet zone
      ctx.save();
      ctx.translate(offsetX + 180 * scale, offsetY + 198 * scale);
      ctx.rotate(-Math.PI / 4);

      const qrPx = 176 * scale;
      const quietPad = 18 * scale;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(
        -qrPx / 2 - quietPad,
        -qrPx / 2 - quietPad,
        qrPx + quietPad * 2,
        qrPx + quietPad * 2
      );

      const cellPx = qrPx / qrMatrix.size;
      ctx.fillStyle = qrColor;
      for (let r = 0; r < qrMatrix.size; r++) {
        for (let c = 0; c < qrMatrix.size; c++) {
          if (qrMatrix.data[r * qrMatrix.size + c]) {
            ctx.fillRect(
              -qrPx / 2 + c * cellPx,
              -qrPx / 2 + r * cellPx,
              Math.ceil(cellPx),
              Math.ceil(cellPx)
            );
          }
        }
      }
      ctx.restore();
    } else {
      const qrPx = 640;
      const startX = (width - qrPx) / 2;
      const startY = 140;
      const cellPx = qrPx / qrMatrix.size;

      ctx.fillStyle = qrColor;
      for (let r = 0; r < qrMatrix.size; r++) {
        for (let c = 0; c < qrMatrix.size; c++) {
          if (qrMatrix.data[r * qrMatrix.size + c]) {
            ctx.fillRect(
              startX + c * cellPx,
              startY + r * cellPx,
              Math.ceil(cellPx),
              Math.ceil(cellPx)
            );
          }
        }
      }
    }

    // Caption below QR
    if (qrCaption.trim()) {
      ctx.fillStyle = '#9C2E4B';
      ctx.font = 'bold 40px Quicksand, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(qrCaption.trim(), width / 2, 970);
    }

    const link = document.createElement('a');
    link.download = 'perfect-match-qr.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Downscale + re-encode so 8 phone photos fit in localStorage (~5MB quota)
  const handlePhotoUpload = (slotId: string, file: File) => {
    const setPhoto = (dataUrl: string) =>
      setDraft((prev) => ({
        ...prev,
        customPhotos: { ...prev.customPhotos, [slotId]: dataUrl },
      }));

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const MAX = 720;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL('image/jpeg', 0.82));
      }
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => URL.revokeObjectURL(objectUrl);
    img.src = objectUrl;
  };

  const handleSave = () => {
    onSave({
      ...draft,
      letterParagraphs: letterText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
    });
    onClose();
  };

  const handleResetAll = () => {
    setDraft(DEFAULT_CONTENT);
    setLetterText(DEFAULT_CONTENT.letterParagraphs.join('\n\n'));
    onSave(DEFAULT_CONTENT);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#3B252B]/45 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Personalize and Share"
    >
      <div className="flex max-h-[90vh] w-full max-w-[660px] flex-col overflow-hidden rounded-2xl border-2 border-[#4B3434] bg-[#FFFDF7] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#4B3434] bg-[#DCE6C2] px-5 py-3">
          <h2 className="text-base font-bold text-[#4B3434]">
            Personalize & Share ♡
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-[#4B3434] bg-[#FAD2DF] text-[#4B3434] hover:scale-105"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 border-b border-[#EADAD5] bg-[#FFF8F3] px-5 py-2.5">
          {(
            [
              { id: 'qr', label: 'Scannable QR Card' },
              { id: 'photos', label: 'Grid Photos (8)' },
              { id: 'letter', label: 'Letter & Notes' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                tab === item.id
                  ? 'border-[#4B3434] bg-[#FAD2DF] text-[#4B3434]'
                  : 'border-transparent bg-transparent text-[#7A5E5E] hover:bg-[#F3E6E2]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {tab === 'qr' && (
            <div className="flex flex-col items-center text-center">
              <p className="text-xs font-semibold text-[#7A5E5E]">
                Real scannable QR code — download as PNG or screenshot to send on WhatsApp &amp; messages.
              </p>

              {/* Style Toggle */}
              <div className="mt-3 inline-flex rounded-xl border border-[#D9C2AC] bg-[#FFF8F3] p-1">
                <button
                  type="button"
                  onClick={() => setQrStyle('heart')}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                    qrStyle === 'heart'
                      ? 'bg-[#FAD2DF] text-[#4B3434] shadow-xs'
                      : 'text-[#7A5E5E] hover:text-[#4B3434]'
                  }`}
                >
                  <Heart className="h-3.5 w-3.5" />
                  Heart Frame
                </button>
                <button
                  type="button"
                  onClick={() => setQrStyle('square')}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                    qrStyle === 'square'
                      ? 'bg-[#FAD2DF] text-[#4B3434] shadow-xs'
                      : 'text-[#7A5E5E] hover:text-[#4B3434]'
                  }`}
                >
                  <QrCode className="h-3.5 w-3.5" />
                  Classic Square
                </button>
              </div>

              {/* Scannable QR Card Preview */}
              <div className="mt-4 rounded-2xl border-2 border-[#4B3434] bg-white px-6 py-5 shadow-md">
                {qrMatrix ? (
                  qrStyle === 'heart' ? (
                    <svg
                      viewBox="0 0 360 350"
                      className="mx-auto h-60 w-60 sm:h-64 sm:w-64"
                      aria-label="Scannable pink heart QR code"
                    >
                      <rect width="360" height="350" fill="#FFFFFF" />
                      {/* Decorative Heart Lobes Outside Quiet Zone */}
                      {heartLobeDots.map((dot, idx) => (
                        <rect
                          key={idx}
                          x={dot.x}
                          y={dot.y}
                          width={dot.size}
                          height={dot.size}
                          rx="1.5"
                          fill="#D15581"
                        />
                      ))}

                      {/* Intact Real QR Matrix Rotated -45deg with Generous White Quiet Zone */}
                      <g transform="translate(180, 198) rotate(-45)">
                        <rect
                          x={-106}
                          y={-106}
                          width={212}
                          height={212}
                          rx="6"
                          fill="#FFFFFF"
                        />
                        {Array.from({ length: qrMatrix.size }).map((_, r) =>
                          Array.from({ length: qrMatrix.size }).map((__, c) => {
                            if (!qrMatrix.data[r * qrMatrix.size + c]) {
                              return null;
                            }
                            const cellSize = 176 / qrMatrix.size;
                            return (
                              <rect
                                key={`${r}-${c}`}
                                x={-88 + c * cellSize}
                                y={-88 + r * cellSize}
                                width={cellSize + 0.15}
                                height={cellSize + 0.15}
                                fill="#B62458"
                              />
                            );
                          })
                        )}
                      </g>
                    </svg>
                  ) : (
                    <svg
                      viewBox={`0 0 ${qrMatrix.size + 4} ${qrMatrix.size + 4}`}
                      className="mx-auto h-56 w-56 sm:h-60 sm:w-60"
                      aria-label="Scannable pink square QR code"
                    >
                      <rect
                        width={qrMatrix.size + 4}
                        height={qrMatrix.size + 4}
                        fill="#FFFFFF"
                      />
                      {Array.from({ length: qrMatrix.size }).map((_, r) =>
                        Array.from({ length: qrMatrix.size }).map((__, c) => {
                          if (!qrMatrix.data[r * qrMatrix.size + c]) {
                            return null;
                          }
                          return (
                            <rect
                              key={`${r}-${c}`}
                              x={c + 2}
                              y={r + 2}
                              width="1.02"
                              height="1.02"
                              fill="#B62458"
                            />
                          );
                        })
                      )}
                    </svg>
                  )
                ) : (
                  <p className="py-10 text-xs font-semibold text-[#9C2E4B]">
                    Enter a valid link below to generate QR code.
                  </p>
                )}

                {qrCaption.trim() && (
                  <p className="mt-1.5 text-sm font-bold tracking-wide text-[#9C2E4B]">
                    {qrCaption}
                  </p>
                )}
              </div>

              {/* Target Link & Caption Inputs */}
              <div className="mt-4 w-full max-w-[460px] space-y-2.5 text-left">
                <div>
                  <label className="block text-[11px] font-bold text-[#6E5353]">
                    Link encoded in QR code
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="url"
                      value={qrUrl}
                      onChange={(e) => setQrUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-[#D9C2AC] bg-white px-3 py-1.5 text-xs font-semibold text-[#4B3434] focus:border-[#4B3434] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-xl border border-[#4B3434] bg-[#DCE6C2] px-3 py-1.5 text-xs font-bold text-[#4B3434] hover:bg-[#cfddaf]"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-[#6E5353]">
                      Card caption
                    </label>
                    <input
                      type="text"
                      value={qrCaption}
                      onChange={(e) => setQrCaption(e.target.value)}
                      placeholder="Open when alone ♡"
                      className="mt-1 w-full rounded-xl border border-[#D9C2AC] bg-white px-3 py-1.5 text-xs font-semibold text-[#4B3434] focus:border-[#4B3434] focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadPng}
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-[#4B3434] bg-[#FAD2DF] px-4 py-1.5 text-xs font-bold text-[#4B3434] shadow-[0_2px_0_#4B3434] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download PNG
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'photos' && (
            <div>
              <p className="text-xs font-semibold text-[#7A5E5E]">
                Upload up to 8 custom portraits for the Perfect Match grid (stored locally in your browser).
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {CARD_SLOTS.map((slot) => {
                  const photo = draft.customPhotos[slot.id];
                  return (
                    <div
                      key={slot.id}
                      className="flex flex-col items-center rounded-xl border border-[#D9C2AC] bg-[#FFF8F3] p-2.5"
                    >
                      <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-lg border border-[#4B3434]/30 bg-white">
                        {photo ? (
                          <img
                            src={photo}
                            alt={slot.label}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[11px] font-bold text-[#9C7878]">
                            Default Art
                          </span>
                        )}
                      </div>
                      <span className="mt-1.5 text-[11px] font-bold text-[#4B3434]">
                        {slot.label}
                      </span>
                      <div className="mt-1.5 flex items-center gap-1">
                        <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-[#4B3434] bg-[#FAD2DF] px-2 py-1 text-[10px] font-bold text-[#4B3434] hover:bg-[#f6bfd1]">
                          <Upload className="h-3 w-3" />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              e.target.value = ''; // allow re-picking the same file
                              if (file) handlePhotoUpload(slot.id, file);
                            }}
                          />
                        </label>
                        {photo && (
                          <button
                            type="button"
                            onClick={() =>
                              setDraft((prev) => {
                                const nextPhotos = { ...prev.customPhotos };
                                delete nextPhotos[slot.id];
                                return { ...prev, customPhotos: nextPhotos };
                              })
                            }
                            aria-label={`Reset ${slot.label} photo`}
                            className="cursor-pointer rounded-md border border-[#4B3434]/50 bg-white px-1.5 py-1 text-[10px] font-bold text-[#6E5353]"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'letter' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4B3434]">
                  Game Target Badge
                </label>
                <input
                  type="text"
                  value={draft.recipientBadge}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, recipientBadge: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#D9C2AC] bg-white px-3 py-2 text-sm font-semibold text-[#4B3434] focus:border-[#4B3434] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B3434]">
                  Reveal Headline
                </label>
                <input
                  type="text"
                  value={draft.modalHeadline}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, modalHeadline: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#D9C2AC] bg-white px-3 py-2 text-sm font-semibold text-[#4B3434] focus:border-[#4B3434] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B3434]">
                  Letter Body (separate paragraphs with a blank line)
                </label>
                <textarea
                  rows={5}
                  value={letterText}
                  onChange={(e) => setLetterText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D9C2AC] bg-white px-3 py-2 text-sm font-medium text-[#4B3434] focus:border-[#4B3434] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B3434]">
                  Letter Signature
                </label>
                <input
                  type="text"
                  value={draft.letterSignature}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, letterSignature: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#D9C2AC] bg-white px-3 py-2 text-sm font-semibold text-[#4B3434] focus:border-[#4B3434] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B3434]">
                  Reveal Message
                </label>
                <textarea
                  rows={3}
                  value={draft.modalMessage}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, modalMessage: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#D9C2AC] bg-white px-3 py-2 text-sm font-medium text-[#4B3434] focus:border-[#4B3434] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B3434]">
                  Tulip Notes (6)
                </label>
                <div className="mt-1 grid gap-2 sm:grid-cols-2">
                  {draft.tulipNotes.map((note, i) => (
                    <input
                      key={i}
                      type="text"
                      value={note}
                      aria-label={`Tulip note ${i + 1}`}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          tulipNotes: d.tulipNotes.map((n, j) =>
                            j === i ? e.target.value : n
                          ),
                        }))
                      }
                      className="w-full rounded-xl border border-[#D9C2AC] bg-white px-3 py-2 text-sm font-semibold text-[#4B3434] focus:border-[#4B3434] focus:outline-none"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#EADAD5] bg-[#FFF8F3] px-5 py-3">
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#7A5E5E] hover:bg-[#F3E6E2]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-[#4B3434] bg-white px-4 py-1.5 text-xs font-bold text-[#4B3434] hover:bg-[#F7EFEA]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="cursor-pointer rounded-xl border-[1.5px] border-[#4B3434] bg-[#CFE0AA] px-5 py-1.5 text-xs font-bold text-[#4B3434] shadow-[0_2px_0_#4B3434] hover:-translate-y-0.5"
            >
              Save Changes ♡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
