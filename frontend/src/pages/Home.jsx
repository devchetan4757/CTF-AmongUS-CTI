import { Link } from "react-router-dom";
import { playClick } from "../lib/sound.js";
import ResponsiveBackground from "../components/ResponsiveBackground.jsx";

/**
 * Bare landing/title screen. Per App.jsx: background image + title +
 * one button, nothing else -- GameHUD is hidden here on purpose.
 * The button hands off to /story, which plays the intro logs before
 * the player ever reaches the facility.
 */
export default function Home() {
  return (
    <ResponsiveBackground
      as="main"
      portrait="/images/home-bg.jpg"
      landscape="/images/home-bg-landscape.jpg"
      className="relative min-h-[100dvh] overflow-hidden"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative h-[100dvh] w-full">
        {/* ======================
            TITLE -- sharp, edgy
        ======================= */}
        <div className="absolute left-14 top-[26%] z-20 w-[calc(100%-3rem)] max-w-xl sm:left-24 sm:top-[28%] sm:max-w-2xl md:left-32 lg:landscape:left-[25%] lg:landscape:top-[22%] lg:landscape:max-w-xl">
          <h1 className="-skew-x-6 font-mono text-5xl font-extrabold uppercase italic leading-[0.95] tracking-tight text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] sm:text-7xl md:text-8xl lg:landscape:text-6xl">
            Capture
            <br />
            the <span className="text-[#FF3C32]">Imposter</span>
          </h1>
        </div>

        {/* ======================
            START BUTTON -- middle-left
        ======================= */}
        <div className="absolute left-6 top-1/2 z-30 -translate-y-1/2 sm:left-12 md:left-16 lg:landscape:left-[60%] lg:landscape:top-[60%] lg:landscape:translate-y-0">
          <Link
            to="/story"
            onClick={playClick}
            className="
              group relative flex h-20 w-52 items-center justify-center
              overflow-hidden border-[3px] border-black bg-[#FF3C32]
              shadow-[4px_4px_0_0_#000] transition-all duration-150
              hover:scale-[1.02] active:translate-y-[2px] active:shadow-none
              sm:h-24 sm:w-64 md:h-28 md:w-72
              lg:landscape:h-16 lg:landscape:w-48
            "
          >
            <span className="relative -skew-x-6 font-display text-2xl font-extrabold uppercase italic tracking-wide text-black sm:text-3xl md:text-4xl lg:landscape:text-xl">
              Start
            </span>
          </Link>
        </div>
      </div>
    </ResponsiveBackground>
  );
}
