// App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

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

  const handleInputChange = event => {
    setSearchText(event.target.value);
  }
  
  const apiCall = () => {
    axios.get(`http://localhost:5000/api/search/${searchText}`)
      .then(response => {
        console.log(response.data)
      })
      .catch(error => console.error(error));
  }

  return (
    <div className='App'>
      <h1>Hello, World</h1>
      <form onSubmit={event => { event.preventDefault(); apiCall(); }}>
        <input type='text' placeholder='Search' value={searchText} onChange={handleInputChange} />
        <button type="submit">Search</button>
      </form>
    </div>
    
  );
}

export default App;