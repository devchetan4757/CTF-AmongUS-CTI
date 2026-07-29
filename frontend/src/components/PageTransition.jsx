import { useLocation } from "react-router-dom";

/**
 * Wraps the routed page content and replays the `page-enter` animation
 * (see tailwind.config.js) on every navigation. Keying the wrapper on
 * the pathname forces React to remount it on route change, which is
 * what re-triggers the CSS animation -- a small, dependency-free
 * stand-in for a real transition library.
 *
 * `prefers-reduced-motion` is already handled globally in tokens.css
 * (it zeroes out all animation durations), so this respects that for
 * free.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-page-enter">
      {children}
    </div>
  );
}
