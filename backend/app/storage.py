"""
Lightweight JSON storage layer.

The Imposter uses flat JSON files instead of a database, per the project
spec. This module centralizes every read/write so routers never touch
the filesystem directly -- that keeps file paths, encoding, and error
handling consistent in one place.
"""
from __future__ import annotations

import json
from pathlib import Path
from threading import Lock
from typing import Any

DATA_DIR = Path(__file__).parent / "data"

# A process-wide lock per file keeps concurrent requests (e.g. two
# players submitting flags at the same instant) from corrupting a file
# with interleaved writes. Simple and sufficient for a beginner CTF
# that isn't expected to run under heavy concurrency.
_locks: dict[str, Lock] = {}


def _lock_for(name: str) -> Lock:
    if name not in _locks:
        _locks[name] = Lock()
    return _locks[name]


def read_json(filename: str) -> Any:
    """Read and parse a JSON file from the data directory."""
    path = DATA_DIR / filename
    with _lock_for(filename):
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)


def write_json(filename: str, data: Any) -> None:
    """Write data to a JSON file in the data directory, pretty-printed."""
    path = DATA_DIR / filename
    with _lock_for(filename):
        with path.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            f.write("\n")
