import {useEffect, useState} from 'react';
import axios from 'axios';

function Dashboard({publicToken}) {
    // const [accessToken,setAccessToken] = useState();

    useEffect( () => {
        async function fetchData() {
            // Gain access to the logged in bank account.
            const accessTokenResponse  = await axios.post("/exchange_public_token",{public_token: publicToken})
            const accessToken = accessTokenResponse.data.public_token_exchange;

             // Delay for 1 second so that plaid may load the transactions
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get transactions between the set dates
            const transactions = await axios.post("/get_transactions", {
                access_token: accessToken,
                start_date: '2023-01-01',
                end_date: '2023-02-01'
            });


            // Extract data relevant for categorisation.
            // const uncategorisedTransactions = transactions.data.map((entry,index) => (
            //                 {id: index, merchant_name: entry.merchant_name, description: entry.name }));
            const categorisedTransactions  = await axios.post("/test", {
                access_token: accessToken,
                start_date: '2023-01-01',
                end_date: '2023-02-01'
            });
        }
        fetchData();
      }, [])
    return (
        <div>
            <h3>Welcome to the Dashboard</h3>
        </div>
    )
}

export default Dashboard;
