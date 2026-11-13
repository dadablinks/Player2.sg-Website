import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../public/_worker.js";

const assets = { fetch: async () => new Response("offline page") };
test("canonical path preserves queries; other paths use Pages assets", async () => {
  const result = await worker.fetch(
    new Request("https://player2.sg/fuwa?room=2"),
    {},
  );
  assert.equal(result.status, 308);
  assert.equal(
    result.headers.get("location"),
    "https://player2.sg/fuwa/?room=2",
  );
  assert.equal(
    await (
      await worker.fetch(new Request("https://player2.sg/"), { ASSETS: assets })
    ).text(),
    "offline page",
  );
});
test("unready game returns explicit 503, including assets and health", async () => {
  for (const path of [
    "/fuwa/",
    "/fuwa/health",
    "/fuwa/index.wasm",
    "/fuwa/godot-multiplayer",
  ]) {
    const result = await worker.fetch(
      new Request("https://player2.sg" + path),
      { ASSETS: assets },
    );
    assert.equal(result.status, 503);
    assert.equal(result.headers.get("cache-control"), "no-store");
    if (path !== "/fuwa/")
      assert.equal(result.headers.get("content-type"), "application/json");
  }
});
test("proxy strips prefix and preserves Origin, ranges, compression and upgrades", async () => {
  const original = globalThis.fetch;
  const response = new Response("compressed", {
    status: 206,
    headers: {
      "content-encoding": "br",
      "content-range": "bytes 0-9/20",
      vary: "Accept-Encoding",
      etag: "v1",
    },
  });
  globalThis.fetch = async (request) => {
    assert.equal(request.url, "https://fuwa.player2.sg/music.ogg?version=1");
    assert.equal(request.headers.get("origin"), "https://player2.sg");
    assert.equal(request.headers.get("range"), "bytes=0-9");
    return response;
  };
  try {
    const env = { FUWA_READY: "true", FUWA_ORIGIN: "https://fuwa.player2.sg" };
    assert.equal(
      await worker.fetch(
        new Request("https://player2.sg/fuwa/music.ogg?version=1", {
          headers: { origin: "https://player2.sg", range: "bytes=0-9" },
        }),
        env,
      ),
      response,
    );
    const upgrade = { status: 101, webSocket: {} };
    globalThis.fetch = async (request) => {
      assert.equal(request.headers.get("upgrade"), "websocket");
      assert.equal(new URL(request.url).pathname, "/godot-multiplayer");
      return upgrade;
    };
    assert.equal(
      await worker.fetch(
        new Request("https://player2.sg/fuwa/godot-multiplayer", {
          headers: { upgrade: "websocket" },
        }),
        env,
      ),
      upgrade,
    );
    const missing = new Response("missing", { status: 404 });
    globalThis.fetch = async () => missing;
    assert.equal(
      await worker.fetch(
        new Request("https://player2.sg/fuwa/missing.wasm"),
        env,
      ),
      missing,
    );
  } finally {
    globalThis.fetch = original;
  }
});
