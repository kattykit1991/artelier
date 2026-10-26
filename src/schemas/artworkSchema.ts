import { z } from "zod";

// Unser Daten-Türsteher: API-Daten müssen zur Laufzeit durch dieses Schema.
// TypeScript allein prüft externe Antworten nicht. Zod schaut wirklich hinein.
export const ArtworkSchema = z.object({
  // Ohne gültige Zahlen-ID wird abgelehnt. Wir erfinden keine Ersatz-ID.
  id: z.number(),
  // nullish erlaubt null und undefined (auch ein fehlendes Feld).
  // ?? setzt dafür den Ersatztext ein; ein leerer String bleibt bewusst ein leerer String.
  title: z
    .string()
    .nullish()
    .transform((value) => value ?? "Untitled"),
  // Gleiche Regel für den Künstlernamen: lieber verständlicher Ersatz als null in der UI.
  artist_title: z
    .string()
    .nullish()
    .transform((value) => value ?? "Artist unknown."),
  // Fehlende Bild-IDs vereinheitlichen wir zu null. Den Platzhalter zeigt ArtworkCard.
  image_id: z
    .string()
    .nullish()
    .transform((value) => value ?? null),
});

// z.infer leitet den TypeScript-Typ aus der Ausgabe des Schemas ab,
// also inklusive der Transformationen. Keine zweite Typ-Liste zum Synchronhalten, yay.
export type Artwork = z.infer<typeof ArtworkSchema>;
