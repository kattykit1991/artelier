import type { Artwork } from "../schemas/artworkSchema";

type ArtworkCardProps = {
  artwork: Artwork;
};

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const imageUrl = artwork.image_id
    ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`
    : null;

  return (
    <article>
      {imageUrl ? (
        <img src={imageUrl} alt={artwork.title} />
      ) : (
        <p>No image available.</p>
      )}

      <h2>{artwork.title}</h2>
      <p>{artwork.artist_title}</p>
    </article>
  );
}
