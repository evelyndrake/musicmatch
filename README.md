# MusicMatch
![Demo](docs/demo.gif)
- This is a web app to help users discover new music
- It functions similarly to a dating app, where users are given a queue of random songs
- They swipe either left or right, and right swipes will add the song to a playlist
## Setup
- Open two terminal windows for both the client and server
- client
  - `cd client`
  - `npm install`
- server
  - `cd server`
  - `npm install`
- `cd ..` back to the initial folder and run `npm run dev`
- Hosting this yourself will require you to sign up for a [Genius API app](https://genius.com/api-clients)
- Ensure that the directory contains a `.env` file with the following properties:
  - `PORT` - The port to run the server on
  - `CLIENT_ID` - The client ID token from your Genius API app
  - `CLIENT_SECRET` - The client secret token from your Genius API app
  - `ACCESS_TOKEN` - The access token from your Genius API app
- The client runs on `localhost:3000` and the server runs on `localhost:5000`
- Enjoy!