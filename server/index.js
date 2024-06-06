const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');

let ytmusic;

import('node-youtube-music').then(module => {
  ytmusic = module;
});

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.get('/api/search/:query', async (req, res) => {
  const query = req.params.query;
  const result = await ytmusic.searchMusics(query);
  res.json(result);
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
