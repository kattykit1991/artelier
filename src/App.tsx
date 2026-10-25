import { useEffect, useState, type SubmitEvent } from "react";
import { z } from "zod";

import { artworkSearch } from "./services/artworkServices";

import type { Artwork } from "./schemas/artworkSchema";

import {
  GallerySchema,
  SavedArtworkSchema,
  type SavedArtwork,
} from "./schemas/savedArtworkSchema";

import ArtworkCard from "./components/ArtworkCard";
import Gallery from "./components/Gallery";
import "./App.css";

const STORAGE_KEY = "artelier-gallery";

function loadGallery(): SavedArtwork[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    return GallerySchema.parse(JSON.parse(saved));
  } catch {
    return [];
  }
}

function App() {
  const [view, setView] = useState<"explore" | "gallery">("explore");
  const [hasSearched, setHasSearched] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [query, setQuery] = useState("");
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  const [gallery, setGallery] = useState<SavedArtwork[]>(loadGallery);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
      // oxlint-disable-next-line react/set-state-in-effect -- Report the result of synchronizing external browser storage.
      setStorageError("");
    } catch {
      // oxlint-disable-next-line react/set-state-in-effect -- Keep a storage failure visible without crashing the gallery.
      setStorageError("Your browser could not save this gallery. Keep this tab open; changes may be lost after a reload.");
    }
  }, [gallery]);

  async function searchHandle(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim() || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await artworkSearch(query.trim());
      setArtworks(result);
      setHasSearched(true);
    } catch (error) {
      setError(error instanceof TypeError
        ? "Could not connect to the museum. Check your connection and try again."
        : error instanceof Error && !(error instanceof z.ZodError)
          ? error.message
          : "The museum returned artwork data we could not read. Please try a different search.");
    } finally {
      setLoading(false);
    }
  }

  function addArtwork(artwork: Artwork) {
    const alreadySaved = gallery.some((saved) => saved.id === artwork.id);

    if (alreadySaved) {
      return;
    }

    const savedArtwork = SavedArtworkSchema.parse({
      ...artwork,
      note: "",
    });

    setGallery((current) => [...current, savedArtwork]);
  }

  function removeArtwork(id: number) {
    setGallery((current) => current.filter((artwork) => artwork.id !== id));
  }

  function updateNote(id: number, note: string) {
    const result = z.string().max(500).safeParse(note);

    if (!result.success) {
      return;
    }

    setGallery((current) =>
      current.map((artwork) =>
        artwork.id === id ? { ...artwork, note: result.data } : artwork,
      ),
    );
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="#main-content" onClick={() => setView("explore")} aria-label="Artelier home">
          <span className="brand-mark cozy-ornament" aria-hidden="true">✳</span> artelier<span className="brand-dot">.</span>
        </a>
        <nav aria-label="Main navigation">
          <button type="button" className={view === "explore" ? "cozy-button nav-button active" : "cozy-button nav-button"} aria-current={view === "explore" ? "page" : undefined} onClick={() => setView("explore")}>Explore</button>
          <button type="button" className={view === "gallery" ? "cozy-button nav-button active" : "cozy-button nav-button"} aria-current={view === "gallery" ? "page" : undefined} onClick={() => setView("gallery")}>My Gallery <span className="nav-count">{gallery.length}</span></button>
        </nav>
        <span className="header-note">A space for art & you</span>
      </header>

      <main id="main-content">
        {storageError && <p className="message error-message" role="alert">{storageError}</p>}
        {view === "explore" ? (
          <>
            <section className="hero" aria-labelledby="explore-heading">
              <div className="hero-copy">
                <p className="eyebrow"><span className="small-line" /> Your everyday art escape</p>
                <h1 id="explore-heading">Find art.<br />Feel <em>something.</em></h1>
                <p className="hero-description">Wander through the Art Institute of Chicago collection. Find what speaks to you, and make a little gallery of your own.</p>
              </div>
              <div className="hero-art cozy-ornament" aria-hidden="true">
                <div className="abstract-print"><span className="print-sun" /><span className="print-arch" /><span className="print-line" /></div>
                <span className="hero-art-caption">A different way of seeing.</span>
              </div>
            </section>

            <section className="explore-section" aria-labelledby="search-heading">
              <div className="section-heading search-heading">
                <div><p className="eyebrow">Follow your curiosity</p><h2 id="search-heading">What catches your eye?</h2></div>
                <span className="collection-label">Art Institute of Chicago <span aria-hidden="true">↗</span></span>
              </div>
              <form className="search-form" onSubmit={searchHandle} role="search">
                <label className="search-label" htmlFor="artwork-query">Search artworks</label>
                <span className="search-icon" aria-hidden="true">⌕</span>
                <input id="artwork-query" type="search" placeholder="Try cats, Monet, flowers…" value={query} maxLength={200} onChange={(event) => setQuery(event.target.value)} />
                <button className="cozy-button cozy-button--primary primary-button" type="submit" disabled={loading || !query.trim()}>{loading ? "Searching…" : "Whooosh!"} <span aria-hidden="true">↗</span></button>
              </form>
              <p className="search-hint">A subject, an artist, a passing thought. Start anywhere.</p>
              {error && <p className="message error-message" role="alert">{error}</p>}
              <div className="results-status" role="status" aria-live="polite">
                {loading ? <p><span className="loading-dot" /> Looking through the collection…</p> : hasSearched && <p>{artworks.length ? `${artworks.length} works to spend a moment with` : "No works found. Try another artist or subject."}</p>}
              </div>
              {!hasSearched && !loading && !error && <div className="search-invitation"><span aria-hidden="true">✳</span><p>Your next favourite is waiting to be found.</p></div>}
              <div className="artwork-grid" aria-busy={loading}>
                {artworks.map((artwork) => {
                  const isSaved = gallery.some((saved) => saved.id === artwork.id);
                  return (
                    <ArtworkCard key={artwork.id} artwork={artwork}>
                      <button className={isSaved ? "cozy-button save-button saved" : "cozy-button save-button"} type="button" disabled={isSaved} onClick={() => addArtwork(artwork)} aria-label={isSaved ? `${artwork.title} is already saved` : `Add ${artwork.title} to Gallery`}>
                        <span aria-hidden="true">{isSaved ? "✓" : "+"}</span> {isSaved ? "Saved to Gallery" : "Add to Gallery"}
                      </button>
                    </ArtworkCard>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <Gallery artworks={gallery} onRemove={removeArtwork} onUpdateNote={updateNote} />
        )}
      </main>
      <footer className="site-footer"><span>artelier. <span className="footer-tagline">A little art, a little you.</span></span><span>Collection by <a href="https://www.artic.edu/" target="_blank" rel="noreferrer">Art Institute of Chicago ↗</a></span><span>Made with curiosity · Katcoded</span></footer>
    </div>
  );
}

export default App;
