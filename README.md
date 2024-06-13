# MusicMatch
![Demo](docs/demo.gif)
- This will eventually be a web app to help users discover new music
- It will function similarly to a dating app, where users are given a queue of random songs
- They will swipe either left or right, and right swipes will add the song to a playlist
## Setup
- Open two terminal windows for both the client and server
- client
  - `cd client`
  - `npm install`
  - `npm start`
- server
  - `cd server`
  - `npm install`
  - `node index.js`
- Hosting this yourself will require you to sign up for a [Genius API app](https://genius.com/api-clients)
- Ensure that the server directory contains a `.env` file with the following properties:
  - `PORT` - The port to run the server on
  - `CLIENT_ID` - The client ID token from your Genius API app
  - `CLIENT_SECRET` - The client secret token from your Genius API app
  - `ACCESS_TOKEN` - The access token from your Genius API app
- The client runs on `localhost:3000` and the server runs on `localhost:5000`
- Enjoy!