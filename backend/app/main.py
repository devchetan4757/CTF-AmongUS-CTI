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

# Kept for local dev when the frontend is run separately via `vite`
# (port 5173) instead of being served by this app. Harmless in
# production since same-origin requests don't need CORS at all.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
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
# production (Docker/Render), the frontend is built to static files
# and copied to backend/app/static by the build step, and this app
# serves both the API and the SPA from one process/port.
STATIC_DIR = Path(__file__).parent / "static"
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
