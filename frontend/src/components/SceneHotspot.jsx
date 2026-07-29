/**
 * A glowing, floating marker pinned over an interactive prop in the
 * scene art (the laptop on the cafeteria table, the crate label in
 * storage, etc). Clicking it opens that room's puzzle panel. Position
 * is percent-based (`x`/`y` from src/data/facilityScenes.js) so it
 * stays roughly over the prop regardless of viewport size.
 *
 * Each room picks an `icon` + `size` in its hotspot config so the
 * marker actually looks like what it opens instead of every room
 * showing the same laptop glyph. A hotspot can instead set `image`
 * (a path under /public, e.g. "/images/icon-vent.png") to use custom
 * artwork -- if `image` is set it wins over `icon`, no circle badge
 * or built-in SVG, just your image floating in place.
 *
 * Pass `locked` to render it as always-visible-but-not-openable: the
 * art dims, a padlock "top secret" badge stamps over the corner, and
 * clicking it does nothing (the parent shouldn't even bother wiring a
 * working onClick while locked -- see FacilityMap.jsx).
 */

// One SVG per prop type. Add a new key here + reference it from a
// room's `hotspot.icon` in facilityScenes.js to introduce a new look.
const ICONS = {
  // Green-on-black computer / crew terminal (cafeteria) -- a monitor
  // with a command prompt chevron + cursor bar so it reads as "open
  // a terminal" rather than a generic laptop.
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="1.5" />
      <path d="M7 8.5 9.8 11 7 13.5M12 13.5h4.2" />
      <path d="M9 20h6M12 17v3" />
    </>
  ),
  // Globe/site icon (admin -- crawling robots.txt + site pages)
  site: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9Z" />
    </>
  ),
  // Flask/beaker (laboratory -- sample search)
  lab: (
    <>
      <path d="M9 2h6M10 2v6.5L4.8 18a2 2 0 0 0 1.75 3h10.9a2 2 0 0 0 1.75-3L14 8.5V2" />
      <path d="M7.5 14h9" />
    </>
  ),
  // Shield (security -- login panel)
  security: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="m9.5 12 2 2 3.5-3.5" />
    </>
  ),
  // Crate (storage -- base64 label)
  storage: (
    <>
      <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
      <path d="M3 8.5V16l9 4.5 9-4.5V8.5M12 13v7.5" />
    </>
  ),
};

// Marker + icon dimensions, keyed by hotspot.size (defaults to "md").
const SIZES = {
  sm: { outer: "h-10 w-10", icon: "h-5 w-5", label: "text-[9px]" },
  md: { outer: "h-14 w-14", icon: "h-7 w-7", label: "text-[10px]" },
  lg: { outer: "h-16 w-16", icon: "h-8 w-8", label: "text-xs" },
};

// Plain image sizing (no circle badge) -- a bit bigger than the icon
// badges since there's no colored backdrop making it pop.
const IMAGE_SIZES = {
  sm: { outer: "h-12 w-12", label: "text-[9px]" },
  md: { outer: "h-16 w-16", label: "text-[10px]" },
  lg: { outer: "h-20 w-20", label: "text-xs" },
};

