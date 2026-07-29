"""
GET /evidence -- returns the evidence board state.

Phase 4 wired `unlocked` to real mission-completion progress. Phase 6
finishes the job: each entry is now a suspect (not a generic evidence
item), and `clue` is only sent once that suspect's room has been
solved -- so a player can't read ahead before earning the clue. Both
the Evidence Board and Final Accusation screens call this same
endpoint, matching the spec's fixed API list.
"""
from fastapi import APIRouter

from app.models import SuspectEvidence
from app.progress import is_complete
from app.storage import read_json

router = APIRouter(tags=["evidence"])


@router.get("/evidence", response_model=list[SuspectEvidence])
def get_evidence() -> list[SuspectEvidence]:
    data = read_json("evidence.json")
    suspects = []
    for suspect in data["suspects"]:
        unlocked = is_complete(suspect["mission_id"])
        suspects.append(
            SuspectEvidence(
                id=suspect["id"],
                name=suspect["name"],
                role=suspect["role"],
                mission_id=suspect["mission_id"],
                unlocked=unlocked,
                clue=suspect["clue"] if unlocked else None,
            )
        )
    return suspects
