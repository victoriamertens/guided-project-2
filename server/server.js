import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from "dotenv"; 

dotenv.config(); // Load environment variables from .env

const app = express();
const port = 3000;

const url = process.env.MONGO_DB_URL;
const dbName = process.env.MONGO_DB_NAME;
const filmsCollectionName = process.env.COLLECTION_FILMS;
const charactersCollectionName = process.env.COLLECTION_CHARACTERS;
const planetsCollectionName = process.env.COLLECTION_PLANETS;
const filmsPlanetsCollectionName = process.env.COLLECTION_FILMS_PLANETS;
const filmsCharactersCollectionName = process.env.COLLECTION_FILMS_CHARACTERS;


app.get('/', (_, res) => {
    console.log("test")
    res.send('Hello world.')
})


// Route to get all films
app.get('/api/films', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(filmsCollectionName);

        const films = await collection.find().toArray();

        client.close();
        res.json(films);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to get a film by its ID
app.get('/api/films/:id', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(filmsCollectionName);
     
        const filmId = parseInt(req.params.id); 
        const film = await collection.findOne({ id: filmId }); 

        client.close();
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
app.get('/api/films/:id/characters', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const filmId = parseInt(req.params.id); 
        
        const filmsCharactersCollection = db.collection(filmsCharactersCollectionName);
        const charactersCollection = db.collection(charactersCollectionName);
        
        const filmCharacters = await filmsCharactersCollection.find({ film_id: filmId }).toArray();
        const characterIds = filmCharacters.map(fc => fc.character_id);
        
        
        const characters = await charactersCollection.find({ id: { $in: characterIds } }).toArray();

        client.close();
        res.json(characters);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to get planets for a specific film by film ID
app.get('/api/films/:id/planets', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const filmId = parseInt(req.params.id);  
        
        const filmsPlanetsCollection = db.collection(filmsPlanetsCollectionName);
        const planetsCollection = db.collection(planetsCollectionName);
        
        const filmPlanets = await filmsPlanetsCollection.find({ film_id: filmId }).toArray();
        const planetIds = filmPlanets.map(fp => fp.planet_id); 

        const planets = await planetsCollection.find({ id: { $in: planetIds } }).toArray();

        client.close();
        res.json(planets);
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
})

// Route to get planets for a specific film by film ID
app.get('/api/characters/:id/films', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const characterId = parseInt(req.params.id);  
        
        const filmsCharactersCollection = db.collection(filmsCharactersCollectionName);
        const filmsCollection = db.collection(filmsCollectionName);
        
        const filmCharacters = await filmsCharactersCollection.find({ character_id: characterId }).toArray();
        const filmsIds = filmCharacters.map(fp => fp.film_id); 

        const planets = await filmsCollection.find({ id: { $in: filmsIds } }).toArray();

        client.close();
        res.json(planets);
    } catch (error) {
        res.status(500).send(error);
    }
});

//get character by id
app.get('/api/characters/:id', async (req, res)=> { 
    const characterId = Number(req.params.id); 
    console.log("In get characters by id route:", characterId);
    try{
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection('characters');
    const characters = await collection.find({"id" : characterId}).toArray();
    res.json(characters);
    } catch (err) { 
        console.log("Error on GET /api/characters: ", err);
        res.sendStatus(500); 
    }
})

//get all characters 
app.get('/api/characters', async (_, res)=> { 
    try{
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection('characters');
    const characters = await collection.find({}).toArray();
    console.log("CHARACTERS:" , collection);
    res.json(characters);
    } catch (err) { 
        console.log("Error on GET /api/characters: ", err);
        res.sendStatus(500); 
    }
})

//get planet by id
app.get('/api/planets/:id', async (req, res)=> { 
    const characterId = Number(req.params.id); 
    console.log("In get planets by id route:", characterId);
    try{
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection('planets');
    const planets = await collection.find({"id" : characterId}).toArray();
    res.json(planets);
    } catch (err) { 
        console.log("Error on GET /api/planets: ", err);
        res.sendStatus(500); 
    }
})

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
})
//Get films by planet id 
app.get('/api/planets/:id/films', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const planetId = parseInt(req.params.id);  
        
        const filmsPlanetsCollection = db.collection(filmsPlanetsCollectionName);
        const filmsCollection = db.collection(filmsCollectionName);
        
        const planetFilms = await filmsPlanetsCollection.find({ planet_id: planetId }).toArray();
        const filmsIds = planetFilms.map(fp => fp.film_id); 

        const planets = await filmsCollection.find({ id: { $in: filmsIds } }).toArray();

        client.close();
        res.json(planets);
    } catch (error) {
        res.status(500).send(error);
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
})
//GET characters by planet id
app.get('/api/planets/:id/characters', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const filmId = parseInt(req.params.id);  
        
        const filmsPlanetsCollection = db.collection(filmsPlanetsCollectionName);
        const planetsCollection = db.collection(planetsCollectionName);
        
        const filmPlanets = await filmsPlanetsCollection.find({ film_id: filmId }).toArray();
        const planetIds = filmPlanets.map(fp => fp.planet_id); 

        const planets = await planetsCollection.find({ id: { $in: planetIds } }).toArray();

        client.close();
        res.json(planets);
    } catch (error) {
        res.status(500).send(error);
    }
});


//get all planets 
app.get('/api/planets', async (_, res)=> { 
    try{
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection('planets');
    const planets = await collection.find({}).toArray();
    console.log("planets:" , collection);
    res.json(planets);
    } catch (err) { 
        console.log("Error on GET /api/planets: ", err);
        res.sendStatus(500); 
    }
}); 





app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}.`)
})