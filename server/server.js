import express from 'express';

//const express = require('express')
const app = express();
const port = 3000;

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