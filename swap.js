async function main(){
    const axios = require('axios');
    require('dotenv').config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./polySwap.json');
    const quoterABI=require('./quoterPoly.json');


    const sellToken = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619" // paste the sell token address 
    const buyToken = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063" // paste the buy token address 
    const sellAmount = web3.utils.toWei('0.002', 'ether') // paste the sell amount 
    const dsaAddress="0x3D9ED2a3f2b9E4F20d050418cbD7472B7ECbcdFF"
    const fee=3000;
    
    const quoterContract = new web3.eth.Contract(quoterABI, "0x61fFE014bA17989E743c5F6cB21bF9697530B21e");
    const params = {
        tokenIn: sellToken,
        tokenOut: buyToken,
        amountIn: sellAmount,
        fee: fee,
        sqrtPriceLimitX96: 0
    };
    
    console.log("calling")
    const data = await quoterContract.methods.quoteExactInputSingle(params).call(); 
    

    const quotedAmountOut=data.amountOut;
    console.log(quotedAmountOut);
    console.log("Called")

    const instaAccountAddress = '0x3D9ED2a3f2b9E4F20d050418cbD7472B7ECbcdFF'; 
    const connector = new web3.eth.Contract(ABI, '0x7D9eaeD9Bb41dC82b9A2Bcd4ed097F0e576C4CBc');

    
    const encodedFunctionCall = connector.methods.buy(buyToken,sellToken,fee,sellAmount,quotedAmountOut,0,0).encodeABI();
      console.log('encode',encodedFunctionCall);

const functionAbi = {
    "constant": false,
    "inputs": [
        {
            "name": "_targetNames",
            "type": "string[]"
        },
        {
            "name": "_datas",
            "type": "bytes[]"
        },
        {
            "name": "_origin",
            "type": "address"
        }
    ],
    "name": "cast",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
};

const gasLimit = 589645;
const gasPrice = web3.utils.toWei('200', 'gwei');
const encodedData = web3.eth.abi.encodeFunctionCall(functionAbi, [
    ['UniswapV3-Swap-v1'],
    [
        encodedFunctionCall
        ],
    "0xA3014F25945ae21119cecbea96056E826B6ae19B"
]);

    const transaction = {
        from: "0xA3014F25945ae21119cecbea96056E826B6ae19B",
        to: instaAccountAddress,
        data: encodedData,
        value: 0, // or any ETH amount if required
        gas: gasLimit,
        gasPrice: gasPrice
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
    if (!error) {
      console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
    } else {
      console.log("❗Something went wrong while submitting your transaction:", error)
    }
   });
}

main();


