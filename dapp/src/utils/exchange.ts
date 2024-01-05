import axios from 'axios';

export const  getCurrentExchange = async (rate1: string, rate2: string) => {
    // GET REQUEST
    // Example URL: https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ETH,USD,EUR
    const apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${rate1},${rate2}`;

    try {
        // Make the GET request
        const response = await axios.get(apiUrl);

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
            // Return the JSON data from the response
            return response.data;
        } else {
            // Handle other status codes if needed
            console.error('Unexpected status code:', response.status);
            return null;
        }
    } catch (error) {
        // Handle errors (e.g., network error, request timeout)
        console.error('Error fetching data:', error.message);
        return null;
    }
};
