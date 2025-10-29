import test from "node:test";
import assert from "assert";
import http from "http";
import app from "../app.js";

test("GET /api/health returns 200 and status ok", async (t) => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = address.port;

  const res = await fetch(`http://127.0.0.1:${port}/api/health`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.status, "ok");

  await new Promise((resolve) => server.close(resolve));
});
