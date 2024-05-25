async function main() {
  require("dotenv").config();
  const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
  const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
  const web3 = createAlchemyWeb3(ETH_NODE_URL);
  const ABI = require("./index.json");

  const layerIndex = new web3.eth.Contract(
    ABI,
    "0x3E69c4A48dF9fef22c20fA4ec5032243dd257b85"
  );

  const currentGasPrice = await web3.eth.getGasPrice(); // Get current gas price

  const estimatedGas = await layerIndex.methods
    .build(
      "0x3103Cac5ad1fC41aF7e00E0d42665d9a690574d8",
      1,
      "0x3103Cac5ad1fC41aF7e00E0d42665d9a690574d8"
    )
    .estimateGas({ from: "0x3103Cac5ad1fC41aF7e00E0d42665d9a690574d8" });
  const gasLimit = estimatedGas + 20000; // Adding a buffer

  const transaction = layerIndex.methods.build(
    "0x3103Cac5ad1fC41aF7e00E0d42665d9a690574d8",
    1,
    "0x3103Cac5ad1fC41aF7e00E0d42665d9a690574d8"
  );

  const txData = {
    to: "0x3E69c4A48dF9fef22c20fA4ec5032243dd257b85",
    gas: gasLimit,
    gasPrice: currentGasPrice, // Using current network gas price
    data: transaction.encodeABI(),
    from: "0x3103Cac5ad1fC41aF7e00E0d42665d9a690574d8",
  };

  const signedTx = await web3.eth.accounts.signTransaction(txData, PRIVATE_KEY);

  web3.eth.sendSignedTransaction(
    signedTx.rawTransaction,
    function (error, hash) {
      if (!error) {
        console.log(
          "🎉 The hash of your transaction is: ",
          hash,
          "\n Check Alchemy's Mempool to view the status of your transaction!"
        );
      } else {
        console.log(
          "❗Something went wrong while submitting your transaction:",
          error
        );
      }
    }
  );
}

main();
