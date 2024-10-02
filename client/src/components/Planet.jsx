import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import HomeButton from "./HomeButton";

export default function Planet() {
  const { id } = useParams();
  const [planet, setPlanet] = useState(null);
  const [films, setFilms] = useState([]);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SWAPI_API_URL}/planets/${id}`)
      .then((response) => response.json())
      .then((data) => setPlanet(data));

    fetch(`${import.meta.env.VITE_SWAPI_API_URL}/planets/${id}/films`)
      .then((response) => response.json())
      .then((data) => setFilms(data));

    fetch(`${import.meta.env.VITE_SWAPI_API_URL}/planets/${id}/characters`)
      .then((response) => response.json())
      .then((data) => setCharacters(data));
  }, [id]);

  if (!planet) {
    return <div className="loading">Loading...</div>;
  }
console.log("POP:",planet);
  return (
    <div className="container">
      <HomeButton />
      <h2>{planet.name}</h2>
      <div className="planet-details">
        <p>
          <strong>Climate:</strong> {planet.climate}
        </p>
        <p>
          <strong>Terrain:</strong> {planet.terrain}
        </p>
        <p>
          <strong>Gravity:</strong> {planet.gravity}
        </p>
        <p>
          <strong>Diameter:</strong> {planet.diameter} km
        </p>
        <p>
          <strong>Rotation Period:</strong> {planet.rotation_period} hours
        </p>
        <p>
          <strong>Orbital Period:</strong> {planet.orbital_period} days
        </p>
        <p>
          <strong>Surface Water:</strong> {planet.surface_water}%
        </p>
        <p>
          <strong>Population:</strong>{" "}
          {typeof(planet.population) === 'string' ? planet.population : parseInt(planet.population).toLocaleString()}
        </p>
      </div>

      <h3>Films</h3>
      <ul>
        {films.map((film) => (
          <li key={film.id}>
            <Link to={`/film/${film.id}`}>{film.title}</Link>
          </li>
        ))}
      </ul>

      <h3>Characters</h3>
      <ul>
        {characters.map((character) => (
          <li key={character.id}>
            <Link to={`/character/${character.id}`}>{character.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
