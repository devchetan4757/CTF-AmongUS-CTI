const POSITION_CLASSES = {
  up: "left-1/2 top-20 -translate-x-1/2 sm:top-24",
  down: "left-1/2 bottom-24 -translate-x-1/2 sm:bottom-28",
  left: "left-4 top-1/2 -translate-y-1/2 sm:left-6",
  right: "right-4 top-1/2 -translate-y-1/2 sm:right-6",
};

const ROTATION_CLASSES = {
  up: "",
  down: "rotate-180",
  left: "-rotate-90",
  right: "rotate-90",
};

/**
 * One directional nav control on the facility scene. Purely visual +
 * positional -- FacilityMap.jsx decides what each direction points to
 * per-scene (see src/data/facilityScenes.js) and passes it in as
 * `onClick`.
 */
export default function SceneArrow({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Go ${direction}`}
      className={`pointer-events-auto absolute z-10 grid h-14 w-14 place-items-center border-[3px] border-black bg-[#FF3C32] text-black shadow-[3px_3px_0_0_#000] transition-transform hover:scale-[1.05] active:translate-y-[2px] active:shadow-none ${POSITION_CLASSES[direction]}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="black"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-6 w-6 ${ROTATION_CLASSES[direction]}`}
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
