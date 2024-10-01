import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from "dotenv"; 

//const express = require('express')
dotenv.config(); 
const app = express();
const PORT = 3000;
const MONGO_URL = process.env.MONGO_DB_URL; 
// const mongodb = MongoClient(mongoURL); 


app.get('/', (_, res) => {
    console.log("test")
    res.send('Hello world.')
})

app.get('/api/planets', (_, res) => {
    res.send('Planets')
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}.`)
})