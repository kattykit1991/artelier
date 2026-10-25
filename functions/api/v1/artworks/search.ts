// Pages serves this route in production; Vite's proxy serves it in development.
export async function onRequest({ request }: { request: Request }) {
  const jsonError = (message: string, status: number) =>
    Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });

  if (request.method !== "GET") {
    return new Response(null, { status: 405, headers: { Allow: "GET" } });
  }

  const parameters = new URL(request.url).searchParams;
  const query = parameters.get("q")?.trim() ?? "";

  if (parameters.getAll("q").length !== 1 || !query || query.length > 200) {
    return jsonError("Please enter a search term of 1–200 characters.", 400);
  }

  // The destination, requested fields and result limit cannot be supplied by clients.
  const upstreamUrl = new URL("https://api.artic.edu/api/v1/artworks/search");
  upstreamUrl.searchParams.set("q", query);
  upstreamUrl.searchParams.set("fields", "id,title,artist_title,image_id");
  upstreamUrl.searchParams.set("limit", "10");

  try {
    // Start a fresh request: never forward browser cookies or the local Referer.
    const upstream = await fetch(upstreamUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Artelier/1.0 (+https://artelier.katcoded.de)",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
    });

    if (!upstream.ok) {
      console.warn("AIC search upstream error", { status: upstream.status });
      await upstream.body?.cancel();
      return jsonError(
        upstream.status === 429
          ? "The museum is receiving too many requests. Please try again shortly."
          : "The museum search is temporarily unavailable. Please try again.",
        upstream.status === 429 ? 429 : 502,
      );
    }

    if (!upstream.headers.get("content-type")?.includes("application/json")) {
      await upstream.body?.cancel();
      return jsonError("The museum returned an unexpected response. Please try again.", 502);
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("AIC search request failed", error instanceof Error ? error.message : "Unknown network error");
    return jsonError(
      error instanceof Error && error.name === "TimeoutError"
        ? "The museum took too long to respond. Please try again."
        : "Could not reach the museum. Please try again shortly.",
      error instanceof Error && error.name === "TimeoutError" ? 504 : 502,
    );
  }
}
