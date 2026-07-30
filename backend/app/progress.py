"""
Server-side mission completion tracking.

Progress lives in data/progress.json and is the single source of
truth for which missions have been solved. The frontend also mirrors
this in localStorage (GameContext) for instant UI feedback, but the
backend copy is authoritative -- GET /missions and GET /evidence
report from it, so a correct answer can't be "un-solved" by clearing
browser storage or opening the game on another device.

Progress is keyed by session id (see app/session.py), one entry per
device/browser, so everyone playing against the same deployed backend
gets their own independent set of solved missions instead of sharing
one global run.
"""
from __future__ import annotations

from app.storage import read_json, write_json

PROGRESS_FILE = "progress.json"


def _default_store() -> dict:
    return {"sessions": {}}


def _default_session_progress() -> dict:
    return {"completed_missions": []}


def _load_store() -> dict:
    """Read the store, creating it (or migrating an old copy) as needed."""
    try:
        store = read_json(PROGRESS_FILE)
    except FileNotFoundError:
        store = _default_store()
        write_json(PROGRESS_FILE, store)
        return store

    # One-time migration: older deployments wrote a single flat
    # {"completed_missions": [...]} shared by every player. Fold that
    # into the new per-session shape under the fallback session id
    # instead of silently dropping it.
    if "sessions" not in store:
        legacy_completed = store.get("completed_missions", [])
        migrated = _default_store()
        if legacy_completed:
            from app.session import FALLBACK_SESSION_ID

            migrated["sessions"][FALLBACK_SESSION_ID] = {
                "completed_missions": legacy_completed
            }
        write_json(PROGRESS_FILE, migrated)
        return migrated

    return store


def get_progress(session_id: str) -> dict:
    """Read one session's progress, defaulting to empty if unseen so far."""
    store = _load_store()
    return store["sessions"].get(session_id, _default_session_progress())


def is_complete(session_id: str, mission_id: str) -> bool:
    return mission_id in get_progress(session_id).get("completed_missions", [])


def mark_complete(session_id: str, mission_id: str) -> bool:
    """Record a mission as solved for this session.

    Returns True if this call is what newly completed it, False if it
    was already marked complete (so callers can tell a fresh solve
    apart from a repeat correct submission).
    """
    store = _load_store()
    session_progress = store["sessions"].setdefault(
        session_id, _default_session_progress()
    )
    completed = session_progress.setdefault("completed_missions", [])
    if mission_id in completed:
        return False
    completed.append(mission_id)
    write_json(PROGRESS_FILE, store)
    return True


def reset_progress(session_id: str) -> dict:
    """Clear completion state for this session only. Used when a player
    starts a new run -- doesn't touch anyone else's progress."""
    store = _load_store()
    store["sessions"][session_id] = _default_session_progress()
    write_json(PROGRESS_FILE, store)
    return store["sessions"][session_id]
