// App.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Player from './Player';
import './App.css';
import {Layout, Form, Typography, Button, Input} from 'antd';
const {Title, Text} = Typography;
const {Header, Content} = Layout;

const testAPI = () => {
  axios.get('http://localhost:5000/api/test')
    .then(response => {
      console.log(response.data)
    })
    .catch(error => console.error(error));
}

function App() {
  const [data, setData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [videoId, setVideoId] = useState('2g811Eo7K8U');
  const [stage, setStage] = useState(0);
  const [previousRecommendations, setPreviousRecommendations] = useState([]);
  const playerRef = useRef(null);
  const handleInputChange = event => {
    setSearchText(event.target.value);
  }
  
  const changeVideo = newVideoId => {
    setVideoId(newVideoId);
  }
  
  const getInitialSong = () => {
    axios.get(`http://localhost:5000/api/recsfromsearch/${searchText}`)
      .then(response => {
        console.log("Picking a song from initial recommendations:");
        console.log(response.data);
        setPreviousRecommendations(response.data);
        // Pick an object between 1 and max index
        const randomIndex = Math.floor(Math.random() * response.data.length);
        const randomVideoId = response.data[randomIndex].youtubeId;
        setVideoId(randomVideoId);
        setStage(1);
      })
      .catch(error => console.error(error));
  }

  const getNextSong = async () => {
    if (playerRef.current) {
      axios.get(`http://localhost:5000/api/recsfromid/${videoId}`)
        .then(response => {
          console.log("Picking another song from next song recommendations:");
          console.log(response.data)
          setPreviousRecommendations(response.data);
          // Pick an object between 1 and max index
          const randomIndex = Math.floor(Math.random() * response.data.length);
          const randomVideoId = response.data[randomIndex].youtubeId;
          setVideoId(randomVideoId);
        })
    }
  }

  const getSongFromOldRecs = () => {
    console.log("Picking another song from previous recommendations...");
    const index = Math.floor(Math.random() * previousRecommendations.length);
    setVideoId(previousRecommendations[index].youtubeId);
  }

  return (
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
          </>
        )}
        {stage === 1 && (
          <>
            <Player videoId={videoId} ref={playerRef} />
            <Text className='text-plain'>Did you like this song?</Text>
            <div style={{ paddingTop: '20px', display: 'flex', justifyContent: 'space-between', width: '200px' }}>
              <Button className='button-danger' type="default" onClick={() => getSongFromOldRecs()} style={{ flex: 1, marginRight: '10px' }}>No</Button>
              <Button className='button-success' type="primary" onClick={() => getNextSong()} style={{ flex: 1, marginLeft: '10px' }}>Yes</Button>
            </div>
          </>
        )}
      </Content>
    </Layout>
  );
}

export default App;