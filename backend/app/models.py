"""
Pydantic schemas shared across routers.

Phase 1 defines the shapes the API contract promises in the project
spec. Phase 4 adds `already_completed` to MissionSubmitResponse so the
frontend can tell "just solved it" apart from "solved it again" --
everything else here was stable enough to build the frontend against
from the start.

Phase 6 replaces the old placeholder `EvidenceItem` shape (which never
matched the real evidence.json data) with `SuspectEvidence`: one entry
per suspect, carrying the clue their room's mission unlocks. The
Evidence Board and Final Accusation screens both render off this same
shape, matching the project spec's fixed API surface (still just
GET /evidence).
"""
from __future__ import annotations

from pydantic import BaseModel


class MissionSummary(BaseModel):
    """Shape returned in the GET /missions list -- no solution data."""

    id: str
    room: str
    title: str
    concept: str
    difficulty: str
    completed: bool = False


class MissionDetail(MissionSummary):
    """Full mission content returned by GET /mission/{id}."""

    briefing: str
    prompt: str
    hint: str | None = None


class MissionSubmitRequest(BaseModel):
    answer: str


class MissionSubmitResponse(BaseModel):
    correct: bool
    message: str
    clue_unlocked: str | None = None
    already_completed: bool = False


class SuspectEvidence(BaseModel):
    """One suspect's card on the Evidence Board / Final Accusation screen.

    `clue` is only populated once the player has solved the mission in
    that suspect's room (see `unlocked`) -- so a player can't skip
    ahead to the accusation with incomplete information.
    """

    id: str
    name: str
    role: str
    mission_id: str
    unlocked: bool = False
    clue: str | None = None


class FinalAccusationRequest(BaseModel):
    suspect_id: str


class FinalAccusationResponse(BaseModel):
    correct: bool
    flag: str | None = None
    message: str
