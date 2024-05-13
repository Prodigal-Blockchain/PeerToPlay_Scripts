async function main() {
  require('dotenv').config();
  const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
  const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
  const web3 = createAlchemyWeb3(ETH_NODE_URL);
  const ABI = require('./aave.json');
  const qs = require('qs');
  
  const ZERO_EX_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
  const DAI_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

  // Selling 100 DAI for ETH.
const params = {
  sellToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', //DAI
  buyToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', //ETH
  // Note that the DAI token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
  sellAmount: '500000',
  takerAddress: '0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB',
}
  
// Fetch the swap quote.
const response = await fetch(
  `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`, 
  { headers: { "0x-api-key": "a34ae1c0-77df-42d8-b28e-5ea47108a8b8" } }
);

console.log(await response.json());


//   const transaction = {
//       from: "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB",
//       to: instaAccountAddress,
//       data: encodedData,
//       value: 0, // or any ETH amount if required
//       gas: gasLimit,
//       gasPrice: currentGasPrice
//   };

//   const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);

//   web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
//   if (!error) {
//     console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
//   } else {
//     console.log("❗Something went wrong while submitting your transaction:", error)
//   }
//  });
}

main();