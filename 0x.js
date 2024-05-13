async function main(){
    require("dotenv").config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const qs = require('qs');
    const fetch = require('node-fetch'); // If using node-fetch


    const ERC20_ABI = require("./erc20ABI.json");

const ZERO_EX_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
const DAI_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

// Selling 100 DAI for ETH.
const params = {
    sellToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', //DAI
    buyToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', //ETH
    // Note that the DAI token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
    sellAmount: '100',
    takerAddress: '0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB',
}

const headers = "0x-api-key:a34ae1c0-77df-42d8-b28e-5ea47108a8b8"; // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)

// Set up a DAI allowance on the 0x contract if needed.
const dai = new web3.eth.Contract(ERC20_ABI, DAI_ADDRESS);
const currentAllowance = await dai.methods.allowance(params.takerAddress, ZERO_EX_ADDRESS).call();
if (currentAllowance < (params.sellAmount)) {
    await dai
        .methods.approve(ZERO_EX_ADDRESS, params.sellAmount)
        .send({ from: params.takerAddress });
}

// Fetch the swap quote.
const response = await fetch(
    `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`, 
    { headers: { "0x-api-key": "a34ae1c0-77df-42d8-b28e-5ea47108a8b8" } }
);


const txData = await response.json();

// Create a transaction object
const tx = {
    // Transaction data
    to: txData.to,
    data: txData.data,
    gas: txData.gas,
    gasPrice: txData.gasPrice,
    nonce: await web3.eth.getTransactionCount(params.takerAddress, 'latest'), // Get the correct nonce
    chainId: 42161, // Make sure to specify the chain ID
};

// Sign the transaction with the private key
const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);

// Send the signed transaction
const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
console.log('Transaction receipt:', receipt);
}
main();