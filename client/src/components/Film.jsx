import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HomeButton from './HomeButton';

export default function Film() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SWAPI_API_URL}/films/${id}`)
      .then((response) => response.json())
      .then((data) => setFilm(data));

    fetch(`${import.meta.env.VITE_SWAPI_API_URL}/films/${id}/characters`)
      .then((response) => response.json())
      .then((data) => setCharacters(data));

    fetch(`${import.meta.env.VITE_SWAPI_API_URL}/films/${id}/planets`)
      .then((response) => response.json())
      .then((data) => setPlanets(data));
  }, [id]);

  if (!film) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <HomeButton />
      <h2>{film.title} (Episode {film.episode_id})</h2>
      <div className="film-details">
        <p><strong>Director:</strong> {film.director}</p>
        <p><strong>Producer:</strong> {film.producer}</p>
        <p><strong>Release Date:</strong> {new Date(film.release_date).toLocaleDateString()}</p>

        <h3>Opening Crawl</h3>
        <p>{film.opening_crawl.replace(/\r\n/g, ' ')}</p>

      </div>

        <h3>Characters</h3>
        <ul>
          {characters.map((character) => (
            <li key={character.id}>
              <Link to={`/character/${character.id}`}>{character.name}</Link>
            </li>
          ))}
        </ul>

        <h3>Planets</h3>
        <ul>
          {planets.map((planet) => (
            <li key={planet.id}>
              <Link to={`/planet/${planet.id}`}>{planet.name}</Link>
            </li>
          ))}
        </ul>
    </div>
  );
}
