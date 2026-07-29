"""
Server-side mission completion tracking.

Progress lives in data/progress.json and is the single source of truth
for which missions have been solved. The frontend also mirrors this in
localStorage (GameContext) for instant UI feedback, but the backend
copy is authoritative -- GET /missions and GET /evidence report from
it, so a correct answer can't be "un-solved" by clearing browser
storage or opening the game on another device.

This is one shared progress file with no accounts or sessions, which
matches the project's single-player, no-DB scope. Multi-player support
would mean keying this by session/player id -- out of scope here.
"""
from __future__ import annotations

from app.storage import read_json, write_json

PROGRESS_FILE = "progress.json"


def _default_progress() -> dict:
    return {"completed_missions": []}


def get_progress() -> dict:
    """Read progress, creating a fresh file the first time it's needed."""
    try:
        return read_json(PROGRESS_FILE)
    except FileNotFoundError:
        progress = _default_progress()
        write_json(PROGRESS_FILE, progress)
        return progress


def is_complete(mission_id: str) -> bool:
    return mission_id in get_progress().get("completed_missions", [])


def mark_complete(mission_id: str) -> bool:
    """Record a mission as solved.

    Returns True if this call is what newly completed it, False if it
    was already marked complete (so callers can tell a fresh solve
    apart from a repeat correct submission).
    """
    progress = get_progress()
    completed = progress.setdefault("completed_missions", [])
    if mission_id in completed:
        return False
    completed.append(mission_id)
    write_json(PROGRESS_FILE, progress)
    return True


def reset_progress() -> dict:
    """Clear all completion state. Used when a player starts a new run."""
    progress = _default_progress()
    write_json(PROGRESS_FILE, progress)
    return progress
