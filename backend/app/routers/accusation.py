"""
POST /final-accusation -- checks the player's chosen suspect and
returns the final flag on a correct accusation.

Phase 6 wires up the real suspect roster and win/lose narrative beats,
and records a correct guess in progress.json (as mission id
"evidence-room") so the rest of the app -- the Facility Map's room
status, GET /missions -- can see the case is closed, the same way any
other room reports solved.
"""
from fastapi import APIRouter

from app.models import FinalAccusationRequest, FinalAccusationResponse
from app.progress import mark_complete
from app.storage import read_json

router = APIRouter(tags=["accusation"])


@router.post("/final-accusation", response_model=FinalAccusationResponse)
def final_accusation(request: FinalAccusationRequest) -> FinalAccusationResponse:
    game_state = read_json("game_state.json")
    infiltrator_id = game_state.get("infiltrator_id")

    correct = request.suspect_id == infiltrator_id
    if correct:
        mark_complete("evidence-room")

    return FinalAccusationResponse(
        correct=correct,
        flag=game_state.get("final_flag") if correct else None,
        message=(
            "You caught the infiltrator! Case closed."
            if correct
            else "Wrong call -- the infiltrator slips away. Review the evidence and try again."
        ),
    )
