async function main() {
    require('dotenv').config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./withdrawQueue.json');
    
    const ossifiable = '0xCF117961421cA9e546cD7f50bC73abCdB3039533';
    const ownerAddress = '0xA3014F25945ae21119cecbea96056E826B6ae19B';
    const withdrawQueue = new web3.eth.Contract(ABI, '0x077B60752864B3e5291863cf8890603f9ab335d3');
    const amounts="10000000000000000";

    const encodedFunctionCall = withdrawQueue.methods.requestWithdrawals([amounts],ownerAddress).encodeABI();
      console.log('encode',encodedFunctionCall);


const gasLimit = 28964576 ;
const gasPrice = web3.utils.toWei('110', 'gwei');


    const transaction = {
        from: "0xA3014F25945ae21119cecbea96056E826B6ae19B",
        to: ossifiable,
        data: encodedFunctionCall,
        value: 0, // or any ETH amount if required
        gas: gasLimit,
        gasPrice: gasPrice
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