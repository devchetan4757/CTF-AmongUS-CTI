import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGame } from "../state/GameContext.jsx";
import { playClick, playFanfare } from "../lib/sound.js";
import ResponsiveBackground from "../components/ResponsiveBackground.jsx";

export default function Victory() {
  const { caseSolved, resetProgress } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (caseSolved) playFanfare();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once on landing, not on every caseSolved re-render
  }, []);

  async function playAgain() {
    playClick();
    await resetProgress();
    navigate("/");
  }

  if (!caseSolved) {
    return (
      <ResponsiveBackground
        as="main"
        portrait="/images/victory-bg.png"
        landscape="/images/victory-bg-landscape.png"
        className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black px-5"
      >
        {/* Same dark scrim as the win state, but no red glow -- this is
            a locked/pending state, not a celebration. */}
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative mx-auto flex w-full max-w-md flex-col items-center text-center">
          {/* Sticker-style badge, same shape language as "Case Closed"
              but in caution amber to read as "not yet". */}
          <span className="rotate-3 border-[3px] border-black bg-[#FFC24B] px-4 py-1 font-display text-xs font-bold uppercase tracking-[0.15em] text-black shadow-[3px_3px_0_0_#000]">
            Case Not Closed
          </span>

          <div
            aria-hidden="true"
            className="mt-6 grid h-16 w-16 place-items-center rounded-full border-[3px] border-black bg-[#FFC24B] shadow-[3px_3px_0_0_#000]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
            >
              <rect x="5" y="11" width="14" height="9" rx="1.5" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </div>

          <h1
            className="mt-5 font-display text-3xl uppercase text-white sm:text-4xl"
            style={{
              WebkitTextStroke: "2px black",
              textShadow: "4px 4px 0 #000",
            }}
          >
            The Case Isn't Closed Yet
          </h1>

          <p className="mx-auto mt-4 max-w-sm font-body text-sm text-white/90 [text-shadow:1px_1px_2px_rgba(0,0,0,0.9)]">
            You haven't named the infiltrator yet -- head back to the
            Evidence Board to review the clues before you can see how
            it ends.
          </p>

          <Link
            to="/evidence"
            className="mt-8 border-[3px] border-black bg-[#FFC24B] px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-black shadow-[4px_4px_0_0_#000] transition-transform hover:scale-[1.02] active:translate-y-[2px] active:shadow-none"
          >
            Go to Evidence Board
          </Link>
        </div>
      </ResponsiveBackground>
    );
  }

  return (
    <ResponsiveBackground
      as="main"
      portrait="/images/victory-bg.png"
      landscape="/images/victory-bg-landscape.png"
      className="relative min-h-[100dvh] overflow-hidden bg-black"
    >
      {/* Dark scrim so the red glow reads through but text stays legible */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Faint pulsing red vignette instead of the old sci-fi scanner sweep */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-pulse-glow bg-[radial-gradient(ellipse_at_center,rgba(255,60,50,0.25),transparent_65%)]"
      />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-2xl flex-col items-center justify-end px-5 pb-14 pt-24 text-center sm:justify-center sm:pb-16">
        {/* Sticker-style badge, tilted, thick black outline -- not a soft rounded chip */}
        <span className="-rotate-3 border-[3px] border-black bg-[#FF3C32] px-4 py-1 font-display text-xs font-bold uppercase tracking-[0.15em] text-black shadow-[3px_3px_0_0_#000]">
          Case Closed
        </span>

        <h1
          className="mt-5 font-display text-4xl uppercase text-white sm:text-5xl"
          style={{
            WebkitTextStroke: "2px black",
            textShadow: "4px 4px 0 #000, 0 0 24px rgba(255,60,50,0.6)",
          }}
        >
          The Station Is Safe
        </h1>

        <p className="mx-auto mt-5 max-w-md font-body text-sm text-white/90 [text-shadow:1px_1px_2px_rgba(0,0,0,0.9)]">
          The corridor camera logs, the forged edits, the altered sample
          -- every piece pointed the same direction. With the infiltrator
          exposed and confined, the crew can finally stand down from
          lockdown. Nice work, Detective.
        </p>

        <div className="mx-auto mt-10 w-full max-w-md border-[3px] border-black bg-[#160505]/90 p-6 shadow-[6px_6px_0_0_#000]">
          <p className="font-mono text-xs uppercase tracking-wide text-[#FF3C32]">
            Detective's Note
          </p>
          <p className="mt-3 font-body text-sm leading-relaxed text-white/90">
            Every good detective doubts themselves at some point --
            the evidence that doesn't add up, the alibi that almost
            holds. What sets the great ones apart is staying with it
            anyway. You did. Take the win.
          </p>
        </div>

        <button
          type="button"
          onClick={playAgain}
          className="mt-8 border-[3px] border-black bg-[#FF3C32] px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-black shadow-[4px_4px_0_0_#000] transition-transform hover:scale-[1.02] active:translate-y-[2px] active:shadow-none"
        >
          Play Again
        </button>
      </div>
    </ResponsiveBackground>
  );
}
