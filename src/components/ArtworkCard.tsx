import { useState, type ReactNode } from "react";
import type { Artwork } from "../schemas/artworkSchema";

type ArtworkCardProps = {
  artwork: Artwork;
  children?: ReactNode;
};

export default function ArtworkCard({ artwork, children }: ArtworkCardProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const imageUrl = artwork.image_id
    ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`
    : null;

  return (
    <article className="artwork-card">
      <div className="artwork-image">
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
        {children && <div className="artwork-actions">{children}</div>}
      </div>
    </article>
  );
}
