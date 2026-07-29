import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuspectAvatar from "../components/SuspectAvatar.jsx";
import { PLAYER_COLORS } from "../components/AmongUsAvatar.jsx";
import FlagModal from "../components/FlagModal.jsx";
import ResponsiveBackground from "../components/ResponsiveBackground.jsx";
import { useGame } from "../state/GameContext.jsx";
import { api } from "../api/client.js";
import { playClick, playError } from "../lib/sound.js";

export default function FinalAccusation() {
  const navigate = useNavigate();
  const { solveCase } = useGame();

  const [briefing, setBriefing] = useState(null);
  const [suspects, setSuspects] = useState(null);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [wonFlag, setWonFlag] = useState(null);
  // Tapping one suspect's card pops their single testimony card up on top.
  const [openSuspect, setOpenSuspect] = useState(null);
  // The chat icon opens every suspect's testimony at once.
  const [showTestimony, setShowTestimony] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getMission("evidence-room"), api.getEvidence()])
      .then(([mission, evidence]) => {
        if (cancelled) return;
        setBriefing(mission);
        setSuspects(evidence);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allUnlocked = suspects != null && suspects.every((s) => s.unlocked);

  // Stable color per suspect, based on their position in the roster.
  const colorForIndex = (index) => PLAYER_COLORS[index % PLAYER_COLORS.length];

  async function handleAccuse() {
    if (!selectedId) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await api.submitFinalAccusation(selectedId);
      setResult(res);
      if (res.correct) {
        solveCase(res.flag);
        setWonFlag(res.flag);
      } else {
        playError();
      }
    } catch (err) {
      setResult({
        correct: false,
        message: `Couldn't reach the station's systems (${err.message}).`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <ResponsiveBackground
        as="main"
        portrait="/images/final-accusation-bg.webp"
        landscape="/images/final-accusation-bg-landscape.webp"
        className="flex min-h-screen items-center justify-center px-5"
      >
        <div className="max-w-sm rounded-2xl border border-red-200 bg-white p-5 text-center font-body text-sm text-red-500 shadow-sm">
          Couldn't load the accusation screen ({error}).
          <button
            type="button"
            onClick={() => navigate("/evidence")}
            className="mt-4 block w-full rounded-lg bg-[#1c2540] py-2 font-body text-sm font-semibold text-white"
          >
            Back to Evidence Board
          </button>
        </div>
      </ResponsiveBackground>
    );
  }

  if (!suspects || !briefing) {
    return (
      <ResponsiveBackground
        as="main"
        portrait="/images/final-accusation-bg.webp"
        landscape="/images/final-accusation-bg-landscape.webp"
        className="flex min-h-screen items-center justify-center px-5"
      >
        <div className="h-72 w-full max-w-sm animate-pulse rounded-2xl bg-white/60" />
      </ResponsiveBackground>
    );
  }

  if (!allUnlocked) {
    return (
      <ResponsiveBackground
        as="main"
        portrait="/images/final-accusation-bg.webp"
        landscape="/images/final-accusation-bg-landscape.webp"
        className="flex min-h-screen items-center justify-center px-5"
      >
        <div className="max-w-sm rounded-2xl border border-amber-200 bg-white p-5 text-center font-body text-sm text-amber-600 shadow-sm">
          You still have unsolved rooms. Clear every mission before your
          final accusation.
          <button
            type="button"
            onClick={() => navigate("/evidence")}
            className="mt-4 block w-full rounded-lg bg-[#1c2540] py-2 font-body text-sm font-semibold text-white"
          >
            Back to Evidence Board
          </button>
        </div>
      </ResponsiveBackground>
    );
  }

  const selectedSuspect = suspects.find((s) => s.id === selectedId) ?? null;

  return (
    <ResponsiveBackground
      as="main"
      portrait="/images/final-accusation-bg.webp"
      landscape="/images/final-accusation-bg-landscape.webp"
      className="relative flex h-screen flex-col overflow-hidden bg-fixed px-5 py-6"
    >
      {/* dark scrim so the flame art stays readable behind the panel */}
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative mx-auto flex h-full w-full max-w-2xl flex-col justify-center px-2 sm:px-4 landscape:max-w-4xl">
        {/*
          VOTING PANEL -- sizing cheat sheet (tweak these yourself later):
            - mt-8 / sm:mt-12       -> how far below dead-center the panel
                                       sits. 0 = perfectly centered, bigger
                                       number = further down (but it's
                                       staying well clear of the bottom).
            - px-2 / sm:px-4 (on the wrapper div right above) -> the side
              MARGIN between the panel and the screen edges. The panel
              itself has no max-width anymore, so it stretches to fill
              whatever's left -- shrink/grow this padding to make the
              margin tighter/looser.
            - p-4 / sm:p-5          -> inner padding, i.e. breathing room
                                       between the panel edge and the cards.
            - rounded-xl             -> corner roundness -- kept tighter
                                       than before for a crisper, more
                                       squared-off edge.
          Height still comes purely from content (10 suspect rows +
          buttons), never stretched to fill the viewport.
        */}
        <div className="relative mt-8 flex flex-col overflow-hidden border-[3px] border-black bg-white p-4 shadow-[6px_6px_0_0_#000] sm:mt-12 sm:p-5 landscape:mt-4 landscape:p-6">
          {/* flat, crisp card color -- no glass/gloss overlay, so edges
              stay sharp instead of hazy */}

          <div className="relative flex items-center justify-center pb-3">
            <h1 className="font-display text-lg font-black uppercase tracking-wide text-black sm:text-2xl">
              Who Is The Impostor?
            </h1>
            <button
              type="button"
              onClick={() => setShowTestimony(true)}
              aria-label="View discussion"
              className="absolute right-0 grid h-9 w-9 place-items-center border-[3px] border-black bg-white text-black shadow-[3px_3px_0_0_#000] sm:h-10 sm:w-10"
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
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </button>
          </div>

          {/*
            2-COLUMN SUSPECT GRID -- sizing cheat sheet:
              - gap-x-4 gap-y-4     -> spacing between the row cards.
              - h-16 / sm:h-[4.5rem] (on each button below) -> ROW card
                height. Raise this if you want taller rows.
              - sizeClassName on <SuspectAvatar> below         -> avatar
                size. It's intentionally bigger than the row (h-16 row vs
                h-20 avatar) so the character art bleeds off the top/
                bottom of the card, same as the reference.
              - "-ml-9" / "-mr-9"    -> how far the avatar overlaps
                *outside* the card's outer edge. Bigger negative margin
                pushes it further out.
          */}
          <div className="relative grid grid-cols-2 gap-x-4 gap-y-4 py-1 landscape:grid-cols-3 landscape:gap-x-5">
            {suspects.map((suspect, i) => {
              const selected = selectedId === suspect.id;
              return (
                <button
                  key={suspect.id}
                  type="button"
                  onClick={() => {
                    playClick();
                    setSelectedId(suspect.id);
                    setOpenSuspect(suspect);
                  }}
                  className={`flex h-16 flex-row items-center border-[3px] bg-white pl-10 pr-3 transition sm:h-[4.5rem] ${
                    selected
                      ? "border-black bg-[#FF3C32]/15 shadow-[3px_3px_0_0_#FF3C32]"
                      : "border-black shadow-[3px_3px_0_0_#000]"
                  }`}
                >
                  {/* no circle wrapper anymore -- the character art
                      itself (already transparent-background PNG) just
                      overlaps the card edge, like the reference art */}
                  <SuspectAvatar
                    suspect={suspect}
                    color={colorForIndex(i)}
                    sizeClassName="relative z-10 -ml-9 h-20 w-20 flex-shrink-0 sm:h-24 sm:w-24"
                    textClassName="text-lg sm:text-xl"
                  />
                  <span className="flex-1 truncate text-left font-body text-xs font-semibold text-black sm:text-sm">
                    {suspect.name}
                  </span>
                </button>
              );
            })}
          </div>

          {result && !result.correct && (
            <div className="relative mt-3 border-[3px] border-black bg-[#FFC24B] px-3 py-2 font-display text-xs font-bold uppercase tracking-wide text-black shadow-[3px_3px_0_0_#000] sm:text-sm">
              {result.message}
            </div>
          )}

          {/* skip vote, same spot as the reference */}
          <div className="relative mt-3 flex items-center">
            <button
              type="button"
              onClick={() => {
                playClick();
                navigate("/evidence");
              }}
              className="border-[3px] border-black bg-[#2b2b2b] px-4 py-2 font-display text-xs font-black uppercase tracking-wide text-white shadow-[3px_3px_0_0_#000] transition-transform hover:scale-[1.02] active:translate-y-[2px] active:shadow-none sm:text-sm"
            >
              SKIP VOTE
            </button>
          </div>
        </div>

        {selectedSuspect && (
          <button
            type="button"
            disabled={submitting}
            onClick={handleAccuse}
            className="mt-4 w-full border-[3px] border-black bg-[#FF3C32] py-3 font-display text-sm font-black uppercase tracking-wide text-black shadow-[4px_4px_0_0_#000] transition-transform hover:scale-[1.02] active:translate-y-[2px] active:shadow-none disabled:opacity-60 sm:py-3.5 sm:text-base"
          >
            {submitting ? "Confirming..." : `Confirm Vote: ${selectedSuspect.name}`}
          </button>
        )}
      </div>

      {/* single testimony card -- pops up on top of a blurred backdrop when
          a suspect is tapped */}
      {openSuspect && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm"
          onClick={() => setOpenSuspect(null)}
        >
          <div
            className="flex w-full max-w-md items-center gap-4 border-[3px] border-black bg-[#FFE9C7] p-4 shadow-[6px_6px_0_0_#000] sm:max-w-lg sm:gap-5 sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <SuspectAvatar
              suspect={openSuspect}
              color={colorForIndex(suspects.findIndex((s) => s.id === openSuspect.id))}
              sizeClassName="h-14 w-14 flex-shrink-0 border-[3px] border-black sm:h-16 sm:w-16"
              textClassName="text-lg sm:text-xl"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-black uppercase tracking-wide text-black sm:text-base">
                {openSuspect.name}
              </p>
              <p className="mt-1 break-words font-body text-xs leading-snug text-black/80 sm:text-sm">
                {openSuspect.unlocked ? openSuspect.clue : "Testimony locked"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* full testimony list -- opened from the chat icon, same blurred
          backdrop, full-width cards */}
      {showTestimony && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm"
          onClick={() => setShowTestimony(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-md overflow-y-auto border-[3px] border-black bg-[#FFE9C7] p-4 shadow-[6px_6px_0_0_#000] sm:max-w-lg sm:p-5 landscape:max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-black uppercase tracking-wide text-black sm:text-xl">
                Discussion
              </h2>
              <button
                type="button"
                onClick={() => setShowTestimony(false)}
                aria-label="Close"
                className="grid h-8 w-8 flex-shrink-0 place-items-center border-[3px] border-black bg-[#FF3C32] text-black shadow-[3px_3px_0_0_#000] transition-transform hover:scale-[1.02] active:translate-y-[2px] active:shadow-none"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 py-1 landscape:grid landscape:grid-cols-2 landscape:gap-4 landscape:space-y-0">
              {suspects.map((suspect, i) => {
                const avatarOnRight = i % 2 === 0;
                return (
                  <div
                    key={suspect.id}
                    className={`flex min-h-[4.5rem] items-center gap-2 border-[3px] border-black bg-[#F4F6FF] py-2 shadow-[3px_3px_0_0_#000] sm:min-h-[5rem] ${
                      avatarOnRight
                        ? "flex-row-reverse pl-3 pr-10 text-right"
                        : "flex-row pl-10 pr-3"
                    }`}
                  >
                    <SuspectAvatar
                      suspect={suspect}
                      color={colorForIndex(i)}
                      sizeClassName={`relative z-10 h-20 w-20 flex-shrink-0 self-start sm:h-24 sm:w-24 ${
                        avatarOnRight ? "-mr-9" : "-ml-9"
                      }`}
                      textClassName="text-lg sm:text-xl"
                    />
                    <p className="min-w-0 flex-1 break-words font-body text-xs leading-snug text-black/85 sm:text-sm">
                      {suspect.unlocked ? suspect.clue : "Testimony locked"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {wonFlag && (
        <FlagModal flag={wonFlag} onClose={() => navigate("/victory")} />
      )}
    </ResponsiveBackground>
  );
}
