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

app.post("/test", async (req, res) => {
    // console.log("this is post test")
    console.log(req.body[0])
    try {
        // const { prompt } = req.body[0];
        const completion = await openai.createCompletion(
            {
              model: "text-davinci-003",
              message: "Categorise this: { \"merchant_name\": \"TestMerchant\", \"description\": \"Some Description For This Transaction\", \"amount\": 5.625, \"date\": \"2023-05-02\" }",
              temperature: 0,
            //   max_tokens: 55,
            }
          );

        return res.status(200).json({
            message: completion.data.choices[0].text,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Error")
    }
})



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

// used for plaid token generation
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

// Finding an avaiable port for server, else port 3001.
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