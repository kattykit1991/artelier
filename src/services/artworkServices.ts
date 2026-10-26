import { ArtworkSchema } from "../schemas/artworkSchema";
import z from "zod";

// App ruft diese exportierte Funktion auf. async liefert ein Promise;
// aufgelöst wird es mit Artwork[], abgeleitet aus dem validierten Rückgabewert.
export async function artworkSearch(query: string) {
  // Die öffentliche Museums-API erlaubt Browserzugriff per CORS.
  // Die Museumsanfrage unserer Pages Function bekam produktiv 403: Deshalb der Direktzugriff.
  // encodeURIComponent hält z.B. & im Suchtext, statt daraus einen neuen Parameter zu machen.
  // fields begrenzt die Felder, limit die Anzahl auf zehn Kunstwerke.
  const response = await fetch(
    `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&fields=id,title,artist_title,image_id&limit=10`,
    {
      // Kein Referer und keine Browser-Zugangsdaten mitsenden.
      // Nach zehn Sekunden brechen wir ab, statt die Suche endlos hängen zu lassen.
      referrerPolicy: "no-referrer",
      credentials: "omit",
      signal: AbortSignal.timeout(10_000),
    },
  );
  // fetch wirft bei HTTP-Fehlern wie 403 nicht automatisch. response.ok müssen wir prüfen.
  // Netzwerkfehler und geworfene Fehler gehen an den catch-Block in App weiter.
  if (!response.ok) {
    const message = response.status === 429
      ? "The museum is busy. Please try again in a moment."
      : `The museum search is unavailable (HTTP ${response.status}). Please try again.`;
    throw new Error(message);
  }
  // Eine HTML-Fehlerseite ist kein Kunstwerk-Katalog, auch wenn sie mit Status 200 kommt.
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error("The search service returned an unexpected response. Please try again later.");
  }
  // await liest den JSON-Inhalt. unknown heißt: noch nicht als passende Daten bestätigt.
  // Ungültiges JSON würde hier ebenfalls einen Fehler auslösen.
  const data: unknown = await response.json();
  // Die Trefferliste steckt in der Eigenschaft data der Antwort.
  // Zod prüft Hülle und jedes Kunstwerk und wendet dabei die Schema-Transformationen an.
  // parse wirft bei Fehlern; eine leere Trefferliste ist dagegen völlig okay.
  const validatedArtworks = z.object({ data: z.array(ArtworkSchema) }).parse(data).data;
  // Erst nach dieser Prüfung darf die Liste in den React-State. Vorher: nope.
  return validatedArtworks;
}
