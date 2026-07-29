/**
 * AmongUsAvatar -- a small stylized crewmate icon (body + backpack +
 * visor) rendered purely in SVG/CSS, colored per-player. Used on the
 * Final Accusation screen so each suspect reads as a distinct
 * "crewmate" the way they do in the reference screenshots, without
 * needing any image assets.
 */

// A "Who Is The Impostor" style roster of classic crewmate colors.
// Suspects are assigned one of these by list position, so the same
// suspect always renders in the same color for a given game session.
export const PLAYER_COLORS = [
  "#C51111", // red
  "#132ED1", // blue
  "#117F2D", // green
  "#ED54BA", // pink
  "#EF7D0D", // orange
  "#F5F557", // yellow
  "#6B2FBB", // purple
  "#38FEDB", // cyan
  "#71491E", // brown
  "#50EF39", // lime
  "#3F474E", // black
  "#D6E0F0", // white
];

/** Darkens (or lightens) a hex color by `percent` (-100..100). */
function shade(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const amt = Math.round(2.55 * percent);
  const r = clamp((num >> 16) + amt);
  const g = clamp(((num >> 8) & 0x00ff) + amt);
  const b = clamp((num & 0x0000ff) + amt);
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b)
    .toString(16)
    .slice(1)}`;
}

export default function AmongUsAvatar({ color = "#C51111", size = 48, className = "" }) {
  const shadow = shade(color, -38);

  return (
    <svg
      viewBox="0 0 100 110"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* backpack */}
      <rect x="65" y="45" width="20" height="34" rx="9" fill={shadow} />
      <rect x="63" y="43" width="18" height="30" rx="8" fill={color} />

      {/* body */}
      <path
        d="M50 19c-19 0-32 13-32 32v29c0 8 7 14 15 14h34c8 0 15-6 15-14V51c0-19-13-32-32-32Z"
        fill={color}
      />

      {/* bottom shading crescent for depth */}
      <path
        d="M22 68v12c0 8 7 14 15 14h9c-13-4-21-14-24-26Z"
        fill={shadow}
        opacity="0.55"
      />

      {/* visor */}
      <path
        d="M39 37c0-9 8-16 21-16 14 0 23 9 23 20 0 8-5 13-13 13H45c-6 0-6-10-6-17Z"
        fill="#BEE9F4"
        stroke="#8fd0e0"
        strokeWidth="2"
      />
      <path
        d="M45 29c5-3 12-3 16 0"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
