async function main() {
    require("dotenv").config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require("./polyAuth.json");
    const instaAccountAddress = "0x9E5B8F3e8Bda8De4C1aad1AD4710cD8147D28426";
    // const instaAccountAddress = "0x40b7f8baa00091e12c0fc4c2d538e4de62ee0258";
    const connector = new web3.eth.Contract(
      ABI,
      "0xf73c94402bc24148b744083ed02654eec2c37d5b"
    );
    const address = "0x5A2d0610027bADBd47FD199a2C0Fe742A2315FAb";
    // const encodedFunctionCall = connector.methods.add(address).encodeABI();
    const encodedFunctionCall = connector.methods.add(address).encodeABI();
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
    const gasLimit = 356456;
    const gasPrice = web3.utils.toWei("190", "gwei");
    const encodedData = web3.eth.abi.encodeFunctionCall(functionAbi, [
      ['AUTHORITY-A'],
      [encodedFunctionCall],
      "0x5dBA78D25000c19E543E7f628eB42776b1498ff7",
    ]);
    const transaction = {
      from: "0x5dBA78D25000c19E543E7f628eB42776b1498ff7",
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