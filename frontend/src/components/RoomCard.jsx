/**
 * RoomCard -- a single room on the Facility Map, styled like a physical
 * console button: shadow-panel (raised) collapses to shadow-panel-sm
 * with a slight downward shift on hover/press, so picking a room feels
 * like pressing a button on the ship rather than clicking a card.
 *
 * status: "available" | "complete" | "locked"
 */
const ROOM_ICONS = {
  cafeteria: (
    <path d="M8 3v6M12 3v6M16 3v6M8 9c0 2 1 3 2 3s2-1 2-3M12 12v9M16 3c0 6-2 9-2 9s-2-3-2-9" />
  ),
  admin: (
    <path d="M4 6h16v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6ZM4 6l3-3h10l3 3M9 12h6M9 16h4" />
  ),
  security: (
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3ZM12 11v3" />
  ),
  storage: (
    <path d="M3 8l9-4 9 4-9 4-9-4Zm0 0v9l9 4 9-4V8M12 12v9" />
  ),
  laboratory: (
    <path d="M10 3h4M11 3v6l-5.5 9a2 2 0 0 0 1.7 3h9.6a2 2 0 0 0 1.7-3L13 9V3M9 15h6" />
  ),
  "evidence-room": (
    <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM16.5 16.5 21 21M9 11h4" />
  ),
};

function StatusBadge({ status }) {
  if (status === "complete") {
    return (
      <span className="rounded-full bg-signal/20 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide text-signal">
        Cleared
      </span>
    );
  }
  if (status === "locked") {
    return (
      <span className="rounded-full bg-panel-line/60 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide text-paper-dim">
        Locked
      </span>
    );
  }
  return (
    <span className="rounded-full bg-caution/20 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide text-caution">
      Unresolved
    </span>
  );
}

export default function RoomCard({ room, status, onSelect }) {
  const locked = status === "locked";
  const icon = ROOM_ICONS[room.id];

  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => onSelect(room)}
      className={`group relative w-full rounded-chunky border p-5 text-left font-body transition-all duration-150 ${
        locked
          ? "cursor-not-allowed border-panel-line/60 bg-panel/40 opacity-60"
          : "border-panel-line bg-panel shadow-panel hover:-translate-y-0 hover:translate-y-1 hover:shadow-panel-sm active:translate-y-1 active:shadow-panel-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-chunky ${
            locked ? "bg-panel-line/50 text-paper-dim" : "bg-signal/15 text-signal"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            {icon}
          </svg>
        </span>
        <StatusBadge status={status} />
      </div>

      <h3 className="mt-4 font-display text-xl text-paper">{room.room}</h3>
      <p className="mt-1 text-sm text-paper-dim">{room.title}</p>

      <div className="mt-4 flex items-center justify-between text-xs font-mono uppercase tracking-wide text-paper-dim">
        <span>{room.concept}</span>
        <span
          className={
            room.difficulty === "medium" ? "text-caution" : "text-signal"
          }
        >
          {room.difficulty}
        </span>
      </div>
    </button>
  );
}
