from fastapi import APIRouter, Depends

from app.progress import reset_progress
from app.session import get_session_id

router = APIRouter(tags=["progress"])


@router.post("/reset")
def reset(session_id: str = Depends(get_session_id)) -> dict:
    reset_progress(session_id)
    return {"status": "ok"}
