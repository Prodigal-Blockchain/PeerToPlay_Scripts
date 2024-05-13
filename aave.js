async function main() {
  require('dotenv').config();
  const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
  const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
  const web3 = createAlchemyWeb3(ETH_NODE_URL);
  const ABI = require('./aave.json');
  
  const instaAccountAddress = '0xf62BC60f4db1B2f2f4b25faA7DC235FA0ED7c47E';
  const connector = new web3.eth.Contract(ABI, '0x7BfF285c9Dc5CCD96177E481BEde4D3B9361D2f7');

  const Matictoken = "0x9aa33d827759f5e0afaaa3ace64429448dea853b";
  const daiToken = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
  const tokenB = "0xBa8DCeD3512925e52FE67b1b5329187589072A55";


  const amt="10000";
  
  const encodedFunctionCall1 = connector.methods.deposit(daiToken,amt,0,0).encodeABI();
    console.log('encode',encodedFunctionCall1);

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
  ['LayerAaveV3Arbitrum'],
  [
      encodedFunctionCall1
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