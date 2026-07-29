#!/usr/bin/env bash
set -euo pipefail

echo "== Building frontend =="
cd frontend
npm ci
npm run build
cd ..

echo "== Copying frontend build into backend/app/static =="
rm -rf backend/app/static
mkdir -p backend/app/static
cp -r frontend/dist/. backend/app/static/

echo "== Installing backend dependencies =="
cd backend
pip install --no-cache-dir -r requirements.txt
cd ..

echo "== Build complete =="
