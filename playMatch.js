async function main() {
  require("dotenv").config();
  const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
  const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
  const web3 = createAlchemyWeb3(ETH_NODE_URL);
  const ABI = require("./peerToPlayConnector.json");
  // const instaAccountAddress = "0x02543665c689E2aA45c82A7F93d123572cb2C1B7";
  const instaAccountAddress = "0x6837300f8956d2DfF2a4A9D650A85Ef38f9371f1";

  // const EOAAddress = "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB";
  const EOAAddress = "0x3103Cac5ad1fC41aF7e00E0d42665d9a690574d8";

  const connector = new web3.eth.Contract(
    ABI,
    "0x7d5A95d10c7d332Ce1C2818D9dCc8db211dddD0f"
  );
  const matchId = 1;

  const encodedFunctionCall = connector.methods.playMatch(1).encodeABI();
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
    ["CricketConnector-v1"],
    [encodedFunctionCall],
    EOAAddress,
  ]);

  console.log("Encoded data");
  console.log(encodedData);

  console.log("calculating gas price");
  const currentGasPrice = await web3.eth.getGasPrice();
  console.log(currentGasPrice);
  console.log("estimating gas");
  const estimatedGas = await web3.eth.estimateGas({
    from: EOAAddress,
    to: instaAccountAddress,
    data: encodedData,
    value: 0,
  });
  console.log(estimatedGas);
  const gasLimit = estimatedGas + 200000;
  // const gasLimit = 2000000;
  const transaction = {
    from: EOAAddress,
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
