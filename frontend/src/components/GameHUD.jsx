import { NavLink } from "react-router-dom";
import { useGame } from "../state/GameContext.jsx";
import { playClick, toggleMute, useMuted } from "../lib/sound.js";

const TOTAL_MISSIONS = 5; // Cafeteria, Admin, Security, Storage, Laboratory (Evidence Room is the finale, not counted here)

function SpeakerIcon({ muted }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      {muted ? <path d="M17 9l4 6M21 9l-4 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7" />}
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Z" />
      <path d="M9 3v16M15 5v16" />
    </svg>
  );
}

function EvidenceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

/**
 * Among Us-style HUD: no single strip anywhere. Each control is its
 * own big chunky pill/circle, pinned to its own corner the way the
 * real game spreads USE / REPORT / map / settings across the screen
 * instead of grouping them into a bar.
 *
 *   top-left     -> home + mute (small, out of the way)
 *   top-right    -> mission progress chip
 *   bottom-left  -> Evidence (big round button)
 *   bottom-right -> Map (big round button, the "primary" action)
 */
export default function GameHUD() {
  const { completedMissions } = useGame();
  const muted = useMuted();

  const progress = completedMissions.filter((id) => id !== "evidence-room").length;

  const bigButton = ({ isActive } = {}) =>
    `pointer-events-auto grid h-16 w-16 place-items-center border-[3px] border-black font-display transition-all duration-150 hover:scale-[1.02] active:translate-y-[2px] active:shadow-none sm:h-20 sm:w-20 ${
      isActive
        ? "bg-black text-[#FF3C32] shadow-[4px_4px_0_0_#000]"
        : "bg-[#FF3C32] text-black shadow-[4px_4px_0_0_#000]"
    }`;

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {/* top-left: home + mute */}
      <div className="pointer-events-auto absolute left-4 top-4 flex items-center gap-2 sm:left-5 sm:top-5">
        <NavLink
          to="/"
          onClick={playClick}
          className="grid h-11 w-11 place-items-center border-[3px] border-black bg-[#FF3C32] font-display text-lg font-extrabold text-black shadow-[3px_3px_0_0_#000] transition-all duration-150 hover:scale-[1.02] active:translate-y-[2px] active:shadow-none"
          aria-label="Back to Home"
        >
          !
        </NavLink>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
          aria-pressed={muted}
          className="grid h-11 w-11 place-items-center border-[3px] border-black bg-[#FF3C32] text-black shadow-[3px_3px_0_0_#000] transition-all duration-150 hover:scale-[1.02] active:translate-y-[2px] active:shadow-none"
        >
          <SpeakerIcon muted={muted} />
        </button>
      </div>

      {/* top-right: progress chip */}
      <div className="pointer-events-auto absolute right-4 top-4 sm:right-5 sm:top-5">
        <span className="block border-[3px] border-black bg-[#160505]/90 px-4 py-2 font-mono text-sm text-white shadow-[3px_3px_0_0_#000]">
          {progress}/{TOTAL_MISSIONS}
        </span>
      </div>

      {/* bottom-left: Evidence */}
      <div className="absolute bottom-6 left-4 flex flex-col items-center gap-1 sm:bottom-8 sm:left-8">
        <NavLink to="/evidence" onClick={playClick} className={bigButton} aria-label="Evidence">
          <EvidenceIcon />
        </NavLink>
        <span className="pointer-events-none border-[2px] border-black bg-[#FF3C32] px-2 py-0.5 font-display text-[11px] font-bold text-black shadow-[2px_2px_0_0_#000] sm:text-xs">
          Evidence
        </span>
      </div>

      {/* bottom-right: Map (primary action, biggest button) */}
      <div className="absolute bottom-6 right-4 flex flex-col items-center gap-1 sm:bottom-8 sm:right-8">
        <NavLink to="/facility" onClick={playClick} className={bigButton} aria-label="Map">
          <MapIcon />
        </NavLink>
        <span className="pointer-events-none border-[2px] border-black bg-[#FF3C32] px-2 py-0.5 font-display text-[11px] font-bold text-black shadow-[2px_2px_0_0_#000] sm:text-xs">
          Map
        </span>
      </div>
    </div>
  );
}
