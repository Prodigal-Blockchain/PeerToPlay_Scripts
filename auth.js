async function main() {
    require("dotenv").config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require("./auth.json");
    const instaAccountAddress = "0xD68a0060696b34fa5bA2e4ABB74624eBF9154895";
    // const instaAccountAddress = "0x40b7f8baa00091e12c0fc4c2d538e4de62ee0258";
    const connector = new web3.eth.Contract(
      ABI,
      "0xF90B9B9481c0431dcA6130aC550ef8c98091eA9a"
    );
    const address = "0xbFE963775C57FE0B1d0c4F80a8a2CE1e431168A0";
    const encodedFunctionCall = connector.methods.remove(address).encodeABI();
    console.log("encode", encodedFunctionCall);
    const functionAbi = {
      "constant": false,
      "inputs": [
        {
          "name": "_targetNames",
          "type": "string[]",
        },
        {
          "name": "_datas",
          "type": "bytes[]",
        },
        {
          "name": "_origin",
          "type": "address",
        },
      ],
      "name": "cast",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
    };
    const gasLimit = 3000000;
    const gasPrice = web3.utils.toWei("0.5", "gwei");
    const encodedData = web3.eth.abi.encodeFunctionCall(functionAbi, [
      ['Auth-v1.1'],
      [encodedFunctionCall],
      "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB",
    ]);
    const transaction = {
      from: "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB",
      to: instaAccountAddress,
      data: encodedData,
      value: 0, // or any ETH amount if required
      gas: gasLimit,
      gasPrice: gasPrice,
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