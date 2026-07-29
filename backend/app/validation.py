"""
Answer validation helpers for mission submissions.

Kept separate from the router so "what counts as a correct answer" is
easy to find and adjust without touching request/response wiring. Two
concerns live here:

- normalize/check_answer: forgiving comparison (trims whitespace,
  ignores case) so a beginner isn't failed by a stray space or typing
  "flag{...}" instead of "FLAG{...}".
- looks_like_flag: a light shape check used only to give a more useful
  hint when a submission is wrong -- it never grants credit.
"""
from __future__ import annotations

import re

# Every mission answer in this CTF is a FLAG{...} string. This checks
# the *shape* only, not the contents.
FLAG_PATTERN = re.compile(r"^FLAG\{.+\}$")


def looks_like_flag(value: str) -> bool:
    """True if the string has the FLAG{...} shape, regardless of contents."""
    return bool(FLAG_PATTERN.match(value.strip()))


def normalize(value: str) -> str:
    """Trim whitespace and fold case for forgiving comparison."""
    return value.strip().lower()


def check_answer(submitted: str, expected: str) -> bool:
    """Beginner-friendly comparison: whitespace- and case-insensitive."""
    if not expected:
        return False
    return normalize(submitted) == normalize(expected)
