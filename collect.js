async function main() {
    require('dotenv').config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./uniConnect.json');
    
    const instaAccountAddress = '0x40B7F8Baa00091e12C0fC4c2D538e4DE62ee0258';
    const connector = new web3.eth.Contract(ABI,'0x7E1AC34b21095c8FDCcC6Cf7dBe068DeDACd8b65');

    const tokenId = "77579";
    const amtAMax="18999999999999932095";
    const amtBMax="8364066808591545799";
    const encodedFunctionCall = connector.methods.collect(tokenId,amtAMax,amtBMax,[0,0],[0,0]).encodeABI();
      console.log('encode',encodedFunctionCall);

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

const gasLimit = 589645;
const gasPrice = web3.utils.toWei('200', 'gwei');
const encodedData = web3.eth.abi.encodeFunctionCall(functionAbi, [
    ['UniswapV3-v1'],
    [
        encodedFunctionCall
        ],
    "0xA3014F25945ae21119cecbea96056E826B6ae19B"
]);

    const transaction = {
        from: "0xA3014F25945ae21119cecbea96056E826B6ae19B",
        to: instaAccountAddress,
        data: encodedData,
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