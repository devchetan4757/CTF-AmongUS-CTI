import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client.js";

/**
 * Tracks which missions are complete and which evidence is unlocked as
 * the player moves through the facility. Persisted to localStorage so
 * a refresh mid-game doesn't lose progress.
 *
 * Phase 6 adds `caseSolved` / `finalFlag`: once the player wins,
 * that's persisted too, so landing on /victory (or refreshing it)
 * still shows the flag instead of an empty screen.
 *
 * Phase 7 adds `syncCompleted`: the backend's progress.json is the
 * real source of truth (see app/progress.py), but this local copy is
 * what the UI actually reads for instant feedback. Without syncing,
 * progress made in another session/device -- or before localStorage
 * was cleared -- wouldn't show as cleared here even though GET
 * /missions correctly reports it complete. Pages that fetch mission
 * data should call this to merge server truth in.
 */
const GameContext = createContext(null);

const STORAGE_KEY = "imposter-ctf-progress";

function loadInitialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Corrupt or inaccessible storage -- fall back to a fresh game.
  }
  return { completedMissions: [], caseSolved: false, finalFlag: null };
}

export function GameProvider({ children }) {
  const [state, setState] = useState(loadInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const completeMission = (missionId) => {
    setState((prev) =>
      prev.completedMissions.includes(missionId)
        ? prev
        : { ...prev, completedMissions: [...prev.completedMissions, missionId] }
    );
  };

  const solveCase = (flag) => {
    setState((prev) => ({
      ...prev,
      completedMissions: prev.completedMissions.includes("evidence-room")
        ? prev.completedMissions
        : [...prev.completedMissions, "evidence-room"],
      caseSolved: true,
      finalFlag: flag,
    }));
  };

  const resetProgress = async () => {
    // Clear local state right away so the UI feels instant.
    setState({ completedMissions: [], caseSolved: false, finalFlag: null });

    // Also clear the server's progress.json -- otherwise the next
    // getMissions() call (e.g. when FacilityMap mounts) merges the old
    // "completed" ids straight back in via syncCompleted, and rooms
    // show "cleared" again even though the player just reset.
    // Requires a POST /reset route on the backend (see api/client.js).
    // Wrapped in try/catch so this quietly no-ops until that route
    // exists, instead of breaking Play Again.
    try {
      await api.resetProgress();
    } catch (err) {
      console.error("Couldn't reset server-side progress:", err);
    }
  };

  /** Merge server-reported completed mission ids into local state. */
  const syncCompleted = (ids) => {
    if (!ids.length) return;
    setState((prev) => {
      const merged = Array.from(new Set([...prev.completedMissions, ...ids]));
      return merged.length === prev.completedMissions.length
        ? prev
        : { ...prev, completedMissions: merged };
    });
  };

  const value = useMemo(
    () => ({ ...state, completeMission, solveCase, resetProgress, syncCompleted }),
    [state]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}
