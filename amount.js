const { Alchemy, Network } = require("alchemy-sdk");

const settings = {
  apiKey: "bcfXPoTTvDcNkeLHbMQyEvxGfXHqmDt3", // Replace with your Alchemy API Key.
  network: Network.ARB_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

// The wallet address / token we want to query for:
const ownerAddr = "0xd993b7Ebe3F0769c3fb7FbbDcd609323F1b33B03";

// Since top-level await is not allowed in CommonJS, wrap in an async function
async function main() {
  const balances = await alchemy.core.getTokenBalances(ownerAddr, [
    "0xaf88d065e77c8cC2239327C5EDb3A432268e5831","0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9","0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1","0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
  ]);

  console.log("Token Balances:");
  for (let balance of balances.tokenBalances) {
    const tokenDecimal = await getMetadata(balance.contractAddress); // Correctly await the promise
    console.log(`tokenDecimal: ${tokenDecimal}`);
    const decimalBalance = BigInt(balance.tokenBalance);
    console.log(`decimalBalance: ${decimalBalance}`);
    console.log(`Contract: ${balance.contractAddress}`);
    console.log(`Hex: ${balance.tokenBalance}`);
    console.log("---");
  }
}

main();

async function getMetadata(address) {
  // Ensure address is passed correctly to fetch metadata
  const metadata = await alchemy.core.getTokenMetadata(address);
  return metadata.decimals; // This will return the number of decimals
}
