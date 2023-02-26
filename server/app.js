require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { getWeather } = require('./controller');

const PORT = 5555;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    next();
});

app.get('/api/weather', getWeather);

app.use((req, res, next) => {
    throw new Error('Could not found this route.');
});

app.listen(PORT, () => console.log(`Started server successfully. Listening on port ${PORT}.`));