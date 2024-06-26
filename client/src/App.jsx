// App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Card from './Card';
import './App.css';
import {Layout, Form, Typography, Button, Input, Collapse} from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const {Title, Text} = Typography;
const {Header, Content} = Layout;
const {Panel} = Collapse;
function App() {
  // State variables
  const [searchText, setSearchText] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [videoId, setVideoId] = useState('2g811Eo7K8U');
  const [stage, setStage] = useState(0);
  const [previousRecommendations, setPreviousRecommendations] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);

  const handleInputChange = event => { // Handle input change
    setSearchText(event.target.value);
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

  const copyLikedSongs = () => { // Copy liked songs
    navigator.clipboard.writeText(likedSongs.map(song => `${song.title} - https://www.youtube.com/watch?v=${song.id}`).join('\n'));
    toast.success('Liked songs copied to clipboard!', {position: 'top-center', autoClose: 1000});
  }

  const saveLikedSongsToFile = () => { // Save liked songs to file
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0];
    const fileName = `likedSongs_${dateString}.txt`;
    const element = document.createElement('a');
    const file = new Blob([likedSongs.map(song => `${song.title} - https://www.youtube.com/watch?v=${song.id}`).join('\n')], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    toast.success('Liked songs downloaded!', {position: 'top-center', autoClose: 1000});
  }

  return (
    <Layout className='App'>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e1e2e' }}>
        <Title style={{color: '#f5c2e7', paddingBottom: '10px'}} level={3}>MusicMatch ♥</Title>
      </Header>
      <Content style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', margin: 'auto', paddingTop: '20px', height:'100vh', backgroundColor:'#45475a' }}>
        {stage === 0 && (
          <>
            <Text className="text-plain">Let's start with a song, artist, or album that you already like...</Text>
            <Form onFinish={getInitialSong} style={{paddingTop: '20px'}}>
              <Form.Item name="searchText">
                <Input placeholder='Search' value={searchText} onChange={handleInputChange}/>
              </Form.Item>
              <Form.Item>
                <Button className="button-plain" type="default" htmlType="submit" style={{ marginTop: '-10px' }}>Search</Button>
              </Form.Item>
            </Form>
            <Text className="text-plain" style={{ marginTop: '-10px' }}>Or...</Text>
            <Button className="button-success" type="primary" onClick={getRandomSongInitial} style={{ marginTop: '20px', width: '10em', height: '2.2em' }}>Surprise me!</Button>
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
            {likedSongs.length > 0 && (
              <div className="controls" style={{ maxHeight: '40%', width: '50%', marginTop: '10px', overflowY: 'auto' } }>
                <Collapse style={{backgroundColor: '#343a40', borderColor: '#343a40'}}>
                  <Panel header="Songs you liked" key="1" style={{backgroundColor: '#343a40'}}>
                    <div className='buttonPanel' style={{marginTop: '-20px'}}>
                      <Button className='button-copy' type="default" onClick={copyLikedSongs}>Copy</Button>
                      <Button className='button-save' type="default" onClick={saveLikedSongsToFile}>Save</Button>
                      <Button className='button-danger' type="default" onClick={() => {setLikedSongs([]); toast.success('Song list cleared!', {position: 'top-center', autoClose: 1000});}}>Clear</Button>
                    </div>
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
            )}
            <ToastContainer />
          </>
        )}
      </Content>
    </Layout>
    
  );
}

export default App;