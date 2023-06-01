import logo from './logo.svg';
import './App.css';
import { usePlaidLink } from 'react-plaid-link';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': '64768fb8d454430013b3997d',
      'PLAID-SECRET': 'eaac864fd7c6fac49e577ea098cc21',
    },
  },
});

const client = new PlaidApi(configuration);
function App() {
  const { open, ready } = usePlaidLink({
  token: '<GENERATED_LINK_TOKEN>',
  onSuccess: (public_token, metadata) => {
    // send public_token to server
  },
});
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
         <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
      </header>
     
    </div>
  );
}

export default App;
