import type { SavedArtwork } from "../schemas/savedArtworkSchema";
import ArtworkCard from "./ArtworkCard";

type GalleryProps = {
  artworks: SavedArtwork[];
  onRemove: (id: number) => void;
  onUpdateNote: (id: number, note: string) => void;
};

export default function Gallery({ artworks, onRemove, onUpdateNote }: GalleryProps) {
  return (
    <section aria-labelledby="gallery-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A collection of your own</p>
          <h2 id="gallery-heading">My Gallery <span className="count">{artworks.length}</span></h2>
        </div>
        <p>Keep the art. Add your perspective.</p>
      </div>

      {artworks.length === 0 && (
        <div className="empty-state">
          <span className="empty-symbol cozy-ornament" aria-hidden="true">◇</span>
          <h3>A little space for what moves you.</h3>
          <p>Your gallery is empty. Visit Explore and save a work that catches your eye.</p>
        </div>
      )}

      <div className="artwork-grid">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork}>
            <div className="cozy-field">
            <label className="note-label" htmlFor={`note-${artwork.id}`}>Personal note</label>
            <textarea
              id={`note-${artwork.id}`}
              value={artwork.note}
              maxLength={500}
              onChange={(event) => onUpdateNote(artwork.id, event.target.value)}
              placeholder="What do you love about this artwork?"
              aria-describedby={`note-hint-${artwork.id}`}
            />
            </div>
            <div className="note-footer">
              <span id={`note-hint-${artwork.id}`}>{artwork.note.length} / 500 · auto-saved</span>
              <button className="cozy-button cozy-button--ghost remove-button" type="button" onClick={() => onRemove(artwork.id)} aria-label={`Remove ${artwork.title} from gallery`}>
                Remove
              </button>
            </div>
          </ArtworkCard>
        ))}
      </div>
    </section>
  );
}
