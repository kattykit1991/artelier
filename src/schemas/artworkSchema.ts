import { z } from "zod";

export const ArtworkSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .nullish()
    .transform((value) => value ?? "Untitled"),
  artist_title: z
    .string()
    .nullish()
    .transform((value) => value ?? "Artist unknown."),
  image_id: z
    .string()
    .nullish()
    .transform((value) => value ?? null),
});

export type Artwork = z.infer<typeof ArtworkSchema>;
