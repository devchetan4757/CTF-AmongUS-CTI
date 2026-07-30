"""
Per-device session id extraction.

Every browser/device generates its own random session id on first load
(see frontend/src/api/client.js, which stores it in localStorage) and
sends it as the `X-Session-Id` header on every /api request. Routers
depend on `get_session_id()` to key progress per device instead of all
players sharing one global progress.json entry.
"""
from __future__ import annotations

from fastapi import Header

# Used only if a request arrives with no header at all (an old cached
# frontend build, a direct curl/API call, etc.) so those callers don't
# crash -- they just share one fallback "device" instead of getting
# their own.
FALLBACK_SESSION_ID = "shared-legacy-session"


def get_session_id(x_session_id: str | None = Header(default=None)) -> str:
    """FastAPI dependency: resolve the calling device's session id."""
    return x_session_id or FALLBACK_SESSION_ID
