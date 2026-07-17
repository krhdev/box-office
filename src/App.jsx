import React, { useState } from 'react';
import './index.css';

function App() {
  const [query, setQuery] = useState('');
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const fetchShows = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) throw new Error('Failed to fetch shows');
      const data = await response.json();
      setShows(data);
    } catch (err) {
      setError('Something went wrong fetching shows. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchShows(query);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Box Office</h1>
        <p>Search TV shows powered by TVMaze</p>
      </header>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a show..."
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">{error}</p>}

      {!loading && !error && !searched && (
        <p className="status">Search for a TV show to get started.</p>
      )}

      {!loading && !error && searched && shows.length === 0 && (
        <p className="status">No shows found. Try another search.</p>
      )}

      <div className="grid">
        {shows.map(({ show }) => (
          <div className="card" key={show.id}>
            {show.image ? (
              <img src={show.image.medium} alt={show.name} />
            ) : (
              <div className="no-image">No image</div>
            )}
            <div className="card-body">
              <h2>{show.name}</h2>
              <p className="meta">
                {show.genres.join(', ') || 'Unknown genre'}
                {show.premiered ? ` • ${show.premiered.slice(0, 4)}` : ''}
              </p>
              {show.rating?.average && (
                <p className="rating">⭐ {show.rating.average}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
