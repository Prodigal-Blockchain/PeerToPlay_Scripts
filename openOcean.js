async function main() {
    require('dotenv').config();
    const axios = require('axios');
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./1inch.json');
    const instaAccountAddress='0x7734a07287591e2723fe2efb0f3fd8c7587f6635';
    const connector = new web3.eth.Contract(ABI, '0x63995c71e2f57d0aF786485E255A805603e54e76');


    const sellToken = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" // USDC
    const buyToken = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063" // DAI
    const sellAmount = web3.utils.toWei('1', 'ether') // paste the sell amount 
    const slippage = "1" // 1% slippage

    const { data: swapData } = await axios.get(`https://api.instadapp.io/defi/polygon/1inch/v4/swap`, {
    params: {
    sellToken,
    buyToken,
    sellAmount,
    dsaAddress:instaAccountAddress,
    slippage,
    }
  })

  console.log(swapData);

  const encodedFunctionCall = connector.methods.sell(buyToken,sellToken,sellAmount,swapData.unitAmt,swapData.calldata,0).encodeABI();
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
const gasPrice = web3.utils.toWei('150', 'gwei');
const encodedData = web3.eth.abi.encodeFunctionCall(functionAbi, [
    ['1INCH-V4-A'],
    [
        encodedFunctionCall
        ],
    "0x5dba78d25000c19e543e7f628eb42776b1498ff7"
]);

    const transaction = {
        from: "0x5dba78d25000c19e543e7f628eb42776b1498ff7",
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