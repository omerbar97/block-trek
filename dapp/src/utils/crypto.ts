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

export function wetToEthBigIntFormat(wei: BigInt): string {
  const WEI_PER_ETH = BigInt(10 ** 18);
  const ethAmount = Number(wei) / Number(WEI_PER_ETH);
  // Return the ETH amount as a string with 'ETH' suffix
  return `${ethAmount.toFixed(6)}`;
}

export function weiToEthStringFormat(wei: string): string {
  const WEI_PER_ETH = BigInt(10 ** 18);
  // Convert the input string to a bigint
  const weiBigInt = BigInt(wei);
  // Perform the division to get the ETH amount
  const ethAmount = Number(weiBigInt) / Number(WEI_PER_ETH);
  // Return the ETH amount as a string with 'ETH' suffix
  return `${ethAmount.toFixed(2)}`;
}


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