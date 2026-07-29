import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { playClick } from "../lib/sound.js";
import ResponsiveBackground from "../components/ResponsiveBackground.jsx";

const LOG_ENTRIES = [
  {
    time: "T-04:12",
    text: "Automated systems log a full comms blackout on Deck 7. Duration: 40 seconds. Cause: unknown.",
  },
  {
    time: "T-03:58",
    text: "Crew roster pulled from the last dock. One entry doesn't match any prior manifest for this station.",
    flagged: true,
  },
  {
    time: "T-02:30",
    text: "Cafeteria, Admin Office, Security, Storage Bay and the Laboratory all show minor tampering. Nothing was taken — something was left behind, in every room.",
  },
  {
    time: "T-00:05",
    text: "You've been brought in to walk the station, clear each room, and hold what you find. When the trail closes, you'll name who doesn't belong.",
  },
];

export default function Story() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= LOG_ENTRIES.length) return;

    const timer = setTimeout(() => {
      setVisibleCount((v) => v + 1);
    }, 600);

    return () => clearTimeout(timer);
  }, [visibleCount]);

  const allRevealed = visibleCount >= LOG_ENTRIES.length;

  return (
    <ResponsiveBackground
      as="main"
      portrait="/images/deck7-bg.jpg"
      landscape="/images/deck7-bg-landscape.jpg"
      className="relative min-h-[100dvh] overflow-hidden"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative h-[100dvh] w-full">

        {/* ======================
            STORY LOGS
        ======================= */}

        <div className="absolute left-5 top-[24%] z-20 w-[calc(100%-2.5rem)] max-w-md pr-2 sm:left-10 sm:top-[26%] sm:w-[55%] sm:max-w-lg md:left-16 md:w-[46%] lg:landscape:left-52 lg:landscape:top-[20%] lg:landscape:w-[42%] lg:landscape:max-w-md lg:landscape:pr-6">

          <div className="flex flex-col gap-5 sm:gap-7 md:gap-8 lg:landscape:gap-4">

            {LOG_ENTRIES.map((entry, i) => (
              <div
                key={entry.time}
                className={`transition-all duration-700 ${
                  i < visibleCount
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >

                <div
                  className={`font-display text-lg font-bold drop-shadow-[0_3px_5px_rgba(0,0,0,1)] sm:text-xl md:text-2xl lg:landscape:text-base lg:landscape:font-mono lg:landscape:uppercase lg:landscape:tracking-[0.12em]
                    ${
                      entry.flagged
                        ? "text-red-400 lg:landscape:text-[#FF3C32]"
                        : "text-white lg:landscape:text-[#FF6B5B]/80"
                    }`}
                >
                  {entry.time}
                </div>

                <p className="mt-1.5 font-display text-xl font-semibold leading-[1.3] text-white drop-shadow-[0_3px_5px_rgba(0,0,0,1)] sm:mt-2 sm:text-2xl md:text-[2rem] lg:landscape:mt-1.5 lg:landscape:text-xl lg:landscape:leading-[1.3] lg:landscape:drop-shadow-[2px_2px_0_rgba(0,0,0,0.95)]">
                  {entry.text}
                </p>

              </div>
            ))}

          </div>

        </div>
        {/* ======================
            ENTER FACILITY BUTTON — Among Us themed
        ======================= */}

        <div
          className={`absolute left-1/2 top-[76%] z-30 -translate-x-1/2 transition-all duration-700 sm:top-[73%] lg:landscape:left-[52%] lg:landscape:top-[74%] ${
            allRevealed
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-90 opacity-0"
          }`}
        >
          <Link
            to="/facility"
            onClick={playClick}
            className="
              group
              relative
              flex
              h-20
              w-64
              items-center
              justify-center
              overflow-hidden
              rounded-none
              border-[3px]
              border-black
              bg-white
              shadow-[4px_4px_0_0_#000]
              transition-all
              duration-150
              hover:scale-[1.02]
              active:translate-y-[2px]
              active:shadow-none
              sm:h-24
              sm:w-80
              md:h-28
              md:w-[22rem]
              lg:landscape:h-16
              lg:landscape:w-56
            "
          >
            {/* Visor stripe removed — flat sticker theme now applies on all screens */}

            {/* Corner rivets removed — flat sticker theme now applies on all screens */}

            {/* Glossy shine removed — flat sticker theme now applies on all screens */}

            <span
              className="
                relative
                mt-1
                font-display
                text-xl
                font-extrabold
                uppercase
                tracking-[0.14em]
                text-black
                sm:text-2xl
                md:text-[2.1rem]
                md:tracking-[0.18em]
                lg:landscape:text-lg
                lg:landscape:tracking-[0.1em]
              "
            >
              Enter Facility
            </span>
          </Link>
        </div>

      </div>
    </ResponsiveBackground>
  );
}
