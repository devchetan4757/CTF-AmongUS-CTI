#!/usr/bin/env bash
set -euo pipefail


echo "== Installing backend dependencies =="
cd backend
pip install --no-cache-dir -r requirements.txt
cd ..

echo "== Build complete =="
