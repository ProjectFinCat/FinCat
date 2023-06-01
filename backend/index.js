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

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is listening on Port ${port}`));