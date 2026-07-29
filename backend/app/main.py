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

app.include_router(admin_site.router)
app.include_router(security.router)

STATIC_DIR = Path(__file__).parent / "static"
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
