/**
 * SuspectChatView -- the screen that opens when a player taps a
 * suspect in the Final Accusation roster. The suspect's real
 * portrait is shown large, with their testimony rendered as a
 * speech bubble floating above their head (as if they're the one
 * saying it), rather than a chat-card message. A pill-shaped "mark
 * as infiltrator" action and a slim status bar sit below.
 *
 * Purely presentational/local state -- no network calls happen here.
 * The actual accusation submission stays in FinalAccusation.jsx.
 */
import { useEffect } from "react";
import SuspectAvatar from "./SuspectAvatar.jsx";
import { playClick } from "../lib/sound.js";

export default function SuspectChatView({
  suspect,
  color,
  isAccused,
  onBack,
  onAccuse,
  cleared = 0,
  total = 0,
  caseCode = "",
}) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onBack?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onBack]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-void/90 backdrop-blur-md sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onBack?.();
      }}
    >
      {/* floating close control -- sits over the dimmed backdrop, not on the card */}
      <button
        type="button"
        onClick={() => {
          playClick();
          onBack?.();
        }}
        aria-label="Close chat"
        className="absolute left-4 top-4 grid h-9 w-9 place-items-center border-[3px] border-black bg-white text-black shadow-[3px_3px_0_0_#000] transition-transform hover:scale-[1.05] sm:left-6 sm:top-6"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <div className="flex w-full max-w-md flex-col overflow-hidden border-[3px] border-black bg-white shadow-[6px_6px_0_0_#000]">
        {/* suspect portrait with their testimony spoken above their head */}
        <div className="flex flex-col items-center gap-4 px-4 pb-4 pt-8">
          {suspect.unlocked ? (
            <div className="relative max-w-[90%] border-[3px] border-black bg-white px-4 py-3 shadow-[3px_3px_0_0_#000]">
              <p className="font-body text-sm leading-snug text-black">
                {suspect.clue}
              </p>
              {/* speech-bubble tail pointing down toward the suspect */}
              <span className="absolute -bottom-[9px] left-8 h-4 w-4 rotate-45 border-b-[3px] border-r-[3px] border-black bg-white" />
            </div>
          ) : (
            <div className="relative max-w-[90%] border-[3px] border-dashed border-black bg-white/60 px-4 py-3">
              <p className="font-mono text-xs uppercase tracking-wide text-black/60">
                Testimony locked
              </p>
              <span className="absolute -bottom-[9px] left-8 h-4 w-4 rotate-45 border-b-[3px] border-r-[3px] border-dashed border-black bg-white/60" />
            </div>
          )}

          <div className="flex flex-col items-center gap-2">
            <SuspectAvatar suspect={suspect} color={color} size={112} />
            <span className="font-display text-sm font-black uppercase tracking-wide text-black">
              {suspect.name}
            </span>
          </div>

          {isAccused && (
            <div className="max-w-[85%] self-end border-[3px] border-black bg-[#FF3C32] px-4 py-3 shadow-[3px_3px_0_0_#000]">
              <div className="flex items-center justify-end gap-2">
                <span className="font-display text-sm font-black uppercase text-black">You</span>
              </div>
              <p className="mt-1.5 text-right font-body text-sm leading-snug text-black/80">
                Locked in -- that's our infiltrator.
              </p>
            </div>
          )}
        </div>

        {/* mark-as-infiltrator action */}
        <div className="px-4 pb-3">
          <button
            type="button"
            onClick={() => {
              playClick();
              onAccuse?.(suspect);
            }}
            disabled={!suspect.unlocked}
            className="flex w-full items-center gap-3 border-[3px] border-black bg-white px-4 py-2.5 text-left shadow-[3px_3px_0_0_#000] transition-opacity disabled:opacity-50"
          >
            <span className="flex-1 truncate font-body text-sm font-semibold text-black">
              {isAccused ? "Marked as the infiltrator" : "Tap to mark as the infiltrator"}
            </span>
            <span className="grid h-8 w-8 shrink-0 place-items-center border-[2px] border-black bg-[#FF3C32]">
              <svg viewBox="0 0 24 24" fill="#000000" className="h-4 w-4">
                <path d="M4 12l16-7-6 16-2-7-8-2Z" />
              </svg>
            </span>
          </button>
        </div>

        {/* bottom status bar */}
        <div className="flex items-center justify-between border-t-[3px] border-black px-5 py-3">
          <span className="border-[2px] border-black bg-black px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-[#FF3C32]">
            Testimony
          </span>

          <div className="text-center leading-tight">
            <p className="font-mono text-[10px] uppercase tracking-wide text-black/50">
              Case
            </p>
            <p className="font-mono text-xs font-bold text-black">
              {caseCode}
            </p>
          </div>

          <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-black">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF3C32"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <rect x="4" y="4" width="16" height="16" rx="1" />
            </svg>
            {cleared}/{total}
          </span>
        </div>
      </div>
    </div>
  );
}
