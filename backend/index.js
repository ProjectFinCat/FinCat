const express = require("express")
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();

app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/test", async (req, res) => {
    try {
        // const response = await openai.createCompletion({
            // model: "gpt-3.5",
            // prompt: ``,
        // });

        return res.status(200).json({
            message: "Working, Server is up",
        });
    } catch (error) {}
})

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server is listening on Port ${port}`));

// import { usePlaidLink } from 'react-plaid-link';
// import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

// const configuration = new Configuration({
//   basePath: PlaidEnvironments.sandbox,
//   baseOptions: {
//     headers: {
//       'PLAID-CLIENT-ID': '64768fb8d454430013b3997d',
//       'PLAID-SECRET': 'eaac864fd7c6fac49e577ea098cc21',
//     },
//   },
// });

// const client = new PlaidApi(configuration);
// function App() {
//   const { open, ready } = usePlaidLink({
//   token: '<GENERATED_LINK_TOKEN>',
//   onSuccess: (public_token, metadata) => {
//     // send public_token to server
//   },
// });