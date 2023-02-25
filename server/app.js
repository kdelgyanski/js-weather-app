require('dotenv').config();
const express = require('express');
const PORT = 5555;

const app = express();

app.get('/api/weather', (req, res) => {
    // TODO
});

app.listen(PORT, () => console.log(`Started server successfully. Listening on port ${PORT}.`));