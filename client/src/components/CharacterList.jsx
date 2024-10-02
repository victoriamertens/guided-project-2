import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CharacterList() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SWAPI_API_URL}/characters`)
      .then((response) => response.json())
      .then((data) => setCharacters(data))
      .catch((error) => console.error('Error fetching characters:', error));
  }, []);

  return (
    <div className='container'>
      <h1>Star Wars Characters</h1>
      <ul className="character-list">
        {characters.map((character) => (
          <li key={character.id}>
            <Link to={`/character/${character.id}`}>{character.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
