"""
Mission endpoints.

GET /missions              -- list all missions (summary, no solutions)
GET /mission/{id}          -- full briefing/prompt for one mission
POST /mission/{id}/submit  -- check a submitted answer

Phase 4 replaces the Phase 1 placeholder answer-check with real
validation: forgiving-but-real string comparison, a shape check that
gives a more useful hint on a wrong guess, a guard on the one mission
that doesn't take a flag directly yet, and persistence -- a correct
answer is recorded in progress.json so `completed` on GET /missions
(and `unlocked` on GET /evidence) reflect real solve state instead of
always reporting false.
"""
from fastapi import APIRouter, HTTPException

from app.models import (
    MissionDetail,
    MissionSubmitRequest,
    MissionSubmitResponse,
    MissionSummary,
)
from app.progress import is_complete, mark_complete
from app.storage import read_json
from app.validation import check_answer, looks_like_flag

router = APIRouter(tags=["missions"])

# The Evidence Room mission entry exists so the Facility Map has
# something to link to, but it doesn't have a real flag yet -- that's
# wired up in Phase 6 alongside the suspect roster. Guard it here so a
# stray POST gets a helpful redirect instead of a confusing "wrong
# answer" against a placeholder.
NO_DIRECT_SUBMIT = {"evidence-room"}


def _find_mission(missions: list[dict], mission_id: str) -> dict | None:
    return next((m for m in missions if m["id"] == mission_id), None)


@router.get("/missions", response_model=list[MissionSummary])
def list_missions() -> list[MissionSummary]:
    missions = read_json("missions.json")
    return [MissionSummary(**m, completed=is_complete(m["id"])) for m in missions]


@router.get("/mission/{mission_id}", response_model=MissionDetail)
def get_mission(mission_id: str) -> MissionDetail:
    missions = read_json("missions.json")
    match = _find_mission(missions, mission_id)
    if match is None:
        raise HTTPException(status_code=404, detail="Mission not found")
    return MissionDetail(**match, completed=is_complete(mission_id))


@router.post("/mission/{mission_id}/submit", response_model=MissionSubmitResponse)
def submit_mission(mission_id: str, submission: MissionSubmitRequest) -> MissionSubmitResponse:
    missions = read_json("missions.json")
    match = _find_mission(missions, mission_id)
    if match is None:
        raise HTTPException(status_code=404, detail="Mission not found")

    if mission_id in NO_DIRECT_SUBMIT:
        return MissionSubmitResponse(
            correct=False,
            message=(
                "This room doesn't take a flag directly -- head to the "
                "Evidence Board to review clues and make your final accusation."
            ),
            already_completed=is_complete(mission_id),
        )

    answer = submission.answer.strip()
    if not answer:
        return MissionSubmitResponse(
            correct=False,
            message="Enter a flag before submitting.",
            already_completed=is_complete(mission_id),
        )

    expected = str(match.get("answer", ""))
    correct = check_answer(answer, expected)

    if correct:
        is_new_solve = mark_complete(mission_id)
        message = (
            "Correct! Evidence unlocked."
            if is_new_solve
            else "Correct! You already solved this one -- the evidence was unlocked earlier."
        )
        return MissionSubmitResponse(
            correct=True,
            message=message,
            clue_unlocked=match.get("clue"),
            already_completed=not is_new_solve,
        )

    expects_flag = looks_like_flag(expected)
    message = (
        "Not quite -- that doesn't look like a flag. Flags are formatted like FLAG{...}."
        if expects_flag and not looks_like_flag(answer)
        else "Not quite -- try again."
    )
    return MissionSubmitResponse(
        correct=False,
        message=message,
        already_completed=is_complete(mission_id),
    )
