async function main(){
    // const axios = require('axios');
    const qs = require('qs');
    require('dotenv').config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./polySwap.json');
    const tokenABI=require('./tokenABI.json');

    const buyToken= '0x79C950C7446B234a6Ad53B908fBF342b01c4d446';
    const sellToken= '0xBa8DCeD3512925e52FE67b1b5329187589072A55';
    const sellAmount= "1000000000000000000";
    const takerAddress= '0x40B7F8Baa00091e12C0fC4c2D538e4DE62ee0258';


    const tokenContract = new web3.eth.Contract(tokenABI, '0xBa8DCeD3512925e52FE67b1b5329187589072A55');
    const tx =await tokenContract.approve()
    const params = {
        // Not all token symbols are supported. The address of the token should be used instead.
        sellToken: sellToken, //DAI
        buyToken: buyToken, //WETH
        // Note that the DAI token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
        sellAmount: sellAmount,
        takerAddress: takerAddress, //Including takerAddress is highly recommended to help with gas estimation, catch revert issues, and provide the best price
    };
    
    const headers = {'0x-api-key':'108ce82c-b1c3-45d4-8d55-061f8b768fbf'};
    const response = await fetch(
        `https://goerli.api.0x.org/swap/v1/quote?${qs.stringify(params)}`, { headers }
    ); 
    
    const quote= await response.json();
    console.log(quote);
    const instaAccountAddress = '0x40B7F8Baa00091e12C0fC4c2D538e4DE62ee0258'; 
    const connector = new web3.eth.Contract(ABI, '0x3807e5d8BaB4266B7737b327E78c79EE2414710c');

    
    const encodedFunctionCall = connector.methods.swap(buyToken,sellToken,sellAmount,quote.buyAmount,quote.data,0).encodeABI();
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
    ['0x-V4'],
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


