/**
 * SuspectCard -- one crew member on the Evidence Board / Final
 * Accusation screen. Original hand-drawn line icons (no image assets,
 * matching RoomCard) stand in for a portrait.
 *
 * `unlocked` gates whether the clue is legible or shown as redacted.
 * `selectable` + `selected` + `onSelect` turn the card into a pickable
 * suspect for the Final Accusation screen; omit them to render a
 * read-only card for the Evidence Board.
 */
import { playClick } from "../lib/sound.js";

const SUSPECT_ICONS = {
  cook: (
    <path d="M8 10a4 4 0 0 1 8 0c1.7.3 3 1.7 3 3.4 0 1.9-1.6 3.4-3.6 3.4H8.6C6.6 16.8 5 15.3 5 13.4 5 11.7 6.3 10.3 8 10ZM9 20h6" />
  ),
  clerk: (
    <path d="M7 4h10v16H7V4Zm3-1h4v2h-4V3Zm-1 7h6M9 13h6M9 16h4" />
  ),
  guard: (
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3ZM9.5 12l1.8 1.8L15 10" />
  ),
  hauler: (
    <path d="M3 8l9-4 9 4-9 4-9-4Zm0 0v9l9 4 9-4V8M12 12v9" />
  ),
  researcher: (
    <path d="M10 3h4M11 3v6l-5.5 9a2 2 0 0 0 1.7 3h9.6a2 2 0 0 0 1.7-3L13 9V3M9 15h6" />
  ),
};

export default function SuspectCard({
  suspect,
  selectable = false,
  selected = false,
  onSelect,
}) {
  const icon = SUSPECT_ICONS[suspect.id];
  const Wrapper = selectable ? "button" : "div";

  return (
    <Wrapper
      type={selectable ? "button" : undefined}
      onClick={
        selectable
          ? () => {
              playClick();
              onSelect?.(suspect);
            }
          : undefined
      }
      className={`group relative w-full rounded-chunky border p-5 text-left font-body transition-all duration-150 ${
        selected
          ? "border-signal bg-signal/10 shadow-panel-sm"
          : "border-panel-line bg-panel shadow-panel hover:-translate-y-0.5"
      } ${selectable ? "cursor-pointer" : ""}`}
    >
      {selected && (
        <span className="absolute right-4 top-4 rounded-full bg-signal px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide text-void">
          Accused
        </span>
      )}

      <div className="flex items-center gap-4">
        <span
          className={`grid h-14 w-14 shrink-0 place-items-center rounded-chunky ${
            selected ? "bg-signal/25 text-signal" : "bg-signal/15 text-signal"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            {icon}
          </svg>
        </span>

        <div>
          <h3 className="font-display text-lg text-paper">{suspect.name}</h3>
          <p className="text-sm text-paper-dim">{suspect.role}</p>
        </div>
      </div>

      <div className="mt-4 rounded-chunky border border-panel-line bg-void/40 px-4 py-3">
        {suspect.unlocked ? (
          <p className="font-body text-sm text-paper">{suspect.clue}</p>
        ) : (
          <p className="font-mono text-xs uppercase tracking-wide text-paper-dim">
            Clue locked -- clear this suspect's room first
          </p>
        )}
      </div>
    </Wrapper>
  );
}
