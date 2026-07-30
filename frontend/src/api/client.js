// In dev, Vite proxies /api, /site, /security to the FastAPI backend
// on :8000 (see vite.config.js), so a relative path works as-is.
//
// In production the frontend is a separate Render Static Site from
// the backend. VITE_API_URL points at the backend's own URL
// (e.g. https://the-imposter-api.onrender.com). If it's unset we
// fall back to a relative path, which still works because the
// static site's render.yaml rewrites /api, /site, /security through
// to the backend -- so the game's "type it into the address bar"
// puzzles still feel same-origin even though two services serve them.
const API_BASE = import.meta.env.VITE_API_URL ?? "";

// The backend keys mission progress by this id (see app/session.py),
// one per browser/device, so everyone playing against the same
// deployed backend gets their own independent run instead of sharing
// one global progress.json entry. Generated once and persisted in
// localStorage -- stable across refreshes/tabs on the same device,
// but different for every other device.
const SESSION_STORAGE_KEY = "imposter-ctf-session-id";

function getSessionId() {
  try {
    let id = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      window.localStorage.setItem(SESSION_STORAGE_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode, etc.) -- fall back to a
    // per-request id rather than crashing; progress just won't
    // persist across reloads for this caller.
    return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": getSessionId(),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  getMissions: () => request("/api/missions"),

  resetProgress: () =>
    request("/api/reset", { method: "POST" }),

  getMission: (id) =>
    request(`/api/mission/${id}`),

  submitMission: (id, answer) =>
    request(`/api/mission/${id}/submit`, {
      method: "POST",
      body: JSON.stringify({ answer }),
    }),

  getEvidence: () =>
    request("/api/evidence"),

  submitFinalAccusation: (suspectId) =>
    request("/api/final-accusation", {
      method: "POST",
      body: JSON.stringify({
        suspect_id: suspectId,
      }),
    }),

  // Intentionally NOT under /api -- the Security Room mission is a
  // real login panel living at the site's own root, matching the
  // "found it" feel of the puzzle.
  securityLogin: (username, password) =>
    request("/security/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    }),
};
