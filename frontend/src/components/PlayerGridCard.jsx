/**
 * PlayerGridCard -- one tile in the Final Accusation roster grid.
 * Shows only the crewmate's avatar + name (their testimony is hidden
 * until the player taps in to the chat view via SuspectChatView).
 * Mirrors the "Who Is The Impostor?" vote grid: a clean tappable
 * card per player, with a check badge once that player has been
 * marked as the chosen infiltrator.
 */
import AmongUsAvatar from "./AmongUsAvatar.jsx";
import { playClick } from "../lib/sound.js";

export default function PlayerGridCard({ suspect, color, selected = false, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => {
        playClick();
        onOpen?.(suspect);
      }}
      className={`group relative flex w-full items-center gap-3 rounded-chunky border p-3 text-left transition-all duration-150 ${
        selected
          ? "border-signal bg-signal/10 shadow-panel-sm"
          : "border-panel-line bg-panel-raised shadow-panel hover:-translate-y-0.5 hover:border-signal/50"
      }`}
    >
      {selected && (
        <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-signal text-void shadow-panel-sm">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M4 10l4 4 8-9" />
          </svg>
        </span>
      )}

      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-void/40">
        <AmongUsAvatar color={color} size={40} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-sm text-paper">
          {suspect.name}
        </span>
        <span className="block truncate font-mono text-[11px] uppercase tracking-wide text-paper-dim">
          {suspect.role}
        </span>
      </span>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0 text-paper-dim transition-transform group-hover:translate-x-0.5 group-hover:text-signal"
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}
