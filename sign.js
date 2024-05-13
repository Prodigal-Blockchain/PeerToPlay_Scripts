//permit starts from here
const Web3 = require('web3');
const web3 = new Web3(process.env.ETH_NODE_URL);
require('dotenv').config();

async function main(){

const deadline = +new Date() + 60*60;
const privateKey = "0x16832dee3c008ad52d04fee5b1e242df8a4ffeaeac9a992a0f56a68e8f6472a6";

const typedData = {
    types: {
        EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
        ],
        Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "deadline", type: "uint256" },
        ],
    },
    primaryType: "Permit",
    domain: {
        name: "Liquid staked Ether 2.0",
        version: "2",
        chainId: 5,  // Mainnet. For Ropsten use 3, etc.
        verifyingContract: "0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F",
    },
    message: {
        owner: "0xA3014F25945ae21119cecbea96056E826B6ae19B",
        spender: "0x077B60752864B3e5291863cf8890603f9ab335d3",
        value: "100000000000000000",
        deadline: deadline,
    }
};

let signature = await web3.eth.accounts.sign("eth_signTypedData_v4",[JSON.stringify(typedData),privateKey]);

// Extract v, r, s
const { v, r, s } = signature;
console.log("v:", v);
console.log("r:", r);
console.log("s:", s);
}

main();