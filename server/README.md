# Server

Minimal backend for OnlineNoteApp.

Prerequisites

- Node.js (18+ recommended)
- A running MongoDB instance (URI available to the server)

Setup

1. Install dependencies

```powershell
cd d:\OnlineNoteApp\server
npm install
```

2. Create a `.env` file in the `server/` folder with at least:

```
MONGO_URI=mongodb://<user>:<pass>@host:port/dbname
PORT=5000
```

3. Start the server

```powershell
npm start
```

Health check

- GET http://localhost:5000/api/health will return a JSON status object when the server is running.

Notes

- The project uses ESM modules (see `package.json` `type: "module"`). Import paths include the `.js` extension.
- Share IDs are generated using Node's `crypto.randomUUID()` for strong uniqueness.
