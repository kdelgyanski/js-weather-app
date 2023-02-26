require('dotenv').config;
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

const BASE_URL = 'http://dataservice.accuweather.com/';
const LOCATION_PATH = 'locations/v1/cities/search';
const CURRENT_CONDITIONS_PATH = 'currentconditions/v1/';

const getWeather = async (req, res, next) => {
    try {
        const locationData = await getLocation(req.query.location);

        const currentConditions = await getCurrentConditions(locationData.Key);

        res.status(200).json({ locationData, currentConditions });
    } catch (err) {
        throw new Error(err.message);
    }
};

const getLocation = async (location) =>
    get(`${BASE_URL}${LOCATION_PATH}?apikey=${process.env.API_KEY}&q=${location}`);

const getCurrentConditions = async (locationKey) =>
    get(`${BASE_URL}${CURRENT_CONDITIONS_PATH}${locationKey}?apikey=${process.env.API_KEY}`);

const get = async (url) =>
    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => data[0])
        .catch(err => new Error(err.message));

exports.getWeather = getWeather;