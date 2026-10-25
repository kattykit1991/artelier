import { useState, type SubmitEvent } from "react";
import { artworkSearch } from "./services/artworkServices";
import type { Artwork } from "./schemas/artworkSchema";
import ArtworkCard from "./components/ArtworkCard";

function App() {
  const [query, setQuery] = useState("");
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  async function searchHandle(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await artworkSearch(query);
    setArtworks(result);
  }

  return (
    <div>
      <h1>ARTELIER</h1>

      <form onSubmit={searchHandle}>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <button type="submit">Whooosh!</button>
      </form>

      <section>
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </section>
    </div>
  );
}

export default App;
