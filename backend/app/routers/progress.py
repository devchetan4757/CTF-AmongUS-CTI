from fastapi import APIRouter

from app.progress import reset_progress

router = APIRouter(tags=["progress"])


@router.post("/reset")
def reset() -> dict:
    reset_progress()
    return {"status": "ok"}
