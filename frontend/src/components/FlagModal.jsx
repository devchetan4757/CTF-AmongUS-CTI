import { useEffect, useState } from "react";
import { playSuccess } from "../lib/sound.js";

/**
 * FlagModal -- the "you got it" celebration that pops the moment a
 * correct final accusation lands, before the player continues on to
 * the Victory screen. Restyled in Phase 6 to use the game's actual
 * design tokens instead of default Tailwind slate/blue/green.
 * Phase 7 adds the success chime on mount.
 */
export default function FlagModal({ flag, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    playSuccess();
  }, []);

  const copyFlag = async () => {
    try {
      await navigator.clipboard.writeText(flag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg border-[3px] border-black bg-[#EAF2FF] p-6 shadow-[8px_8px_0_0_#000] sm:p-8">
        <div className="mx-auto mb-5 grid h-20 w-20 -rotate-3 place-items-center border-[3px] border-black bg-[#FF3C32] shadow-[4px_4px_0_0_#000]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-9 w-9"
            aria-hidden="true"
          >
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
        </div>

        <h2 className="text-center font-display text-2xl font-black uppercase tracking-wide text-black sm:text-3xl">
          Infiltrator Identified!
        </h2>

        <p className="mt-3 text-center font-body text-sm text-black/70">
          Outstanding work, Detective. You collected every clue,
          exposed the infiltrator, and secured the station.
        </p>

        <div className="mt-8 border-[3px] border-dashed border-black bg-white p-5">
          <code className="block break-all text-center font-mono text-lg font-bold text-[#1D4ED8]">
            {flag}
          </code>
        </div>

        <button
          type="button"
          onClick={copyFlag}
          className="mt-6 w-full border-[3px] border-black bg-white py-3 font-display text-sm font-black uppercase tracking-wide text-black shadow-[3px_3px_0_0_#000] transition-transform hover:scale-[1.02] active:translate-y-[2px] active:shadow-none"
        >
          {copied ? "✓ Copied!" : "Copy Flag"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full border-[3px] border-black bg-[#1D4ED8] py-3 font-display text-sm font-black uppercase tracking-wide text-white shadow-[3px_3px_0_0_#000] transition-transform hover:scale-[1.02] active:translate-y-[2px] active:shadow-none"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
