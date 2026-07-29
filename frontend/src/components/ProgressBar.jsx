/**
 * Chunky rounded progress bar. Used in the Navbar (overall mission
 * progress) and can be reused wherever a completed/total count needs
 * a visual read at a glance.
 */
export default function ProgressBar({ completed, total, label = "Case Progress" }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full max-w-xs" role="group" aria-label={label}>
      <div className="flex items-center justify-between mb-1 text-xs text-paper-dim font-body tracking-wide">
        <span>{label}</span>
        <span className="font-mono">
          {completed}/{total}
        </span>
      </div>
      <div
        className="h-3 w-full rounded-full bg-panel border border-panel-line overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-signal transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
