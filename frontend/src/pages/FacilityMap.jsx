import { useEffect, useState } from "react";
import MissionModal from "../components/MissionModal.jsx";
import SceneArrow from "../components/SceneArrow.jsx";
import SceneHotspot from "../components/SceneHotspot.jsx";
import CafeteriaTerminal from "../components/CafeteriaTerminal.jsx";
import AdminExplorer from "../components/AdminExplorer.jsx";
import SecurityLogin from "../components/SecurityLogin.jsx";
import StorageCrate from "../components/StorageCrate.jsx";
import LabTerminal from "../components/LabTerminal.jsx";
import { FACILITY_SCENES, DEFAULT_SCENE_ID } from "../data/facilityScenes.js";
import { useGame } from "../state/GameContext.jsx";
import { api } from "../api/client.js";
import { playClick } from "../lib/sound.js";

// Which puzzle component renders inside the panel for each scene.
// Every room gets its own challenge, same pattern as cafeteria's
// Linux terminal -- these match the mission ids in facilityScenes.js.
const SCENE_PUZZLES = {
  cafeteria: CafeteriaTerminal,
  admin: AdminExplorer,
  security: SecurityLogin,
  storage: StorageCrate,
  laboratory: LabTerminal,
};

/**
 * Facility Map, phase 8: a single walkable scene instead of a grid of
 * room cards. The background image + whatever's interactive in it
 * (right now just the cafeteria's laptop) live in FACILITY_SCENES.
 * Arrow buttons swap the current scene id -- background and content
 * change in place, no route change.
 */
export default function FacilityMap() {
  const [currentId, setCurrentId] = useState(DEFAULT_SCENE_ID);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mission, setMission] = useState(null);
  const [missionError, setMissionError] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { completedMissions, completeMission, syncCompleted } = useGame();

  const scene = FACILITY_SCENES[currentId];
  const PuzzleComponent = SCENE_PUZZLES[currentId];
  const cleared = scene.missionId && completedMissions.includes(scene.missionId);

  // Merge server-side completion state in, same as the old grid page
  // did, so a room solved elsewhere still shows "cleared" here.
  useEffect(() => {
    let cancelled = false;
    api
      .getMissions()
      .then((data) => {
        if (cancelled) return;
        syncCompleted(data.filter((room) => room.completed).map((room) => room.id));
      })
      .catch(() => {
        // Non-fatal here -- the scene still renders, it just won't
        // show cleared badges until the backend's reachable.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- syncCompleted is stable
  }, []);

  function resetPanelState() {
    setPanelOpen(false);
    setMission(null);
    setMissionError(null);
    setResult(null);
  }

  function goTo(targetId) {
    playClick();
    resetPanelState();
    setCurrentId(targetId);
  }

  function openHotspot() {
    if (!scene.missionId) return;
    playClick();
    setPanelOpen(true);
    setMission(null);
    setMissionError(null);
    setResult(null);
    api
      .getMission(scene.missionId)
      .then(setMission)
      .catch((err) => setMissionError(err.message));
  }

  async function handleSubmit(answer) {
    setSubmitting(true);
    try {
      const res = await api.submitMission(scene.missionId, answer);
      setResult(res);
      if (res.correct) completeMission(scene.missionId);
    } catch (err) {
      setResult({
        correct: false,
        message: `Couldn't reach the station's systems (${err.message}).`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="fixed inset-0 overflow-hidden bg-void">
      {/* Background -- rooms without art yet fall back to a dark
          panel gradient so arrow navigation already works before the
          next set of scene images is dropped in. */}
      <div className="absolute inset-0">
        {scene.bg ? (
          <picture key={scene.bg}>
            {scene.bgLandscape && (
              <source
                media="(orientation: landscape) and (min-width: 640px)"
                srcSet={scene.bgLandscape}
              />
            )}
            <img
              src={scene.bg}
              alt={scene.name}
              className="h-full w-full object-cover"
            />
          </picture>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-panel via-void to-panel" />
        )}
        <div className="absolute inset-0 bg-void/20" />
      </div>

      {/* Room label */}
      <div className="pointer-events-none absolute left-1/2 top-6 z-10 -translate-x-1/2 border-[3px] border-black bg-paper px-5 py-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-black shadow-[3px_3px_0_0_#000] sm:top-8 sm:text-sm">
        {scene.name}
        {cleared && (
          <span className="ml-2 border-l-2 border-black pl-2 text-[#1a8f7a]">
            Cleared
          </span>
        )}
      </div>

      {/* Interactive prop -- each room's own puzzle trigger (laptop,
          terminal, panel, crate, ...) */}
      {scene.hotspot && <SceneHotspot hotspot={scene.hotspot} onClick={openHotspot} />}

      {/* Directional nav */}
      {Object.entries(scene.arrows).map(([direction, targetId]) => (
        <SceneArrow key={direction} direction={direction} onClick={() => goTo(targetId)} />
      ))}

      {/* Rooms with no art/puzzle wired up yet still get a friendly
          placeholder instead of a dead click target. */}
      {!scene.bg && !scene.hotspot && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <p className="max-w-xs text-center font-body text-sm text-paper-dim">
            This room's scene isn't wired up yet -- background art and
            its terminal are coming next.
          </p>
        </div>
      )}

      {/* Puzzle panel */}
      {panelOpen && (
        <div className="absolute inset-0 z-20 flex items-end justify-center bg-void/70 px-4 pb-24 pt-16 sm:items-center sm:pb-6">
          <div className="max-h-full w-[95vw] max-w-6xl overflow-y-auto">
            {missionError && (
              <div className="rounded-chunky border border-alert/40 bg-alert/10 p-5 font-body text-sm text-alert">
                Couldn't reach the station's systems ({missionError}).
              </div>
            )}

            {!mission && !missionError && (
              <div className="h-72 animate-pulse rounded-chunky border border-panel-line bg-panel/50" />
            )}

            {mission && (
              <MissionModal
                mission={mission}
                onSubmit={handleSubmit}
                result={result}
                submitting={submitting}
              >
                {PuzzleComponent ? <PuzzleComponent /> : null}
              </MissionModal>
            )}

            <button
              type="button"
              onClick={() => {
                playClick();
                resetPanelState();
              }}
              className="mt-4 w-full border-[3px] border-black bg-[#FF3C32] px-4 py-3 font-display text-sm font-extrabold uppercase tracking-wide text-black shadow-[4px_4px_0_0_#000] transition-transform hover:scale-[1.02] active:translate-y-[2px] active:shadow-none"
            >
              {result?.correct ? "Back to the room" : "Close"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
