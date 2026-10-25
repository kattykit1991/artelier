import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "vite";
import { onRequest } from "../functions/api/v1/artworks/search.ts";

const artwork = { id: 1, title: "Cat", artist_title: "Artist", image_id: "image" };
const request = (query = "cat", options) => new Request(
  `https://artelier.katcoded.de/api/v1/artworks/search?q=${encodeURIComponent(query)}`, options,
);

await test("Pages: only GET is accepted", async () => {
  const response = await onRequest({ request: request("cat", { method: "POST" }) });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET");
});

for (const url of ["?q=", "", "?q=a&q=b", `?q=${"x".repeat(201)}`]) {
  await test(`Pages: reject invalid query ${url.slice(0, 30)}`, async (t) => {
    const fetch = t.mock.method(globalThis, "fetch", () => { throw new Error("must not fetch"); });
    const response = await onRequest({ request: new Request(`https://artelier.katcoded.de/api/v1/artworks/search${url}`) });
    assert.equal(response.status, 400);
    assert.equal(fetch.mock.callCount(), 0);
  });
}

await test("Pages: fixed upstream, safe parameters, no forwarded cookies or Referer", async (t) => {
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url.origin + url.pathname, "https://api.artic.edu/api/v1/artworks/search");
    assert.equal(url.searchParams.get("q"), "cat & café?/#");
    assert.equal(url.searchParams.get("fields"), "id,title,artist_title,image_id");
    assert.equal(url.searchParams.get("limit"), "10");
    const headers = new Headers(options.headers);
    assert.equal(headers.get("referer"), null);
    assert.equal(headers.get("cookie"), null);
    assert.match(headers.get("user-agent"), /^Artelier\//);
    return Response.json({ data: [artwork] });
  });
  const response = await onRequest({ request: request(" cat & café?/# ", { headers: { Referer: "http://localhost:5173/", Cookie: "test=value" } }) });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { data: [artwork] });
});

for (const [status, expected] of [[403, 502], [302, 502], [429, 429], [500, 502]]) {
  await test(`Pages: upstream ${status} becomes safe JSON ${expected}`, async (t) => {
    t.mock.method(globalThis, "fetch", async () => new Response("private upstream body", { status }));
    const response = await onRequest({ request: request() });
    assert.equal(response.status, expected);
    assert.match(response.headers.get("content-type"), /application\/json/);
    assert.doesNotMatch(await response.text(), /private upstream body/);
  });
}

for (const [error, status] of [[new TypeError("network"), 502], [new DOMException("timeout", "TimeoutError"), 504]]) {
  await test(`Pages: ${error.name} returns ${status}`, async (t) => {
    t.mock.method(globalThis, "fetch", async () => { throw error; });
    const response = await onRequest({ request: request() });
    assert.equal(response.status, status);
  });
}

await test("Pages: HTML challenge is rejected", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("<html>challenge</html>", { headers: { "Content-Type": "text/html" } }));
  assert.equal((await onRequest({ request: request() })).status, 502);
});

// Bundle the real browser service in memory to resolve its TypeScript imports.
const bundle = await build({ configFile: false, logLevel: "silent", build: {
  write: false, minify: false, lib: { entry: "src/services/artworkServices.ts", formats: ["es"] },
} });
const code = (Array.isArray(bundle) ? bundle[0] : bundle).output.find((item) => item.type === "chunk").code;
const { artworkSearch } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);

await test("Service: public CORS endpoint, encoded query, schema transformations", async (t) => {
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const target = new URL(url);
    assert.equal(target.origin + target.pathname, "https://api.artic.edu/api/v1/artworks/search");
    assert.equal(target.searchParams.get("q"), "cat & café");
    assert.equal(target.searchParams.get("fields"), "id,title,artist_title,image_id");
    assert.equal(target.searchParams.get("limit"), "10");
    assert.equal(options.referrerPolicy, "no-referrer");
    assert.equal(options.credentials, "omit");
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json({ data: [{ id: 1, title: null, artist_title: null }] });
  });
  assert.deepEqual(await artworkSearch("cat & café"), [{ id: 1, title: "Untitled", artist_title: "Artist unknown.", image_id: null }]);
});

for (const data of [null, {}, { data: {} }, { data: [{ ...artwork, id: "invalid" }] }]) {
  await test("Service: invalid envelopes or artworks reject", async (t) => {
    t.mock.method(globalThis, "fetch", async () => Response.json(data));
    await assert.rejects(() => artworkSearch("cat"), { name: "ZodError" });
  });
}

await test("Service: no results returns an empty array", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ data: [] }));
  assert.deepEqual(await artworkSearch("nothing"), []);
});

await test("Service: static HTML fallback rejects with a useful message", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("<html>app</html>", { headers: { "Content-Type": "text/html" } }));
  await assert.rejects(() => artworkSearch("cat"), /unexpected response/);
});

await test("Service: HTTP failure rejects", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ error: "busy" }, { status: 429 }));
  await assert.rejects(() => artworkSearch("cat"), /busy/);
});

const schemaBundle = await build({ configFile: false, logLevel: "silent", build: {
  write: false, minify: false, lib: { entry: "src/schemas/savedArtworkSchema.ts", formats: ["es"] },
} });
const schemaCode = (Array.isArray(schemaBundle) ? schemaBundle[0] : schemaBundle).output.find((item) => item.type === "chunk").code;
const { SavedArtworkSchema, GallerySchema } = await import(`data:text/javascript;base64,${Buffer.from(schemaCode).toString("base64")}`);

await test("Notes: 500 characters accepted, 501 rejected", () => {
  assert.equal(SavedArtworkSchema.safeParse({ ...artwork, note: "x".repeat(500) }).success, true);
  assert.equal(SavedArtworkSchema.safeParse({ ...artwork, note: "x".repeat(501) }).success, false);
});

await test("Gallery schema: saved note survives JSON round-trip; invalid data rejected", () => {
  const saved = SavedArtworkSchema.parse({ ...artwork, note: "A favourite." });
  assert.deepEqual(GallerySchema.parse(JSON.parse(JSON.stringify([saved]))), [saved]);
  assert.equal(GallerySchema.safeParse([{ id: "wrong", note: "broken" }]).success, false);
  assert.equal(SavedArtworkSchema.parse(artwork).note, "");
});
