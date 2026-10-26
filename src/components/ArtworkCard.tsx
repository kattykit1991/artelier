import { useState, type ReactNode } from "react";
import type { Artwork } from "../schemas/artworkSchema";

// Props sind die Dinge, die die Karte von außen bekommt.
// children ist optionaler React-Inhalt: in Explore der Speichern-Button,
// in der Galerie das Notizfeld und Entfernen. Eine Karte, zwei Einsatzorte.
type ArtworkCardProps = {
  artwork: Artwork;
  children?: ReactNode;
};

export default function ArtworkCard({ artwork, children }: ArtworkCardProps) {
  // Wir merken uns die fehlgeschlagene URL, damit stattdessen der Fallback erscheint.
  // string | null erlaubt entweder eine URL oder "noch kein Bildfehler".
  const [failedImage, setFailedImage] = useState<string | null>(null);
  // Die API liefert eine Bild-ID, keine fertige Bildadresse.
  // Daraus bauen wir die IIIF-Adresse mit 400 Pixeln Breite.
  const imageUrl = artwork.image_id
    ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`
    : null;

  return (
    <article className="artwork-card">
      <div className="artwork-image">
        {/* Ohne Bild-ID oder nach einem Ladefehler zeigen wir den Platzhalter.
            Ein zickiger Bildserver soll nicht die ganze Karte ruinieren. */}
        {imageUrl && failedImage !== imageUrl ? (
          <img
            src={imageUrl}
            alt={artwork.title}
            loading="lazy"
            decoding="async"
            onError={() => setFailedImage(imageUrl)}
          />
        ) : (
          <div className="image-fallback">
            <span className="fallback-frame" aria-hidden="true">↗</span>
            <p>No image available.</p>
            <span>The artwork is still yours to discover.</span>
          </div>
        )}
      </div>
      <div className="artwork-details">
        <p className="artwork-eyebrow">From the collection</p>
        <h3>{artwork.title}</h3>
        <p className="artist-name">{artwork.artist_title}</p>
        {/* Die Karte kümmert sich um die Darstellung, ihre Eltern liefern die Aktionen. */}
        {children && <div className="artwork-actions">{children}</div>}
      </div>
    </article>
  );
}
