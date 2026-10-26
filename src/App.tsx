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

// Unter diesem Namen liegt meine Galerie im Browser-Speicher.
// localStorage gehört zur jeweiligen Origin: localhost und Live-Domain haben getrennte Galerien.
const STORAGE_KEY = "artelier-gallery";

// Beim Start holen wir das letzte Savegame zurück, inklusive Notizen.
function loadGallery(): SavedArtwork[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    // JSON.parse macht aus dem Text wieder Daten. Ob die wirklich passen, prüft erst Zod.
    return GallerySchema.parse(JSON.parse(saved));
  } catch {
    // Speicher gesperrt, kaputtes JSON oder ungültige Galerie? Dann starten wir leer.
    // Die App soll deshalb nicht komplett umkippen.
    return [];
  }
}

function App() {
  // Reacts kleine Merkkästchen: Der Setter ändert den State und löst eine neue Anzeige aus.
  // view erlaubt durch den Union-Typ nur diese zwei Ansichten. "kartoffel"? Nope.
  const [view, setView] = useState<"explore" | "gallery">("explore");
  // So unterscheiden wir "noch nicht gesucht" von "gesucht, aber keine Treffer".
  const [hasSearched, setHasSearched] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [query, setQuery] = useState("");
  // Hier landen die validierten Suchergebnisse. Artwork[] bedeutet: eine Liste von Artwork.
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Die Funktion wird als Initialisierer übergeben: nicht bei jedem Render neu laden.
  // In StrictMode kann React sie zur Prüfung in der Entwicklung zweimal aufrufen.
  const [gallery, setGallery] = useState<SavedArtwork[]>(loadGallery);

  // Laden und Fehler sind eigener State, damit die Oberfläche passend reagieren kann.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Der Effect gleicht React mit dem Browser-Speicher ab: nach dem ersten Render
  // und wenn gallery sich ändert. JSON.stringify verpackt die ganze Liste als Text.
  // Auch Notizen und Entfernen laufen darüber. Kein extra Speicherknopf nötig, yay.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
      // oxlint-disable-next-line react/set-state-in-effect -- Report the result of synchronizing external browser storage.
      setStorageError("");
    } catch {
      // Im State bleibt die Galerie benutzbar, auch wenn dauerhaftes Speichern scheitert.
      // oxlint-disable-next-line react/set-state-in-effect -- Keep a storage failure visible without crashing the gallery.
      setStorageError("Your browser could not save this gallery. Keep this tab open; changes may be lost after a reload.");
    }
  }, [gallery]);

  // Enter und Whooosh landen beide hier, weil das Formular onSubmit verwendet.
  // Der Event-Typ sagt TypeScript, dass dieses Ereignis zu einem HTML-Formular gehört.
  async function searchHandle(event: SubmitEvent<HTMLFormElement>) {
    // Kein normales Formular-Nachladen: Unsere React-App übernimmt die Suche.
    event.preventDefault();

    // Nur Leerzeichen oder gerade schon am Suchen? Dann schicken wir nichts los.
    if (!query.trim() || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Der Service übernimmt fetch und Zod. await wartet auf das Ergebnis,
      // ohne währenddessen den Browser festzuhalten.
      const result = await artworkSearch(query.trim());
      setArtworks(result);
      setHasSearched(true);
    } catch (error) {
      // Ein fetch-Netzwerkfehler ist typischerweise ein TypeError.
      // Service-Fehler dürfen ihre Nachricht zeigen; bei Zod erklären wir das Datenproblem.
      setError(error instanceof TypeError
        ? "Could not connect to the museum. Check your connection and try again."
        : error instanceof Error && !(error instanceof z.ZodError)
          ? error.message
          : "The museum returned artwork data we could not read. Please try a different search.");
    } finally {
      // Egal ob Treffer oder Fehler: Der Ladezustand muss wieder aus.
      setLoading(false);
    }
  }

  function addArtwork(artwork: Artwork) {
    // Keine doppelten Kunstwerke: some prüft, ob diese ID schon dabei ist.
    // Einmal Monet reicht erstmal. xD
    const alreadySaved = gallery.some((saved) => saved.id === artwork.id);

    if (alreadySaved) {
      return;
    }

    // Aus dem Suchtreffer wird ein Galerieeintrag mit eigener, erstmal leerer Notiz.
    const savedArtwork = SavedArtworkSchema.parse({
      ...artwork,
      note: "",
    });

    // current ist der aktuelle State. Spread übernimmt die Einträge in eine neue Liste,
    // statt das vorhandene State-Array direkt zu verändern.
    setGallery((current) => [...current, savedArtwork]);
  }

  function removeArtwork(id: number) {
    // filter behält alle anderen IDs. Mit dem Eintrag verschwindet auch seine Notiz.
    setGallery((current) => current.filter((artwork) => artwork.id !== id));
  }

  function updateNote(id: number, note: string) {
    // safeParse wirft bei ungültigen Daten keinen Validierungsfehler,
    // sondern liefert success: false. Mehr als 500 Zeichen übernehmen wir nicht.
    const result = z.string().max(500).safeParse(note);

    if (!result.success) {
      return;
    }

    // map baut eine neue Liste. Nur das Kunstwerk mit der passenden ID bekommt
    // eine neue Objektkopie mit neuer Notiz; der Rest bleibt, wie er ist.
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
        {/* Die Buttons wechseln nur view. Suche und Galerie-State bleiben in App erhalten. */}
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
              {/* Kontrolliertes Suchfeld: value kommt aus query, onChange schreibt dorthin zurück. */}
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
                  // Daraus entsteht der sichtbare Saved-Zustand samt deaktiviertem Button.
                  const isSaved = gallery.some((saved) => saved.id === artwork.id);
                  return (
                    // key hilft React, die Karten über ihre IDs wiederzuerkennen.
                    // Der Button zwischen den Tags kommt in ArtworkCard als children an.
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
          // Daten gehen als Props nach unten, Aktionen als Callback wieder zu App.
          // Hier bleibt die gemeinsame Galerie-Verwaltung an einer Stelle.
          <Gallery artworks={gallery} onRemove={removeArtwork} onUpdateNote={updateNote} />
        )}
      </main>
      <footer className="site-footer"><span>artelier. <span className="footer-tagline">A little art, a little you.</span></span><span>Collection by <a href="https://www.artic.edu/" target="_blank" rel="noreferrer">Art Institute of Chicago ↗</a></span><span>Made with curiosity · Katcoded</span></footer>
    </div>
  );
}

export default App;
