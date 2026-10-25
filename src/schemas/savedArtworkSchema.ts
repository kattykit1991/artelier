import { z } from "zod";
import { ArtworkSchema } from "./artworkSchema";

export const SavedArtworkSchema = ArtworkSchema.extend({
  note: z.string().max(500).default(""),
});

export const GallerySchema = z.array(SavedArtworkSchema);

export type SavedArtwork = z.infer<typeof SavedArtworkSchema>;
