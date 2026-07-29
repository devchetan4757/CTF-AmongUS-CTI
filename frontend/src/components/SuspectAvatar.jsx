/**
 * SuspectAvatar -- renders a suspect's real character portrait.
 *
 * Images are expected at /public/images/<suspect.name>.png (e.g. drop
 * "Hauler.png", "Cook.png", "Researcher.png" etc. straight into
 * /public/images and they're picked up automatically, no code changes
 * needed). If an image is missing or fails to load, this falls back to
 * a simple colored initial badge so the layout never breaks on a
 * missing asset.
 *
 * Pass `size` (px number) for a fixed pixel size, or `sizeClassName`
 * (Tailwind height/width utilities, can include responsive sm:/md:/lg:
 * variants) to let the avatar grow at larger breakpoints instead of
 * staying pinned to one pixel size on every screen.
 */
import { useState } from "react";

export default function SuspectAvatar({
  suspect,
  color = "#3a63e8",
  size = 56,
  sizeClassName = "",
  textClassName = "",
  className = "",
}) {
  const [failed, setFailed] = useState(false);
  const src = `/images/${encodeURIComponent(suspect.name)}.png`;
  const dimStyle = sizeClassName ? undefined : { width: size, height: size };
  const dimClass = sizeClassName || "";

  if (failed) {
    // Fallback initial badge only -- shown when the character art is
    // missing. This is the one place a circle still makes sense, since
    // there's no character art to show.
    return (
      <div
        style={{ backgroundColor: color, ...dimStyle }}
        className={`grid place-items-center rounded-full font-display font-bold text-white shadow-inner ${dimClass} ${className}`}
      >
        <span
          style={sizeClassName ? undefined : { fontSize: size * 0.4 }}
          className={textClassName}
        >
          {suspect.name?.[0]?.toUpperCase() ?? "?"}
        </span>
      </div>
    );
  }

  // No rounded-full / object-cover here anymore -- that was cropping the
  // character art into a circle and cutting off the helmet/backpack.
  // object-contain shows the whole character, same as the reference art.
  return (
    <img
      src={src}
      alt={suspect.name}
      onError={() => setFailed(true)}
      className={`object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)] ${dimClass} ${className}`}
      style={dimStyle}
    />
  );
}
