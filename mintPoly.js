async function main() {
    require('dotenv').config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./uniConnectPoly.json');
    
    const instaAccountAddress = '0x3D9ED2a3f2b9E4F20d050418cbD7472B7ECbcdFF';
    const connector = new web3.eth.Contract(ABI, '0xB5E4b2A67E0643AFa793E2Defbac7984811cD455');

    const tokenA='0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; //USDC
    const tokenB='0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'; //DAI
    const fee=3000;
    const tickLower=272220;
    const tickUpper=280380;
    const amtA=web3.utils.toWei('1', 'ether');
    const amtB=web3.utils.toWei('0.45281746663575786', 'ether');
    const encodedFunctionCall = connector.methods.mint(tokenA,tokenB,fee,tickLower,tickUpper,amtA,amtB,5,[0,1],0).encodeABI();
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

const gasLimit = 5896455;
const gasPrice = web3.utils.toWei('110', 'gwei');
const encodedData = web3.eth.abi.encodeFunctionCall(functionAbi, [
    ['UNISWAP-V3-A'],
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