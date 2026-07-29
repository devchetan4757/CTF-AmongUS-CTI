"""
Fake crew-directory site used by the Admin Office mission.

This isn't a real website -- it's a tiny endpoint that stands in for
one, so the player has something that looks like a normal site sitting
behind the real /robots.txt (registered at the app root in main.py,
not here) that gives up the flag directly.
"""
from fastapi.responses import PlainTextResponse
from fastapi import APIRouter

router = APIRouter(prefix="/site", tags=["admin-site"])

HOME_HTML = """<!DOCTYPE html>
<html>
<head><title>Station Crew Directory</title></head>
<body>
  <h1>Crew Directory</h1>
  <p>Names, decks, and shift schedules for all station personnel.</p>
  <!-- built by the intern, spring rotation -->
</body>
</html>
"""


@router.get("/", response_class=PlainTextResponse)
def home_page() -> str:
    return HOME_HTML
