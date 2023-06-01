import logo from './HomepageCard.gif';
import './App.css';
import './Buttons.css'
import {useEffect, useState} from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:3001"

function App() {
  return (
    <div class="container">
      <div className="App">
        <header className="App-header">
          <h1>
            FinCat
          </h1>
          <img src={logo} className="App-logo" alt="logo" />

          <h3>
            Connect your bank account via Plaid
          </h3>
          <PlaidButton />
        </header>
      </div>
    </div>
  );
}

function PlaidButton() {
  const [token,setToken] = useState();

  useEffect( () => {
    async function fetch() {
      const response  = await axios.post("/create_link_token")
      setToken(response.data.link_token);
      console.log("response",response.data);
    }
    fetch();
  }, [])
  const { open, ready } = usePlaidLink({
    token: token,
    onSuccess: (public_token, metadata) => {
      // send public_token to server
    },
  });
  
  return (
    <button class="plaid-button" onClick={() => open()} disabled={!ready}>
    Connect
    </button>
  );
}

export default App;
