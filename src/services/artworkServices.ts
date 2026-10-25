import { ArtworkSchema } from "../schemas/artworkSchema";
import z from "zod";

export async function artworkSearch(query: string) {
  // The public AIC API supports browser CORS. Edge-to-AIC requests return 403.
  const response = await fetch(
    `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&fields=id,title,artist_title,image_id&limit=10`,
    {
      referrerPolicy: "no-referrer",
      credentials: "omit",
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!response.ok) {
    const message = response.status === 429
      ? "The museum is busy. Please try again in a moment."
      : `The museum search is unavailable (HTTP ${response.status}). Please try again.`;
    throw new Error(message);
  }
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error("The search service returned an unexpected response. Please try again later.");
  }
  const data: unknown = await response.json();
  const validatedArtworks = z.object({ data: z.array(ArtworkSchema) }).parse(data).data;
  return validatedArtworks;
}
