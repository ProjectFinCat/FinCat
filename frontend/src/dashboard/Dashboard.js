import {useEffect, useState, React, useRef} from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';

import '../dashboard/Dashboard.css';

function Dashboard({publicToken}) {
    const [data,setData] = useState();

    useEffect(() => {
        // const transactions = fetchTransactions({publicToken});
        const transactions = {Food: [2], Travel: [0, 1, 5], Bills: [3], Other: [4]};
        setData(transactions);
    }, []);
    
    return (
        <div className='container'>
            {console.log(data)}
            {CategoriesPieChart(data)}
        </div>
    );
}

async function fetchTransactions({publicToken}) {
            // Gain access to the logged in bank account.
            let accessTokenResponse;
            try {
                accessTokenResponse  = await axios.post("/exchange_public_token",{public_token: publicToken})
            } catch (error) {
                //@kevin here < Where login failed < Display it
                alert(error)
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
                alert(error)
            }
            return categorisedTransactions;
}

function CategoriesPieChart(transactions) {
    let categories = new Array(0);
    let totals = new Array(0);

    Object.entries(transactions).forEach(([key, value]) => {
        categories.push(key);
        totals.push(Object.keys(value).length);
    })

    console.log(categories);
    console.log(totals);

    const filteredData = {
        labels: categories,
        datasets: [{
            label: "Spending Categories",
            data: totals,
            hoverOffset: 4
        }]
    }

    return (
    <Doughnut 
        data = {filteredData}
        height = {400}
        width = {600}
        options = {{
            maintainAspectRatio: false
        }}
    />);
}

export default Dashboard;
