/**
 * The Admin Office mission has no in-app "fetch" button on purpose --
 * the real technique is opening a new browser tab and typing
 * /robots.txt onto the end of the site's own URL, the same way you'd
 * do it against any real website. This component just points the
 * player at the exact address to type.
 */
export default function AdminExplorer() {
  const robotsUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/robots.txt`
      : "/robots.txt";

  return (
    <div className="border-[3px] border-black bg-[#0a0f14] p-4 shadow-[6px_6px_0_0_#000]">
      {/* HEADER -- sky-blue theme to match this room's Site Terminal
          scene hotspot. */}
      <div className="flex items-center gap-2.5 border-b-[3px] border-sky-400 pb-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9Z" />
        </svg>
        <h3 className="font-display text-sm font-black uppercase tracking-widest text-sky-400">
          Site Terminal
        </h3>
      </div>

      <div className="space-y-4 pt-4">
        <p className="font-body text-sm text-paper-dim">
          No button for this one -- open a new tab and type this address
          into the URL bar yourself, exactly like you would on any real
          site:
        </p>

        <div className="overflow-x-auto border-[3px] border-black bg-void px-4 py-3 font-mono text-xs text-sky-400 shadow-[3px_3px_0_0_#000]">
          {robotsUrl}
        </div>

        <p className="font-body text-xs text-paper-dim">
          Read every line of what comes back -- not just the normal
          "Disallow" entries.
        </p>
      </div>
    </div>
  );
}
