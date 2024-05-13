async function main() {
    require('dotenv').config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./uniConnect.json');
    
    //The LSA address which you are using
    const instaAccountAddress = '0x6bc7D3A39826635E12Ff60C074590FCc206443BD';
    //The uniswap connector address & ABI
    const connector = new web3.eth.Contract(ABI, '0x3e81a909D59D46777CC372730a801e3eEf4Db820');

    //Input Parameters
    // const tokenA='0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
    // const tokenA='0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    
    // const tokenB='0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8';
    // const fee=500;
    // const tickLower=-200310;
    // const tickUpper=-196260;
    const amtA="23229179120369";
    const amtB="51029";
    const liquidity="11436735143";
    // const slippage="10000000000000000";
    const tokenId=1010303;
    // const encodedFunctionCall = connector.methods.mint(tokenA,tokenB,fee,tickLower,tickUpper,amtA,amtB,slippage,[0,0],0).encodeABI();
    //   console.log('encode',encodedFunctionCall);

    const encodedFunctionCall = connector.methods.withdraw(tokenId,liquidity,amtA,amtB,0,[0,0]).encodeABI();
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

const encodedData = web3.eth.abi.encodeFunctionCall(functionAbi, [
    ['UniswapV3-v1'],
    [
        encodedFunctionCall
        ],
    "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB"
]);

console.log("calculating gas price")
const currentGasPrice = await web3.eth.getGasPrice();
console.log(currentGasPrice)
console.log("estimating gas")
const estimatedGas = await web3.eth.estimateGas({
    from: "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB",
    to: instaAccountAddress,
    data: encodedData,
    value: 0
});
// const estimatedGas=3398677; 
console.log(estimatedGas)
const gasLimit = estimatedGas + 200000;

    const transaction = {
        from: "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB",
        to: instaAccountAddress,
        data: encodedData,
        value: 0, // or any ETH amount if required
        gas: gasLimit, 
        gasPrice: currentGasPrice
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