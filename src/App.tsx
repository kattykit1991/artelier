import { useState } from "react";
import { artworkSearch } from "./services/artworkServices";

function App() {
  const [query, setQuery] = useState("");
  async function searchHandle() {
    const result = await artworkSearch(query);
    console.log(result);
  }
  return (
    <div>
      <h1>ARTELIER</h1>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="button" onClick={searchHandle}>
        Whooosh!
      </button>
    </div>
  );
}

export default App;
