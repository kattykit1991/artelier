import { ArtworkSchema } from "../schemas/artworkSchema";
import z from "zod";

export async function artworkSearch(query: string) {
  const response = await fetch(
    `/api/v1/artworks/search?q=${encodeURIComponent(query)}&fields=id,title,artist_title,image_id`,
    { referrerPolicy: "no-referrer" },
  );
  if (!response.ok) {
    throw new Error("Something went wrong.");
  }
  const data = await response.json();
  const artworks = data.data;
  const validatedArtworks = z.array(ArtworkSchema).parse(artworks);
  return validatedArtworks;
}
