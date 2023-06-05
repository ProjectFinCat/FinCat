import logo from './HomepageCard.gif';
import './App.css';
import './Buttons.css'
import {useEffect, useState} from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import Dashboard from './Dashboard';
axios.defaults.baseURL = "http://localhost:3001"

function App() {
  const [publicToken,setPublicToken] = useState();
  return (
    <div className="container">
      {publicToken ? <Dashboard publicToken={publicToken}/> :
      <div className="App">
        <header className="App-header">
          <h1>
            FinCat
          </h1>
          <img src={logo} className="App-logo" alt="logo" />
              <h3>Connect your bank account via Plaid</h3>
              <PlaidButton setPublicToken={setPublicToken} />
        </header>
      </div>
      }
    </div>
  );
}

function PlaidButton({setPublicToken}) {
  const [token,setToken] = useState();
  useEffect( () => {
    async function fetch() {
      try {
        const response  = await axios.post("/create_link_token")
      setToken(response.data.link_token);
      } catch (error) {
        //@Kevin < Can't connect to plaid at all < Display it pls
      }
      
    }
    fetch();
  }, [])

  const { open, ready } = usePlaidLink({
    token: token,
    onSuccess: (public_token, metadata) => {
      setPublicToken(public_token);
    },
  });
  
  return (
    <button className="plaid-button" onClick={() => open()} disabled={!ready}>
    Connect
    </button>
  );
}

export default App;
