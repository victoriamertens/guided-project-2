import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import HomeButton from "./HomeButton";

export default function Character() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [films, setFilms] = useState([]);
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SWAPI_API_URL}/characters/${id}`)
      .then((response) => response.json())
      .then((data) => setCharacter(data));

    fetch(`${import.meta.env.VITE_SWAPI_API_URL}/characters/${id}/films`)
      .then((response) => response.json())
      .then((data) => setFilms(data));

    fetch(`${import.meta.env.VITE_SWAPI_API_URL}/characters/${id}/planets`)
      .then((response) => response.json())
      .then((data) => setPlanets(data));



  }, [id]);

  if (!character) {
    return <div className="loading">Loading...</div>;
  }
let homeplanet = planets.filter(pl => pl.id === character.homeworld); 
console.log(homeplanet);
  return (
    <div className="container">
      <HomeButton />
      <h2>{character.name}</h2>
      <div className="character-details">
        <p>
          <strong>Gender:</strong> {character.gender}
        </p>
        <p>
          <strong>Height:</strong> {character.height} cm
        </p>
        <p>
          <strong>Mass:</strong> {character.mass} kg
        </p>
        <p>
          <strong>Hair Color:</strong> {character.hair_color}
        </p>
        <p>
          <strong>Skin Color:</strong> {character.skin_color}
        </p>
        <p>
          <strong>Eye Color:</strong> {character.eye_color}
        </p>
        <p>
          <strong>Birth Year:</strong> {character.birth_year}
        </p>
        <p>
          <strong>Homeworld:</strong> {homeplanet[0]?.name}
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
