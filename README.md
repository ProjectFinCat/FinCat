# FinCat: A GPT powered financial categorizer.

Fincat utilizes React to build a stylized frontend to display digestible financial data. User bank information
is accessed through Plaid integration. Transactions are then processed and fed into the OpenAI API to derive
categorization. API communication for Plaid and OpenAI is handled on the backend through ExpressJS and NodeJS.
Processed data is handed back to the frontend for display.

## Available Scripts

### `npm run update`

This command will update all of the modules necessary to run both the server and the client.

### `npm run dev`
This command will run both the server and the client on ports 3001 and 3000 respectively.

