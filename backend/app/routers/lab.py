"""
Fake crew-profile lookup used by the Laboratory mission (OSINT edition).

This does not call any real search engine, social media API, or
database -- it's a small in-memory list of crew profiles plus a naive
string check that mimics an open-source-intelligence (OSINT) exercise:
look at a photo, search publicly available info about the people in
it, and confirm a fact (their birth year) to unlock a classified
record. It's a simulation built to teach the *shape* of basic OSINT
(cross-referencing a public fact to verify an identity) without
calling out to any real external service.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/lab", tags=["laboratory"])

FLAG = "FLAG{osint_never_forgets_a_birthday}"

PROFILES = [
    {"id": 1, "name": "Spedicey", "status": "Crewmate -- cafeteria shift"},
    {"id": 2, "name": "Sykkuno", "status": "Crewmate -- public profile on file"},
    {"id": 3, "name": "Unknown Green Suit", "status": "unresolved"},
]

# Never returned by a normal name search -- only surfaces once the
# correct birth year for Sykkuno is confirmed, the way a real OSINT
# lookup would cross-reference a public fact to unlock a sealed file.
HIDDEN_RECORD = {
    "id": 99,
    "name": "Sealed Personnel File -- Sykkuno",
    "status": f"VERIFIED -- {FLAG}",
}

# Accepts the confirmed birth year in a few common formats a player
# might type after actually looking it up.
BIRTH_YEAR_MARKERS = ["1991", "june 4 1991", "june 4, 1991", "6/4/1991", "06/04/1991"]


@router.get("/search")
def lookup_profiles(query: str = "") -> dict:
    normalized = query.strip().lower()

    is_confirmed = any(marker in normalized for marker in BIRTH_YEAR_MARKERS)

    if is_confirmed:
        return {
            "results": PROFILES + [HIDDEN_RECORD],
            "note": "Match confirmed -- that birth year unlocks Sykkuno's sealed personnel file.",
        }

    matches = [p for p in PROFILES if normalized in p["name"].lower()]
    return {"results": matches, "note": None}
