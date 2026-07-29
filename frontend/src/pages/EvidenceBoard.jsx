import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { playClick } from "../lib/sound.js";
import ResponsiveBackground from "../components/ResponsiveBackground.jsx";

export default function EvidenceBoard() {
  const [suspects, setSuspects] = useState(null);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    api
      .getEvidence()
      .then((data) => {
        if (!cancelled) setSuspects(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Reveal evidence entries one by one.
  useEffect(() => {
    if (!suspects || visibleCount >= suspects.length) return;

    const timer = setTimeout(() => {
      setVisibleCount((v) => v + 1);
    }, 600);

    return () => clearTimeout(timer);
  }, [suspects, visibleCount]);

  const unlockedCount =
    suspects?.filter((suspect) => suspect.unlocked).length ?? 0;

  const allUnlocked =
    suspects != null && unlockedCount === suspects.length;

  const allRevealed =
    suspects != null && visibleCount >= suspects.length;

  return (
    <ResponsiveBackground
      as="main"
      portrait="/images/evidence-bg.png"
      landscape="/images/evidence-bg-landscape.png"
      className="relative min-h-[100dvh] w-full bg-fixed"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/*
        Everything below used to be absolutely positioned with
        percentage top/left offsets (top-[18%], top-[76%], etc). That
        assumed there was always enough vertical room between the
        header and footer for however many suspects the case has --
        on a small/short screen (or a case with more suspects) the
        evidence log could run into the footer or get clipped with no
        way to scroll to it.

        This is now a normal top-to-bottom flex column instead: header,
        then the log (which just flows, taking as much height as its
        content needs), then the footer. `min-h-[100dvh]` still makes
        it fill short content up to the full screen, but if content is
        taller than the screen the page scrolls normally rather than
        overlapping.
      */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col px-5 pb-10 pt-16 sm:px-10 sm:pt-20 md:px-16 md:pt-24 landscape:max-w-5xl landscape:pt-14">
        {/* ====================================
            HEADER
        ===================================== */}

        <span className="font-display text-xl font-extrabold uppercase tracking-[0.18em] text-[#FFD93B] drop-shadow-[0_4px_6px_rgba(0,0,0,1)] sm:text-2xl md:text-3xl">
          Evidence Room
        </span>

        {error && (
          <div className="mt-6 w-full max-w-md rounded-chunky border border-alert/40 bg-alert/10 p-5 font-body text-base text-alert backdrop-blur-sm sm:text-lg">
            Couldn't reach the station's systems ({error}).
            Check that the backend is running and try again.
          </div>
        )}

        {/* ====================================
            EVIDENCE LOG
        ===================================== */}

        <div className="mt-8 w-full max-w-xl text-left sm:mt-10 md:mt-12 landscape:max-w-none">
          {/* Reduced spacing between clues; 2-column on landscape/desktop
              so the log uses the extra width instead of stacking tall */}
          <div className="flex flex-col gap-5 sm:gap-6 md:gap-7 landscape:grid landscape:grid-cols-2 landscape:gap-x-10 landscape:gap-y-6">
            {!suspects &&
              !error &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-full animate-pulse rounded-chunky bg-white/10 sm:h-20"
                />
              ))}

            {suspects &&
              suspects.map((suspect, i) => (
                <div
                  key={suspect.id}
                  className={`transition-all duration-700 ${
                    i < visibleCount
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <div
                    className={`font-display text-sm font-bold uppercase tracking-wide drop-shadow-[0_3px_5px_rgba(0,0,0,1)] sm:text-base md:text-lg ${
                      suspect.unlocked ? "text-signal" : "text-alert"
                    }`}
                  >
                    {suspect.name} &mdash; {suspect.role}
                  </div>

                  {suspect.unlocked ? (
                    <p className="mt-2 font-body text-sm leading-[1.5] text-white drop-shadow-[0_3px_5px_rgba(0,0,0,1)] sm:text-base">
                      {suspect.clue}
                    </p>
                  ) : (
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-paper-dim drop-shadow-[0_3px_5px_rgba(0,0,0,1)] sm:text-xs">
                      Clue locked &mdash; clear this suspect's room first
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* ====================================
            FOOTER
            mt-auto + the flex-col on the wrapper above keeps this
            pinned near the bottom on tall/short-content screens, but
            it's no longer pinned by a hardcoded top-% -- once the log
            grows past that space it just pushes the footer down (and
            the page scrolls) instead of the two overlapping.
        ===================================== */}

        <div
          className={`mx-auto mt-12 flex w-full max-w-xs flex-col items-center gap-4 pt-4 text-center transition-all duration-700 sm:max-w-sm ${
            allRevealed
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-90 opacity-0"
          }`}
        >
          <p className="font-body text-sm text-paper-dim drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            {allUnlocked
              ? "Every clue is in. Time to make the call."
              : `Solve the remaining ${
                  suspects ? suspects.length - unlockedCount : ""
                } room${
                  suspects && suspects.length - unlockedCount === 1 ? "" : "s"
                } to unlock the rest of the evidence.`}
          </p>

          <button
            type="button"
            disabled={!allUnlocked}
            onClick={() => {
              playClick();
              navigate("/final-accusation");
            }}
            className={`w-full max-w-[16rem] border-[3px] border-black px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wide shadow-[4px_4px_0_0_#000] transition-transform sm:max-w-xs sm:text-base ${
              allUnlocked
                ? "bg-[#FF3C32] text-black hover:scale-[1.02] active:translate-y-[2px] active:shadow-none"
                : "cursor-not-allowed bg-[#2b2b2b] text-white/60 opacity-80"
            }`}
          >
            Accuse
          </button>
          <Link
            to="/facility"
            onClick={playClick}
            className="font-body text-sm text-paper-dim drop-shadow-[0_2px_4px_rgba(0,0,0,1)] transition-colors hover:text-signal"
          >
            &larr; Back to Facility Map
          </Link>
        </div>
      </div>
    </ResponsiveBackground>
  );
}
