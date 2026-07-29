export default function LabTerminal() {
  return (
    <div className="border-[3px] border-black bg-void p-4 shadow-[6px_6px_0_0_#000]">
      {/* HEADER -- violet theme to match this room's Lab Terminal
          scene hotspot. */}
      <div className="flex items-center gap-2.5 border-b-[3px] border-violet-400 pb-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a78bfa"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.2 15.2 21 21" />
        </svg>
        <h3 className="font-display text-sm font-black uppercase tracking-widest text-violet-400">
          Crew Lookup Terminal
        </h3>
      </div>

      <div className="mt-4">
        <div className="border-[3px] border-black bg-panel p-2">
          <div className="flex justify-center">
            <img
              src="/images/osint-photo.jpg"
              alt="Two crewmates fist-bumping, labeled Spedicey and Sykkuno"
              className="max-h-56 w-auto border-2 border-black object-contain"
            />
          </div>
          <p className="mt-2 font-mono text-xs text-paper-dim">
            Confirm the GREEN crewmate's birth year.
          </p>
        </div>
      </div>
    </div>
  );
}
