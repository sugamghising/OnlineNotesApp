import test from "node:test";
import assert from "assert";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../app.js";
import Note from "../models/Note.js";

// Load server/.env explicitly (tests run from project root)
dotenv.config({ path: "./server/.env" });

test("Full notes CRUD + share flow (integration)", async (t) => {
  if (!process.env.MONGO_URI) {
    throw new Error(
      "MONGO_URI not set in environment; integration test requires a MongoDB."
    );
  }

  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Ensure clean slate
  await Note.deleteMany({});

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  try {
    // CREATE
    let res = await fetch(`${base}/api/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test note",
        content: "This is a test",
        tags: ["test"],
      }),
    });
    assert.strictEqual(res.status, 201, "POST /api/notes should return 201");
    const created = await res.json();
    assert.ok(
      created.note && created.note._id,
      "Created response must include note._id"
    );
    const id = created.note._id;

    // LIST
    res = await fetch(`${base}/api/notes`);
    assert.strictEqual(res.status, 200, "GET /api/notes should return 200");
    const list = await res.json();
    assert.ok(
      Array.isArray(list) && list.length >= 1,
      "Notes list should include at least one item"
    );

    // GET by id
    res = await fetch(`${base}/api/notes/${id}`);
    assert.strictEqual(res.status, 200, "GET /api/notes/:id should return 200");
    const got = await res.json();
    assert.strictEqual(got._id, id);

    // UPDATE
    res = await fetch(`${base}/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Updated title",
        content: "Modified content",
        tags: ["updated"],
      }),
    });
    assert.strictEqual(res.status, 200, "PUT /api/notes/:id should return 200");
    const updated = await res.json();
    assert.strictEqual(updated.title, "Updated title");

    // SHARE
    res = await fetch(`${base}/api/notes/${id}/share`, { method: "POST" });
    assert.strictEqual(
      res.status,
      200,
      "POST /api/notes/:id/share should return 200"
    );
    const shareBody = await res.json();
    assert.ok(shareBody.shareId, "shareId should be returned");
    const shareId = shareBody.shareId;

    // GET by shareId
    res = await fetch(`${base}/api/notes/shared/${shareId}`);
    assert.strictEqual(
      res.status,
      200,
      "GET /api/notes/shared/:shareId should return 200"
    );
    const sharedNote = await res.json();
    assert.strictEqual(sharedNote._id, id);

    // DELETE
    res = await fetch(`${base}/api/notes/${id}`, { method: "DELETE" });
    assert.strictEqual(
      res.status,
      200,
      "DELETE /api/notes/:id should return 200"
    );

    // GET after delete -> 404
    res = await fetch(`${base}/api/notes/${id}`);
    assert.strictEqual(res.status, 404, "GET deleted note should return 404");
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
  }
});
