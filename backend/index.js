const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const { PlaidApi, PlaidEnvironments } = require('plaid');
const app = express();
app.use(cors());
app.use(express.json());

//OpenAI API =====================
const openai_configuration = new Configuration({
    organization: "org-Fof5q6clGNwq4sfOJsCf2tln",
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(openai_configuration);

app.post("/categorise_transactions", async (req, res) => {
    var uncategorisedTransactions = req.body; // Only need array part in req.body
    // Extra properties such as {}, are present and doesn't allow gpt to categorise
    let uncategorisedString = "";
    let toString = ({id, merchant_name, description}) => `${id}, ${merchant_name}: ${description}`; // convert
    for (let i = 0; i < uncategorisedTransactions.length; i++) {
        uncategorisedString += toString(uncategorisedTransactions[i]) + " ";
    }
    console.log(uncategorisedString); // Just validating that arr is just req.body array taken from plaid
    try {
        const completion = await openai.createCompletion(
            {
              model: "text-davinci-003",
              prompt: `Look at this array and categorise each transaction: 
              ${uncategorisedString},
              return an output in this format: id, Category.
              You MUST ONLY use these categories: Food, Travel, Bills & Other.
              Don't waste space with whitespace
              ###`, // uncategorisedString is being inputed into the prompt. Adjust prompt instructions to get close to target
            max_tokens:600, // I think up to 600 max tokens is a reasonable amount if needed 1000
            temperature: 0,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        }
          );
        console.log(completion.data.choices[0].text);
        return res.status(200).json({
            data: completion.data.choices[0].text,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error.completion
              ? error.rcompletion.data
              : "There was an issue on the server",
        });
    }
});



//Plaid API =====================
const plaid_configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET_KEY,
    },
  },
});

const plaidClient = new PlaidApi(plaid_configuration);

// used for link with plaid servers and receiving a token
app.post('/create_link_token', async function (request, response) {
  const plaidRequest = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: 'tempUser',
    },
    client_name: 'Plaid Test App',
    products: ['transactions'],
    language: 'en',
    redirect_uri: 'http://localhost:3000/',
    country_codes: ['GB'],
  };
  try {
    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    response.json(createTokenResponse.data);
  } catch (error) {
    response.status(500).send("Failed to create link token");
    // handle error
  }
});

// used to get an access token from plaid
app.post('/exchange_public_token', async function (
  request,
  response,
  next,
) {
  const publicToken = request.body.public_token;
  try {
    const plaidResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = plaidResponse.data.access_token;
    response.json({ public_token_exchange: accessToken });
  } catch (error) {
    response.status(500).send("Internal Error");
  }
});

// used to get transactions

app.post('/get_transactions', async function (request, response) {
  const plaidRequest = {
    access_token: request.body.access_token,
    start_date: request.body.start_date,
    end_date: request.body.end_date
  };
  try {
    const transactionsResponse = await plaidClient.transactionsGet(plaidRequest);
    const total_transactions = transactionsResponse.data.total_transactions;
    let transactions = transactionsResponse.data.transactions;
    while (transactions.length < total_transactions) {
      const paginatedRequest = {
        access_token: request.body.access_token,
        start_date: request.body.start_date,
        end_date: request.body.end_date,
        options: {
          offset: transactions.length,
        },
      };
      const paginatedResponse = await client.transactionsGet(paginatedRequest);
      transactions = transactions.concat(
        paginatedResponse.data.transactions,
      );
    }
    response.json(transactions);
  } catch (error) {
    response.status(500).send("Failed to create link token");
    // handle error
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server is listening on Port ${port}`));


// import { usePlaidLink } from 'react-plaid-link';
//



// const client = new PlaidApi(configuration);
// function App() {
//   const { open, ready } = usePlaidLink({
//   token: '<GENERATED_LINK_TOKEN>',
//   onSuccess: (public_token, metadata) => {
//     // send public_token to server
//   },
// });