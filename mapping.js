async function main() {
    require('dotenv').config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./mapping.json');
    
    const implementationsMapping = new web3.eth.Contract(ABI, '0xac485461C02D869D1b5FFF1352cd01aD9c086523');
    console.log("\n########### Add DSA Implementations ########");

    // Assuming web3 and implementationsMapping are already initialized
    
    // Set Default Implementation
    implementationsMapping.methods.setDefaultImplementation("0xaF49dDA64308957360f16525E81A41CE6f3F3Be7")
    .send("0x5A2d0610027bADBd47FD199a2C0Fe742A2315FAb") // deployerAddress needs to be defined
    .on('transactionHash', function(hash){
        console.log(`Transaction hash: ${hash}`);
    })
    .on('receipt', function(receipt){
        console.log(`Transaction receipt: `, receipt);
    })
    .on('error', console.error);
    
    // Prepare Arguments for Adding Implementation
    const implementationV1Args = [
      "0x25604B42e559FaC688C98E8557Aaf7e7bb783f77",
      ["cast(string[],bytes[],address)"].map(a => web3.utils.keccak256(a).slice(0, 10)),
    ];
    
    // Add Implementation
    implementationsMapping.methods.addImplementation(...implementationV1Args)
    .send("0x5A2d0610027bADBd47FD199a2C0Fe742A2315FAb") // deployerAddress needs to be defined
    .on('transactionHash', function(hash){
        console.log(`Transaction hash: ${hash}`);
    })
    .on('receipt', function(receipt){
        console.log(`Transaction receipt: `, receipt);
    })
    .on('error', console.error);
    
    console.log("###########\n");
    


// const gasLimit = 28964576 ;
// const gasPrice = web3.utils.toWei('110', 'gwei');


//     const transaction = {
//         from: "0x5A2d0610027bADBd47FD199a2C0Fe742A2315FAb",
//         to: ossifiable,
//         data: encodedFunctionCall,
//         value: 0, // or any ETH amount if required
//         gas: gasLimit,
//         gasPrice: gasPrice
//     };

//     const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);

//     web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
//     if (!error) {
//       console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
//     } else {
//       console.log("❗Something went wrong while submitting your transaction:", error)
//     }
//    });
}

main();