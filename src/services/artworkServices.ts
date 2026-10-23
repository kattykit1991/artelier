import { ArtworkSchema } from "../schemas/artworkSchema";
import z from "zod";

async function artworkSearch(query: string) {
  const response = await fetch(
    `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}`,
  );
  if (!response.ok) {
    throw new Error("Something went wrong.");
  }
  const data = await response.json();
  const artworks = data.data;
  const validatedArtworks = z.array(ArtworkSchema).parse(artworks);
  return validatedArtworks;
}
