import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MissionModal from "../components/MissionModal.jsx";
import CafeteriaTerminal from "../components/CafeteriaTerminal.jsx";
import AdminExplorer from "../components/AdminExplorer.jsx";
import SecurityLogin from "../components/SecurityLogin.jsx";
import StorageCrate from "../components/StorageCrate.jsx";
import LabTerminal from "../components/LabTerminal.jsx";
import { useGame } from "../state/GameContext.jsx";
import { api } from "../api/client.js";

// Maps a mission id to the interactive puzzle it should render inside
// MissionModal. Evidence Room isn't listed here -- the Facility Map
// sends that room straight to /evidence instead of this page.
const MISSION_COMPONENTS = {
  cafeteria: CafeteriaTerminal,
  admin: AdminExplorer,
  security: SecurityLogin,
  storage: StorageCrate,
  laboratory: LabTerminal,
};

export default function Mission() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const { completeMission } = useGame();

  const [mission, setMission] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setMission(null);
    setResult(null);
    setError(null);

    api
      .getMission(missionId)
      .then((data) => {
        if (!cancelled) setMission(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [missionId]);

  async function handleSubmit(answer) {
    setSubmitting(true);
    try {
      const res = await api.submitMission(missionId, answer);
      setResult(res);
      if (res.correct) {
        completeMission(missionId);
      }
    } catch (err) {
      setResult({ correct: false, message: `Couldn't reach the station's systems (${err.message}).` });
    } finally {
      setSubmitting(false);
    }
  }

  const PuzzleComponent = MISSION_COMPONENTS[missionId];

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 landscape:max-w-4xl landscape:py-10">
        <div className="rounded-chunky border border-alert/40 bg-alert/10 p-5 font-body text-sm text-alert">
          Couldn't load this room ({error}). Check that the backend is
          running and try again.
        </div>
        <Link
          to="/facility"
          className="mt-6 inline-block font-body text-sm text-signal hover:underline"
        >
          &larr; Back to Facility Map
        </Link>
      </main>
    );
  }

  if (!mission) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 landscape:max-w-4xl landscape:py-10">
        <div className="h-72 animate-pulse rounded-chunky border border-panel-line bg-panel/50" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-16 landscape:max-w-4xl landscape:py-10">
      <Link
        to="/facility"
        className="font-body text-sm text-paper-dim transition-colors hover:text-signal"
      >
        &larr; Back to Facility Map
      </Link>

      <div className="mt-6">
        <MissionModal
          mission={mission}
          onSubmit={handleSubmit}
          result={result}
          submitting={submitting}
        >
          {PuzzleComponent ? <PuzzleComponent /> : null}
        </MissionModal>
      </div>

      {result?.correct && (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-chunky border border-signal/40 bg-signal/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-sm text-signal">
            Room cleared. That evidence is now on the board.
          </p>
          <button
            type="button"
            onClick={() => navigate("/facility")}
            className="rounded-chunky bg-signal px-4 py-2 font-body text-sm font-semibold text-void shadow-panel-sm transition-transform hover:scale-[1.02]"
          >
            Next Room
          </button>
        </div>
      )}
    </main>
  );
}
