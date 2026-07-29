// Relative, same-origin URLs. In dev, Vite proxies /api/* to the
// FastAPI backend on :8000 (see vite.config.js). In production, this
// app and the API are served by the same FastAPI process, so no host
// needs to be hardcoded.
async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
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
