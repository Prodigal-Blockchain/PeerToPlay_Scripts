async function main() {
  require('dotenv').config();
  const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
  const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
  const web3 = createAlchemyWeb3(ETH_NODE_URL);
  const ABI = require('./index.json');
  
  const layerIndex = new web3.eth.Contract(ABI, '0x623a6534e1b20493489382251432E30039f54C91');

  const currentGasPrice = await web3.eth.getGasPrice(); // Get current gas price

  const estimatedGas = await layerIndex.methods.build("0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB", 1, "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB").estimateGas({ from: '0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB' });
  const gasLimit = estimatedGas + 20000; // Adding a buffer

  const transaction = layerIndex.methods.build("0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB", 1, "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB");
  
  const txData = {
      to: '0x623a6534e1b20493489382251432E30039f54C91',
      gas: gasLimit,
      gasPrice: currentGasPrice, // Using current network gas price
      data: transaction.encodeABI(),
      from: '0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB'
  };

  const signedTx = await web3.eth.accounts.signTransaction(txData, PRIVATE_KEY);

  web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
      if (!error) {
          console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
      } else {
          console.log("❗Something went wrong while submitting your transaction:", error)
      }
  });
}

main();
