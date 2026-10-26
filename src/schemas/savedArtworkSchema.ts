import { z } from "zod";
import { ArtworkSchema } from "./artworkSchema";

// Ein gespeichertes Kunstwerk ist ein Artwork plus persönliche Notiz.
// extend übernimmt die vorhandenen Regeln, statt sie nochmal abzuschreiben.
export const SavedArtworkSchema = ArtworkSchema.extend({
  // Höchstens 500 Zeichen; fehlt note bzw. ist undefined, starten wir mit "".
  note: z.string().max(500).default(""),
});

// Beim Laden aus localStorage prüfen wir die gesamte Liste samt Notizen.
export const GallerySchema = z.array(SavedArtworkSchema);

// Auch dieser Typ kommt direkt aus Zod und wird für den Galerie-State verwendet.
export type SavedArtwork = z.infer<typeof SavedArtworkSchema>;
