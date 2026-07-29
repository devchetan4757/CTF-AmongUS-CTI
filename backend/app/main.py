import os
from pathlib import Path

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers import accusation, admin_site, evidence, missions, progress, security

app = FastAPI(
    title="The Imposter -- CTF API",
    description="Backend for a beginner-friendly, social-deduction-themed CTF.",
    version="0.1.0",
)

# localhost:5173 covers local `vite` dev. FRONTEND_ORIGIN is the
# deployed Render Static Site's URL, set as an env var on this
# service -- needed now that frontend and backend are two separate
# services/origins instead of one. The static site's render.yaml
# rewrites also make most requests same-origin from the browser's
# point of view, but CORS is kept as a fallback (e.g. direct API
# calls, previews, local frontend hitting the deployed backend).
_extra_origin = os.environ.get("FRONTEND_ORIGIN")
_allowed_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
if _extra_origin:
    _allowed_origins.append(_extra_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data/JSON endpoints live under /api/* so they can't collide with the
# frontend's own client-side routes (e.g. the React page at
# /mission/:missionId vs. the JSON endpoint GET /mission/{id}) now that
# both are served from the same origin/service.
api = APIRouter(prefix="/api")
api.include_router(missions.router)
api.include_router(evidence.router)
api.include_router(accusation.router)
api.include_router(progress.router)
app.include_router(api)


@app.get("/api/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}

# These two stay at the real site root -- on purpose. Both missions
# are "type this into the address bar / login form" puzzles, and only
# work if they live at the site's actual root, not behind /api.
app.include_router(admin_site.router)
app.include_router(security.router)

# Note: robots.txt for the Admin Office mission is a real static file
# at frontend/public/robots.txt, served by Vite in dev and copied into
# the frontend build's dist/ root in production (below), so the player
# finds it by typing /robots.txt into the address bar themselves.

# Note: the Laboratory mission no longer has its own /lab/search
# endpoint. The player reads the birth year off the pinned photo's
# lookup, then submits it straight through the mission's normal
# answer field like every other room.

# --- Serve the built frontend (production only) --------------------
# In dev, the frontend runs separately via `vite` on :5173. In
# production (Docker/Render), this app serves both the API and the
# built SPA from one process/port, reading straight out of
# frontend/dist -- no copy-to-backend step, so there's no separate
# "did the copy actually run" failure mode. main.py lives at
# backend/app/main.py, so frontend/dist is three levels up.
from fastapi.responses import FileResponse

STATIC_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if STATIC_DIR.exists():
    # Hashed JS/CSS build output -- safe to serve directly, filenames are
    # unique per build so there's no staleness/caching ambiguity.
    assets_dir = STATIC_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # Catch-all: this app is a client-side-routed SPA (React Router), so a
    # fresh/direct request to something like /facility or /mission/cafeteria
    # (e.g. a hard refresh, or toggling "Desktop site" which reloads the
    # current URL) has to still return index.html and let React Router take
    # over client-side -- otherwise the server 404s on any path that isn't
    # literally a file on disk. Real static files (images, robots.txt, the
    # manifest, etc.) still get served as themselves if they exist.
    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_spa(full_path: str):
        candidate = STATIC_DIR / full_path
        if full_path and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(STATIC_DIR / "index.html")
