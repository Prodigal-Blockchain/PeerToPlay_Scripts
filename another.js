require("dotenv").config();
const Web3 = require('web3');
const web3 = new Web3(process.env.ETH_NODE_URL);

const instaAccountAddress = '0x3D9ED2a3f2b9E4F20d050418cbD7472B7ECbcdFF';

const functionAbi = {
    "constant": false,
    "inputs": [
        {
            "name": "targets",
            "type": "string[]"
        },
        {
            "name": "spells",
            "type": "bytes[]"
        }
    ],
    "name": "cast",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
};

const gasLimit = 330000;
const encodedData = web3.eth.abi.encodeFunctionCall(functionAbi, [
    ['AAVE-V3-A'],
    ['0xce88b4390000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000']
]);

async function main() {
    const tx = {
        from: '0xA3014F25945ae21119cecbea96056E826B6ae19B',
        to: instaAccountAddress,
        data: encodedData,
        value: 0, // or any ETH amount if required
        gas: gasLimit,
    };

    try {
        const transactionHash = await web3.eth.sendTransaction(tx);
        console.log('Transaction hash:', transactionHash);
    } catch (error) {
        console.error('Transaction error:', error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
