async function main() {
    require('dotenv').config();
    const axios = require('axios');
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./1inch.json');
    const instaAccountAddress='0xd993b7Ebe3F0769c3fb7FbbDcd609323F1b33B03';
    const connector = new web3.eth.Contract(ABI, '0x34b04687269e47E50BB999231393D58F9cb9E9Ae');

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

    const sellToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" 
    const buyToken = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" 
    const sellAmount = web3.utils.toWei('0.000001', 'ether') // paste the sell amount 
    const slippage = "2" // 1% slippage
    // const sellAmount = "1000"
    
//     const allowance=await connector.methods._allowance(sellToken).call();
//     console.log("Available Allowance");
//     console.log(allowance);
//     if(allowance<sellAmount){
// //Taking approval
//     const encodeApprove = connector.methods._approve(sellToken,sellAmount).encodeABI();
//     console.log('encode',encodeApprove);

//     const encodedApproveData = web3.eth.abi.encodeFunctionCall(functionAbi, [
//     ['LayerConnectOneInchV5'],
//     [
//       encodeApprove
//       ],
//     "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB"
//     ]);

// console.log("calculating gas price")
// const approveCurrentGasPrice = await web3.eth.getGasPrice();
// console.log(approveCurrentGasPrice)
// console.log("estimating gas")
// const estimatedGas = await web3.eth.estimateGas({
//     from: "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB",
//     to: instaAccountAddress,
//     data: encodedApproveData,
//     value: 0
// });
// // const estimatedGas=3398677; 
// console.log(estimatedGas)
// const approveGasLimit = estimatedGas + 200000;

//   const transaction = {
//       from: "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB",
//       to: instaAccountAddress,
//       data: encodedApproveData,
//       value: 0, // or any ETH amount if required
//       gas: approveGasLimit,
//       gasPrice: approveCurrentGasPrice
//   };

//   const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);

//   web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
//   if (!error) {
//     console.log("🎉Approving tokens for spending: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
//   } else {
//     console.log("❗Something went wrong while submitting your transaction:", error)
//   }
//  });

// }
// else{
//   console.log("already approved");
// }


 

 //Getting swap data from API
    let response;
    const url = "https://api.1inch.dev/swap/v5.2/42161/swap";
    const config = {
        headers: {
    "Authorization": "Bearer jxC0kSICRLVAqxhLD32hTEfjcheEr6Za"
  },
        params: {
    "src": sellToken,
    "dst": buyToken,
    "amount": sellAmount,
    "from": instaAccountAddress,
    "slippage": slippage
  }
    };

    try {
        response = await axios.get(url, config);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }

  const encodedFunctionCall = connector.methods.sell(buyToken,sellToken,sellAmount,response.data.toAmount,response.data.tx.data,0).encodeABI();
      console.log('encode',encodedFunctionCall);

const encodedData = web3.eth.abi.encodeFunctionCall(functionAbi, [
    ['LayerConnectOneInchV5'],
    [
        encodedFunctionCall
        ],
    "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB"
]);

console.log("calculating gas price")
const currentGasPrice = await web3.eth.getGasPrice();
console.log(currentGasPrice)
console.log("estimating gas")
const estimatedGas2 = await web3.eth.estimateGas({
    from: "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB",
    to: instaAccountAddress,
    data: encodedData,
    value: 0
});
// const estimatedGas=3398677; 
console.log(estimatedGas2)
const gasLimit = estimatedGas2 + 200000;



    const transaction2 = {
        from: "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB",
        to: instaAccountAddress,
        data: encodedData,
        value: 0, // or any ETH amount if required
        gas: gasLimit,
        gasPrice: currentGasPrice
    };

    const signedTx2 = await web3.eth.accounts.signTransaction(transaction2, PRIVATE_KEY);

    web3.eth.sendSignedTransaction(signedTx2.rawTransaction, function(error, hash) {
    if (!error) {
      console.log("🎉 The hash of your transaction2 is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
    } else {
      console.log("❗Something went wrong while submitting your transaction:", error)
    }
   });
}

main();