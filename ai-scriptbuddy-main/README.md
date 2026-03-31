# Welcome to your Lovable project

## Local setup

1. Setup frontend
   - `npm install`
   - `npm run dev`

2. Setup backend (Flask)
   - `cd backend`
   - `python -m pip install -r requirements.txt`
   - `python app.py`

3. Open frontend at http://localhost:5173 and backend at http://localhost:5000

## Backend endpoints (stub)

- GET `/api/status`
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/user/profile?userId=<id>`
- POST `/api/analysis`
- GET `/api/history` (optional `?userId=<id>`)

## Notes

- This backend uses in-memory stores for users and analysis; add a real database later.
- Could expand auth with JWT and persisted user profiles when ready.

