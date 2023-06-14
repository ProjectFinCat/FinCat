import {useEffect, useState} from 'react';
import axios from 'axios';

function Dashboard({publicToken}) {
    // const [accessToken,setAccessToken] = useState();

    useEffect( () => {
        async function fetchData() {
            // Gain access to the logged in bank account.
            let accessTokenResponse;
            try {
                accessTokenResponse  = await axios.post("/exchange_public_token",{public_token: publicToken})
            } catch (error) {
                //@kevin here < Where login failed < Display it
            }

            const accessToken = accessTokenResponse.data.public_token_exchange;

             // Delay for 1 second so that plaid may load the transactions
            await new Promise(resolve => setTimeout(resolve, 1000));

            let categorisedTransactions;
            try {
                // @Kevin use this variable which contains the categorised transactions.
                categorisedTransactions  = await axios.post("/categorise_transactions", {
                    access_token: accessToken,
                    start_date: '2023-01-01',
                    end_date: '2023-02-01'
            });
            } catch (error) {
                // @Kevin nerds, Failed to categorised transcations < Display its failure
            }
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
