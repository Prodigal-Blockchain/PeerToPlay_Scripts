const { getSwapRouteEncodedV0 } = require("./swapAggregator");
// const { getTokenApproval } = require("../libs/approval");
const { tokenIn } = require("./libs/constants");
const { getSigner } = require("./libs/signer");
const { getProvider } = require('./libs/provider');
require("dotenv").config();
const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ETH_NODE_URL);

async function V0Swap(tokenIn,tokenOut,buyAmount) {
    // Get the swap data required to execute the transaction on-chain
    const swapData = await getSwapRouteEncodedV0(tokenIn,tokenOut,buyAmount);
    const encodedSwapData = swapData.encodedSwapData;
    const routerContract = swapData.routerAddress;

    // Use the configured signer to submit the on-chain transactions
    const signer = getSigner();
    const signerAddress = await signer.getAddress();
    console.log("signer :",signerAddress);
    const provider = getProvider(); // Get the provider from the signer

    console.log("calculating gas price")
    
    
    console.log("calculating gas price")
    const currentGasPrice = await web3.eth.getGasPrice();
    console.log(currentGasPrice)
    // // Ensure that the router contract has sufficient allowance
    // await getTokenApproval(
    //     tokenIn.address,
    //     routerContract,
    //     swapData.inputAmount
    // );

    
console.log("estimating gas")
const estimatedGas = await signer.estimateGas({
    data: encodedSwapData,
    from: signerAddress,
    to: routerContract,
    value: 0
});
console.log(estimatedGas)
const gasLimit = estimatedGas;


   // Execute the swap transaction
   console.log(`\nExecuting the swap tx on-chain...`);
   console.log(`Encoded data: ${encodedSwapData}`);
   console.log(`Router contract address: ${routerContract}`);
   const executeSwapTx = await signer.sendTransaction({
       data: encodedSwapData,
       from: signerAddress,
       to: routerContract,
       value: 0,
       gasPrice: currentGasPrice,
       gasLimit:gasLimit,
   });
    

    const executeSwapTxReceipt = await executeSwapTx.wait();
    console.log(`Swap tx executed with hash: ${executeSwapTxReceipt?.hash}`);
}

// V0Swap();

module.exports = { V0Swap };
