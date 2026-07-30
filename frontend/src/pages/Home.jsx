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
            PORTRAIT / narrow-landscape -- title and button flow
            together in one column so the button can never collide
            with the title, no matter how many lines it wraps to.
        ======================= */}
        <div className="lg:landscape:hidden">
          <div className="absolute inset-x-6 top-[32%] z-20 -translate-y-1/2 sm:inset-x-12 sm:max-w-2xl md:inset-x-16">
            <h1 className="-skew-x-6 font-mono text-[clamp(2rem,11vw,3rem)] font-extrabold uppercase italic leading-[0.95] tracking-tight text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] sm:text-6xl md:text-7xl">
              Capture
              <br />
              the <span className="text-[#FF3C32]">Imposter</span>
            </h1>
          </div>

          <div className="absolute right-12 top-[70%] z-20 sm:right-20 md:right-24">
            <Link
              to="/story"
              onClick={playClick}
              className="
                group relative flex h-10 w-28 items-center justify-center
                overflow-hidden border-[2px] border-black bg-[#FF3C32]
                shadow-[2px_2px_0_0_#000] transition-all duration-150
                hover:scale-[1.02] active:translate-y-[2px] active:shadow-none
                sm:h-12 sm:w-32 md:h-14 md:w-36
              "
            >
              <span className="relative -skew-x-6 font-display text-base font-extrabold uppercase italic tracking-wide text-black sm:text-lg md:text-xl">
                Start
              </span>
            </Link>
          </div>
        </div>

        {/* ======================
            WIDE LANDSCAPE -- roomier, so title and button can go
            back to being positioned independently on opposite sides.
        ======================= */}
        <div className="hidden lg:landscape:block">
          <div className="absolute left-[25%] top-[22%] z-20 max-w-xl">
            <h1 className="-skew-x-6 font-mono text-6xl font-extrabold uppercase italic leading-[0.95] tracking-tight text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
              Capture
              <br />
              the <span className="text-[#FF3C32]">Imposter</span>
            </h1>
          </div>

          <div className="absolute left-[60%] top-[60%] z-30">
            <Link
              to="/story"
              onClick={playClick}
              className="
                group relative flex h-16 w-48 items-center justify-center
                overflow-hidden border-[3px] border-black bg-[#FF3C32]
                shadow-[4px_4px_0_0_#000] transition-all duration-150
                hover:scale-[1.02] active:translate-y-[2px] active:shadow-none
              "
            >
              <span className="relative -skew-x-6 font-display text-xl font-extrabold uppercase italic tracking-wide text-black">
                Start
              </span>
            </Link>
          </div>
        </div>
      </div>
    </ResponsiveBackground>
  );
}
