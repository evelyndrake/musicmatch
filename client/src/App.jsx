// App.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Player from './Player';
import Card from './Card';
import './App.css';
import {Layout, Form, Typography, Button, Input, Collapse} from 'antd';

const {Title, Text} = Typography;
const {Header, Content} = Layout;
const {Panel} = Collapse;
function App() {
  // State variables
  const [data, setData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [videoId, setVideoId] = useState('2g811Eo7K8U');
  const [stage, setStage] = useState(0);
  const [previousRecommendations, setPreviousRecommendations] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const playerRef = useRef(null);
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const handleInputChange = event => { // Handle input change
    setSearchText(event.target.value);
  }
  const changeVideo = newVideoId => { // Change video
    setVideoId(newVideoId);
  }
  
  const handleYesClick = () => { // Handle yes click
    setLikedSongs([...likedSongs, {title: currentTitle, id: videoId}]);
    getNextSong();
  }

  const getInitialSong = () => { // Get initial song
    axios.get(`http://localhost:5000/api/recsfromsearch/${searchText}`) // Get recommendations from search
      .then(response => {
        // console.log("Picking a song from initial recommendations:");
        // console.log(response.data);
        setPreviousRecommendations(response.data);
        const randomIndex = Math.floor(Math.random() * response.data.length);
        const randomVideoId = response.data[randomIndex].youtubeId;
        setVideoId(randomVideoId);
        setCurrentTitle(response.data[randomIndex].title);
        setStage(1);
      })
      .catch(error => console.error(error));
  }

  const getNextSong = async () => { // Get next song

  axios.get(`http://localhost:5000/api/recsfromid/${videoId}`)
    .then(response => {
      // console.log("Picking another song from next song recommendations:");
      // console.log(response.data)
      setPreviousRecommendations(response.data);
      const randomIndex = Math.floor(Math.random() * response.data.length);
      const randomVideoId = response.data[randomIndex].youtubeId;
      setVideoId(randomVideoId);
      setCurrentTitle(response.data[randomIndex].title);
    })

  }

  const getRandomSong = () => { // Get random song
    axios.get('http://localhost:5000/api/randomsongyoutube')
      .then(response => {
        // console.log("Picking a random song...");
        // console.log(response.data);
        setPreviousRecommendations(response.data);
        const randomIndex = Math.floor(Math.random() * response.data.length);
        const randomVideoId = response.data[randomIndex].youtubeId;
        setVideoId(randomVideoId);
        setCurrentTitle(response.data[randomIndex].title);
      })
      .catch(error => console.error(error));
  }

  const getRandomSongInitial = () => { // Get random song
    axios.get('http://localhost:5000/api/randomsongyoutube')
      .then(response => {
        // console.log("Picking a random song...");
        // console.log(response.data);
        setPreviousRecommendations(response.data);
        const randomIndex = Math.floor(Math.random() * response.data.length);
        const randomVideoId = response.data[randomIndex].youtubeId;
        setVideoId(randomVideoId);
        setCurrentTitle(response.data[randomIndex].title);
        setStage(1);
      })
      .catch(error => console.error(error));
  }

  const getSongFromOldRecs = () => { // Get song from old recommendations
    console.log("Picking another song from previous recommendations...");
    const index = Math.floor(Math.random() * previousRecommendations.length);
    setVideoId(previousRecommendations[index].youtubeId);
    setCurrentTitle(previousRecommendations[index].title);
  }

  const swipeLeft = () => { // Swipe left
    getSongFromOldRecs();
  }

  const swipeRight = () => { // Swipe right
    setLikedSongs([...likedSongs, {title: currentTitle, id: videoId}]);
    getNextSong();
  }

  return (
    // TODO: Make the UI better lol
    <Layout className='App'>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e1e2e' }}>
        <Title style={{color: '#f5c2e7'}} level={3}>Music Match</Title>
      </Header>
      <Content style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', margin: 'auto', paddingTop: '20px', height:'100vh', backgroundColor:'#45475a' }}>
        {stage === 0 && (
          <>
            <Text className="text-plain">Let's start with a song, artist, or album that you already like...</Text>
            <Form onFinish={getInitialSong} style={{paddingTop: '20px'}}>
              <Form.Item name="searchText">
                <Input placeholder='Search' value={searchText} onChange={handleInputChange} />
              </Form.Item>
              <Form.Item>
                <Button className="button-plain" type="default" htmlType="submit">Search</Button>
              </Form.Item>
            </Form>
            <Text className="text-plain">Or...</Text>
            <Button className="button-success" type="primary" onClick={getRandomSongInitial} style={{marginTop: '10px'}}>Surprise me!</Button>
          </>
        )}
        {stage === 1 && (
          <>
            <Card title={currentTitle} videoId={videoId} swipeLeft={swipeLeft} swipeRight={swipeRight} />
            {/* <Text style={{paddingBottom:'20px'}} className='text-plain'>You are listening to: {currentTitle}</Text>
            <Player videoId={videoId} ref={playerRef} />
            <Text style={{paddingBottom:'10px'}} className='text-plain'>Did you like this song?</Text>
            <div style={{ paddingTop: '0px', display: 'flex', justifyContent: 'space-between', width: '200px' }}>
              <Button className='button-danger' type="default" onClick={() => getRandomSong()} style={{ flex: 1}}>No</Button>
              <Button className='button-plain' type="default" onClick={() => getSongFromOldRecs()} style={{ flex: 1, marginLeft: '10px' }}>Kinda</Button>
              <Button className='button-success' type="primary" onClick={handleYesClick} style={{ flex: 1, marginLeft: '10px' }}>Yes</Button>
            </div> */}
            <div style={{ maxHeight: '200px', width: '20%', marginTop: '10px', overflowY: 'auto' } }>
              <Collapse>
                <Panel header="Songs you liked" key="1" style={{backgroundColor: '#FFFFFF'}}>
                  <ul >
                    {likedSongs.map((song, index) => (
                      <li className='text-list' key={index} style={{ listStyleType: 'disc' }}>
                        <a className='list-link' href={`https://www.youtube.com/watch?v=${song.id}`} target="_blank" rel="noopener noreferrer">
                          {song.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </Collapse>
            </div>
          </>
        )}
      </Content>
    </Layout>
  );
}

export default App;