import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from "dotenv"; 

//const express = require('express')
dotenv.config(); 
const app = express();
const PORT = 3000;
const MONGO_URL = process.env.MONGO_DB_URL; 
const DB_NAME = process.env.MONGO_DB;  


app.get('/', (_, res) => {
    console.log("test")
    res.send('Hello world.')
})


//get films by character 



  app.get('/api/characters/:id/films', async (req, res)=> { 
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

    
    console.log("In get character films by id route:", characterId);
    try{
    const client = await MongoClient.connect(MONGO_URL);
    const db = client.db(DB_NAME);
    const collection = db.collection('characters');
    const characterFilms = await collection.aggregate(aggregateQuery).toArray();
    console.log("CHAR FILM:", characterFilms);
    res.json(characterFilms);
    } catch (err) { 
        console.log("Error on GET /api/characters/:id/films: ", err);
        res.sendStatus(500); 
    }
})

//get character by id
app.get('/api/characters/:id', async (req, res)=> { 
    const characterId = Number(req.params.id); 
    console.log("In get characters by id route:", characterId);
    try{
    const client = await MongoClient.connect(MONGO_URL);
    const db = client.db(DB_NAME);
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
    const client = await MongoClient.connect(MONGO_URL);
    const db = client.db(DB_NAME);
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
    const client = await MongoClient.connect(MONGO_URL);
    const db = client.db(DB_NAME);
    const collection = db.collection('planets');
    const planets = await collection.find({"id" : characterId}).toArray();
    res.json(planets);
    } catch (err) { 
        console.log("Error on GET /api/planets: ", err);
        res.sendStatus(500); 
    }
})

//get all planets 
app.get('/api/planets', async (_, res)=> { 
    try{
    const client = await MongoClient.connect(MONGO_URL);
    const db = client.db(DB_NAME);
    const collection = db.collection('planets');
    const planets = await collection.find({}).toArray();
    console.log("planets:" , collection);
    res.json(planets);
    } catch (err) { 
        console.log("Error on GET /api/planets: ", err);
        res.sendStatus(500); 
    }
})



app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}.`)
})