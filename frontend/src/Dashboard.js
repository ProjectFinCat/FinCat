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

            const categorisedTransactions  = await axios.post("/categorise_transactions", {
                access_token: accessToken,
                start_date: '2023-01-01',
                end_date: '2023-02-01'
            });
            console.log(categorisedTransactions);
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
