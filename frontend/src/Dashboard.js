import {useEffect, useState} from 'react';
import axios from 'axios';

function Dashboard({publicToken}) {
    // const [accessToken,setAccessToken] = useState();

    useEffect( () => {
        async function fetchData() {
            const accessTokenResponse  = await axios.post("/exchange_public_token",{public_token: publicToken})
            const accessToken = accessTokenResponse.data.public_token_exchange;
             // Delay for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 1000));

            const transactions = await axios.post("/get_transactions", {
                access_token: accessToken,
                start_date: '2023-01-01',
                end_date: '2023-02-01'
            });

            const preparedTransactions = transactions.data.map((entry,index) => (
                            {id: index, merchant_name: entry.merchant_name, description: entry.name }));
            const categorizedTransactions  = await axios.post("/test",preparedTransactions);
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