// Background + glow color per prop type, tuned to sit well against
// the dark scene background and against the theme's accent colors.
const THEMES = {
  // Black computer casing + phosphor-green glyph, matching the crew
  // terminal's own screen colors (#63ff9a on near-black) instead of
  // the default teal badge every other prop uses.
  terminal: {
    bg: "bg-black border-[3px] border-[#63ff9a]",
    text: "text-[#63ff9a]",
    glow: "shadow-[0_0_22px_-2px_rgba(99,255,154,0.8)]",
  },
  // Black casing + sky-blue glyph, matching AdminExplorer's own screen
  // (its header/prompt text is sky-400 / #38bdf8) so the hotspot looks
  // like a preview of the terminal it opens.
  site: {
    bg: "bg-black border-[3px] border-[#38bdf8]",
    text: "text-[#38bdf8]",
    glow: "shadow-[0_0_22px_-2px_rgba(56,189,248,0.8)]",
  },
  // Black casing + violet glyph, matching LabTerminal's own header/icon
  // color (violet-400 / #a78bfa).
  lab: {
    bg: "bg-black border-[3px] border-[#a78bfa]",
    text: "text-[#a78bfa]",
    glow: "shadow-[0_0_22px_-2px_rgba(167,139,250,0.8)]",
  },
  // Black casing + alert-red glyph, matching SecurityLogin's own header
  // color (the alert token, #FF6B5B).
  security: {
    bg: "bg-black border-[3px] border-[#FF6B5B]",
    text: "text-[#FF6B5B]",
    glow: "shadow-[0_0_22px_-2px_rgba(255,107,91,0.8)]",
  },
  // Dark crate-wood casing + caution-amber glyph, matching StorageCrate's
  // own casing (#14100a) and stencil-amber text (the caution token,
  // #FFC24B) instead of a flat amber circle.
  storage: {
    bg: "bg-[#14100a] border-[3px] border-[#FFC24B]",
    text: "text-[#FFC24B]",
    glow: "shadow-[0_0_22px_-2px_rgba(255,194,75,0.8)]",
  },
};

// Small "top secret" padlock badge, stamped over the corner of a
// locked hotspot. Dark stamp + amber lock so it reads clearly against
// any art or icon color underneath it.
function LockBadge({ size }) {
  const badgeSize = { sm: "h-5 w-5", md: "h-6 w-6", lg: "h-7 w-7" }[size] || "h-6 w-6";
  const iconSize = { sm: "h-3 w-3", md: "h-3.5 w-3.5", lg: "h-4 w-4" }[size] || "h-3.5 w-3.5";
  return (
    <span
      className={`absolute -right-1 -top-1 grid place-items-center rounded-full border border-void/60 bg-void text-caution shadow-[0_0_8px_rgba(0,0,0,0.6)] ${badgeSize}`}
      title="Top secret -- clear every room first"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconSize}
      >
        <rect x="5" y="11" width="14" height="9" rx="1.5" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    </span>
  );
}

export default function SceneHotspot({ hotspot, onClick, locked }) {
  if (hotspot.image) {
    const size = IMAGE_SIZES[hotspot.size] || IMAGE_SIZES.md;
    return (
      <button
        type="button"
        onClick={locked ? undefined : onClick}
        aria-label={locked ? `${hotspot.label} (locked)` : hotspot.label}
        aria-disabled={locked}
        style={{ left: hotspot.x, top: hotspot.y }}
        className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 ${
          locked ? "pointer-events-none cursor-default" : "pointer-events-auto animate-float"
        }`}
      >
        <span className="relative">
          <img
            src={hotspot.image}
            alt={hotspot.label}
            className={`${size.outer} object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.6)] ${
              locked ? "opacity-50 grayscale" : ""
            }`}
          />
          {locked && <LockBadge size={hotspot.size} />}
        </span>
        <span
          className={`whitespace-nowrap rounded-full bg-panel/80 px-2 py-0.5 font-mono uppercase tracking-wide backdrop-blur ${
            size.label
          } ${locked ? "text-paper-dim" : "text-paper"}`}
        >
          {locked ? "Top Secret" : hotspot.label}
        </span>
      </button>
    );
  }

  const iconKey = hotspot.icon && ICONS[hotspot.icon] ? hotspot.icon : "terminal";
  const size = SIZES[hotspot.size] || SIZES.md;
  const theme = THEMES[iconKey];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={hotspot.label}
      style={{ left: hotspot.x, top: hotspot.y }}
      className="pointer-events-auto absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 animate-float"
    >
      <span
        className={`grid place-items-center rounded-full animate-pulse-glow ${size.outer} ${theme.bg} ${theme.text} ${theme.glow}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={size.icon}
        >
          {ICONS[iconKey]}
        </svg>
      </span>
      <span
        className={`whitespace-nowrap rounded-full bg-panel/80 px-2 py-0.5 font-mono uppercase tracking-wide text-paper backdrop-blur ${size.label}`}
      >
        {hotspot.label}
      </span>
    </button>
  );
}
