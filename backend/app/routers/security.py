"""
Fake security panel login used by the Security Room mission.

There's no real auth system here -- just a hardcoded factory-default
username/password pair that "nobody got around to changing," so the
player learns to recognize and try default credentials instead of
looking for a clever exploit. Always responds 200 with a success flag
in the body (rather than a 401) so the frontend can show a friendly
in-fiction message either way.
"""
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/security", tags=["security"])

DEFAULT_USERNAME = "admin"
DEFAULT_PASSWORD = "admin123"
FLAG = "FLAG{admin_admin123_oops}"


class SecurityLoginRequest(BaseModel):
    username: str
    password: str


class SecurityLoginResponse(BaseModel):
    success: bool
    message: str
    flag: str | None = None


@router.post("/login", response_model=SecurityLoginResponse)
def security_login(request: SecurityLoginRequest) -> SecurityLoginResponse:
    if request.username == DEFAULT_USERNAME and request.password == DEFAULT_PASSWORD:
        return SecurityLoginResponse(
            success=True,
            message="Access granted. Factory defaults were still active -- the panel dumps its session log on login.",
            flag=FLAG,
        )
    return SecurityLoginResponse(
        success=False,
        message="Access denied. That's not a valid username/password combination.",
    )
