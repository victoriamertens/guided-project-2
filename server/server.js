import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = 3000;

const url = process.env.MONGO_DB_URL;
const dbName = process.env.MONGO_DB_NAME;
const collections = {
  films: process.env.COLLECTION_FILMS,
  characters: process.env.COLLECTION_CHARACTERS,
  planets: process.env.COLLECTION_PLANETS,
  filmsPlanets: process.env.COLLECTION_FILMS_PLANETS,
  filmsCharacters: process.env.COLLECTION_FILMS_CHARACTERS,
};

app.use(cors());

app.get("/", (_, res) => {
  res.send("Hello world.");
});

// Helper function to connect to the database
const connectDB = async () => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client.db(dbName);
};

// ********** CHARACTERS ENDPOINTS **********

// Route to get all characters
app.get("/api/characters", async (_, res) => {
  try {
    const db = await connectDB();
    const characters = await db
      .collection(collections.characters)
      .find()
      .toArray();
    res.json(characters);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to get a character by ID
app.get("/api/characters/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const character = await db
      .collection(collections.characters)
      .findOne({ id: parseInt(req.params.id) });
    if (character) {
      res.json(character);
    } else {
      res.status(404).send("Character not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to get films by character ID
app.get("/api/characters/:id/films", async (req, res) => {
  try {
    const db = await connectDB();
    const characterId = parseInt(req.params.id);

    const filmCharacterMappings = await db
      .collection(collections.filmsCharacters)
      .find({ character_id: characterId })
      .toArray();
    const filmIds = filmCharacterMappings.map((fm) => fm.film_id);

    const films = await db
      .collection(collections.films)
      .find({ id: { $in: filmIds } })
      .toArray();
    res.json(films);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to get planets for a specific character by character ID
app.get("/api/characters/:id/planets", async (req, res) => {
  try {
    const db = await connectDB();
    const characterId = parseInt(req.params.id);

    const characterPlanets = await db
      .collection(collections.filmsCharacters)
      .find({ character_id: characterId })
      .toArray();
    const filmIds = characterPlanets.map((cp) => cp.film_id);

    const filmPlanets = await db
      .collection(collections.filmsPlanets)
      .find({ film_id: { $in: filmIds } })
      .toArray();
    const planetIds = filmPlanets.map((fp) => fp.planet_id);

    const planets = await db
      .collection(collections.planets)
      .find({ id: { $in: planetIds } })
      .toArray();
    res.json(planets);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ********** FILMS ENDPOINTS **********

// Route to get all films
app.get("/api/films", async (req, res) => {
  try {
    const db = await connectDB();
    const films = await db.collection(collections.films).find().toArray();
    res.json(films);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to get a film by its ID
app.get("/api/films/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const film = await db
      .collection(collections.films)
      .findOne({ id: parseInt(req.params.id) });
    if (film) {
      res.json(film);
    } else {
      res.status(404).send("Film not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to get characters for a specific film by film ID
app.get("/api/films/:id/characters", async (req, res) => {
  try {
    const db = await connectDB();
    const filmId = parseInt(req.params.id);

    const filmCharacters = await db
      .collection(collections.filmsCharacters)
      .find({ film_id: filmId })
      .toArray();
    const characterIds = filmCharacters.map((fc) => fc.character_id);

    const characters = await db
      .collection(collections.characters)
      .find({ id: { $in: characterIds } })
      .toArray();
    res.json(characters);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to get planets for a specific film by film ID
app.get("/api/films/:id/planets", async (req, res) => {
  try {
    const db = await connectDB();
    const filmId = parseInt(req.params.id);

    const filmPlanets = await db
      .collection(collections.filmsPlanets)
      .find({ film_id: filmId })
      .toArray();
    const planetIds = filmPlanets.map((fp) => fp.planet_id);

    const planets = await db
      .collection(collections.planets)
      .find({ id: { $in: planetIds } })
      .toArray();
    res.json(planets);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ********** PLANETS ENDPOINTS **********

// Route to get all planets
app.get("/api/planets", async (_, res) => {
  try {
    const db = await connectDB();
    const planets = await db.collection(collections.planets).find().toArray();
    res.json(planets);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to get a planet by ID
app.get("/api/planets/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const planet = await db
      .collection(collections.planets)
      .findOne({ id: parseInt(req.params.id) });
    if (planet) {
      res.json(planet);
    } else {
      res.status(404).send("Planet not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to get characters for a specific planet by planet ID
app.get("/api/planets/:id/characters", async (req, res) => {
  try {
    const db = await connectDB();
    const planetId = parseInt(req.params.id);

    const planetFilms = await db
      .collection(collections.filmsPlanets)
      .find({ planet_id: planetId })
      .toArray();
    const filmIds = planetFilms.map((pf) => pf.film_id);

    const filmCharacterMappings = await db
      .collection(collections.filmsCharacters)
      .find({ film_id: { $in: filmIds } })
      .toArray();
    const characterIds = filmCharacterMappings.map((fc) => fc.character_id);

    const characters = await db
      .collection(collections.characters)
      .find({ id: { $in: characterIds } })
      .toArray();
    res.json(characters);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to get films for a specific planet by planet ID
app.get("/api/planets/:id/films", async (req, res) => {
  try {
    const db = await connectDB();
    const planetId = parseInt(req.params.id);

    const filmPlanets = await db
      .collection(collections.filmsPlanets)
      .find({ planet_id: planetId })
      .toArray();
    const filmIds = filmPlanets.map((fp) => fp.film_id);

    const films = await db
      .collection(collections.films)
      .find({ id: { $in: filmIds } })
      .toArray();

    res.json(films);
  } catch (error) {
    res.status(500).send(error);
  }
});

//AGG get films by character 
app.get('/api/characters/:id/films/agg', async (req, res)=> { 
  const characterId = Number(req.params.id); 
  const aggregateQuery = [
      {
          $match: {id: characterId }
        },
      {
        '$lookup': {
          'from': 'films_characters', 
          'localField': 'id', 
          'foreignField': 'character_id', 
          'as': 'character_films'
        }
      }, {
        '$unwind': {
          'path': '$character_films', 
          'includeArrayIndex': 'string', 
          'preserveNullAndEmptyArrays': false
        }
      }, {
        '$lookup': {
          'from': 'films', 
          'localField': 'character_films.film_id', 
          'foreignField': 'id', 
          'as': 'films'
        }
      }, {
        '$unwind': {
          'path': '$films', 
          'includeArrayIndex': 'string', 
          'preserveNullAndEmptyArrays': false
        }
      }, {
        '$group': {
          '_id': '$_id', 
          'fieldN': {
            '$first': '$name'
          }, 
          'films': {
            '$push': '$films.title'
          }
        }
      }
    ]; 

  try{
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);
  const collection = db.collection('characters');
  const characterFilms = await collection.aggregate(aggregateQuery).toArray();
  console.log("CHAR FILM:", characterFilms);
  res.json(characterFilms);
  } catch (err) { 
      console.log("Error on GET /api/characters/:id/films: ", err);
      res.sendStatus(500); 
  }
});


//AGG get films by planet id
app.get('/api/planets/:id/films/agg', async (req,res) => { 
  const planetId = Number(req.params.id); 
  const aggregateQuery = [
      {
          $match: {id: planetId }
        },
      {
        '$lookup': {
          'from': 'films_planets', 
          'localField': 'id', 
          'foreignField': 'planet_id', 
          'as': 'film_planets'
        }
      }, {
        '$unwind': {
          'path': '$film_planets', 
          'includeArrayIndex': 'string', 
          'preserveNullAndEmptyArrays': false
        }
      }, {
        '$lookup': {
          'from': 'films', 
          'localField': 'film_planets.film_id', 
          'foreignField': 'id', 
          'as': 'films'
        }
      }, {
        '$unwind': {
          'path': '$films', 
          'includeArrayIndex': 'string', 
          'preserveNullAndEmptyArrays': false
        }
      }, {
        '$group': {
          '_id': '$_id', 
          'fieldN': {
            '$first': '$name'
          }, 
          'films': {
            '$push': '$films.title'
          }
        }
      }
    ]; 
    try{
      const client = await MongoClient.connect(url);
      const db = client.db(dbName);
      const collection = db.collection('planets');
      const planetFilms = await collection.aggregate(aggregateQuery).toArray();
      res.json(planetFilms);
      } catch (err) { 
          console.log("Error on GET /api/planets: ", err);
          res.sendStatus(500); 
      }
});

//AGG get characters by planet id
app.get('/api/planets/:id/characters/agg', async (req,res) => { 
  const planetId = Number(req.params.id); 
  const aggregateQuery = [
      {
          $match: {id: planetId }
        },
      {
        '$lookup': {
          'from': 'planets_characters', 
          'localField': 'id', 
          'foreignField': 'planet_id', 
          'as': 'film_characters'
        }
      }, {
        '$unwind': {
          'path': '$film_characters', 
          'includeArrayIndex': 'string', 
          'preserveNullAndEmptyArrays': false
        }
      }, {
        '$lookup': {
          'from': 'films', 
          'localField': 'film_planets.film_id', 
          'foreignField': 'id', 
          'as': 'films'
        }
      }, {
        '$unwind': {
          'path': '$films', 
          'includeArrayIndex': 'string', 
          'preserveNullAndEmptyArrays': false
        }
      }, {
        '$group': {
          '_id': '$_id', 
          'fieldN': {
            '$first': '$name'
          }, 
          'films': {
            '$push': '$films.title'
          }
        }
      }
    ]; 
    try{
      const client = await MongoClient.connect(url);
      const db = client.db(dbName);
      const collection = db.collection('planets');
      const planetFilms = await collection.aggregate(aggregateQuery).toArray();
      res.json(planetFilms);
      } catch (err) { 
          console.log("Error on GET /api/planets: ", err);
          res.sendStatus(500); 
      }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}.`);
});
