const express = require('express');
const app = express();
const cors = require('cors');
const env = require('dotenv').config();
const axios = require('axios');
let ytmusic;

import('node-youtube-music').then(module => {
  ytmusic = module;
});

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const clientSecret = process.env.CLIENT_SECRET;
const clientId = process.env.CLIENT_ID;
const accessToken = "?access_token=" + process.env.ACCESS_TOKEN;
const PORT = process.env.PORT || 5000;
var APISong = "https://api.genius.com/songs/";
var maxSong = 5000000;

function getRandomInt(min, max) { // Get random integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.use(cors(corsOptions));

app.get('/api/search/:query', async (req, res) => { // Search
  const query = req.params.query;
  const result = await ytmusic.searchMusics(query);
  res.json(result);
});

app.get('/api/recsfromsearch/:query', async (req, res) => { // Get recommendations from search query
  const query = req.params.query;
  const song = await ytmusic.searchMusics(query);
  const result = await ytmusic.getSuggestions(song[0].youtubeId);
  res.json(result);
});

app.get('/api/recsfromid/:id', async (req, res) => { // Get recommendations from ID
  const id = req.params.id;
  const result = await ytmusic.getSuggestions(id);
  res.json(result);
});

app.get('/api/randomsong', async (req, res) => { // Get random song title from Genius
  const randomSong = getRandomInt(1, maxSong);
  axios.get(APISong + randomSong + accessToken)
  .then(response => {
    // console.log(response.data.response.song.full_title);
    const song = response.data.response.song;
    res.json(song);
  })
  .catch(error => {
    console.error(error);
  });
});

app.get('/api/randomsongyoutube', async (req, res) => { // Get random song from YouTube
  while (true) {
    const randomSong = getRandomInt(1, maxSong);
    try {
      const response = await axios.get(APISong + randomSong + accessToken);
      const title = response.data.response.song.full_title;
      // console.log(title);
      const song = await ytmusic.searchMusics(title);
      const result = await ytmusic.getSuggestions(song[0].youtubeId);
      res.json(result);
      break;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Song not found, trying again...');
      } else {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
        break;
      }
    }
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
