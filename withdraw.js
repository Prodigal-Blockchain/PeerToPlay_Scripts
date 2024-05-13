async function main() {
    require("dotenv").config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require("./withdraw.json");
    const instaAccountAddress = "0x04ca0B06Eac6178Fe5962B928d669e4686e72463";
    
    const connector = new web3.eth.Contract(
      ABI,
      "0x585EB25327C9E86Be35997ddecB6de8995ab6227"
    );
    const tokenAddress="0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
    // const tokenAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    // const amtInt = web3.utils.toWei('0.00001', 'ether');
    const amtInt = "499999";
   


    const encodedFunctionCall = connector.methods
      .withdraw(tokenAddress, amtInt,"0x3103cac5ad1fc41af7e00e0d42665d9a690574d8",0, 0)
      .encodeABI();
    console.log("encode", encodedFunctionCall);
    const functionAbi = {
      constant: false,
      inputs: [
        {
          name: "_targetNames",
          type: "string[]",
        },
        {
          name: "_datas",
          type: "bytes[]",
        },
        {
          name: "_origin",
          type: "address",
        },
      ],
      name: "cast",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    };

    const encodedData = web3.eth.abi.encodeFunctionCall(functionAbi, [
      ["Basic-v1"],
      [encodedFunctionCall],
      "0x3103cac5ad1fc41af7e00e0d42665d9a690574d8",
    ]);

console.log("calculating gas price")
const currentGasPrice = await web3.eth.getGasPrice();
console.log(currentGasPrice)
console.log("estimating gas")
const estimatedGas = await web3.eth.estimateGas({
    from: "0x3103cac5ad1fc41af7e00e0d42665d9a690574d8",
    to: instaAccountAddress,
    data: encodedData,
    value: 0
});
console.log(estimatedGas)
const gasLimit = estimatedGas + 200000;
    const transaction = {
      from: "0x3103cac5ad1fc41af7e00e0d42665d9a690574d8",
      to: instaAccountAddress,
      data: encodedData,
      value: 0, // or any ETH amount if required
      gas: gasLimit,
      gasPrice: currentGasPrice,
    };
    
    const signedTx = await web3.eth.accounts.signTransaction(
      transaction,
      PRIVATE_KEY
    );
    web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
      function (error, hash) {
        if (!error) {
          console.log(
            ":tada: The hash of your transaction is: ",
            hash,
            "\n Check Alchemy's Mempool to view the status of your transaction!"
          );
        } else {
          console.log(
            ":exclamation:Something went wrong while submitting your transaction:",
            error
          );
        }
      }
    );
  }
  main();