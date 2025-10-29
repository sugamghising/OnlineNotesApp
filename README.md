# OnlineNoteApp

Minimal note-taking web app with a React frontend and Express/MongoDB backend.

## Project layout

- `client/` — React frontend (created with Create React App)
- `server/` — Express + Mongoose backend

## Quick start (development)

Requirements:

- Node.js 18+ (recommended)
- MongoDB running locally or a connection string

1. Start the backend

```powershell
cd d:\OnlineNoteApp\server
npm install
# create a .env with MONGO_URI (example: mongodb://localhost:27017/notes-app)
node index.js
```

2. Start the frontend

```powershell
cd d:\OnlineNoteApp\client
npm install
npm start
```

Open the UI at: http://localhost:3000

## Tests

Server tests use Node's built-in test runner. From the repo root:

```powershell
node --test server/test/*.js
```

## Notes

- The server expects a `.env` file in `server/` with `MONGO_URI` (and optional `PORT`).
- The frontend expects the backend to be running at `http://localhost:5000/api` by default.
- Share IDs are generated using cryptographic randomness and are URL-safe.
