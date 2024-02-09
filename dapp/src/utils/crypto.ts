const api_to_recive_eth_to_usd = "https://api.coinbase.com/v2/prices/ETH-USD/spot"
// Return value:
// amount: "2358.82"
// base: "ETH"
// currency: "USD"
export const getEthVal = async () => {
  const result = await fetch(api_to_recive_eth_to_usd);
  const data = await result.json();
  // data.amount will have the result
  return data; 
};


export const getPriceInFormat = (amount:number, value:number | undefined) => {
  if (amount && value) {
      const result = amount * value;
      // Convert the result to a number and format with commas
      const formattedResult = Number(result.toFixed(4)).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 4
      });

      return formattedResult;
  } else {
      return "0.0";
  }
};