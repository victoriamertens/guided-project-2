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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
