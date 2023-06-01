import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:3001"

function App() {
  // ConnectViaPlaid();
  return (
    <div className="App">
      
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {/* <button onClick={() => open()} disabled={!ready}>
        Connect a bank account
        </button> */}
      </header>
     
    </div>
  );
}

function ConnectViaPlaid() {
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
}

export default App;
