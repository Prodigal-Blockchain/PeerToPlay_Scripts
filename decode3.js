const ethers = require("ethers");

const abiCoder = new ethers.utils.AbiCoder();

// Hex string representing an Ethereum address followed by three uint256 integers
const hexData = "0x000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000003103cac5ad1fc41af7e00e0d42665d9a690574d800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

// Types array indicating the data types to decode from the hex string
const types = ["address","uint256","address","uint256","uint256"];

// Decode the hex string
const decodedValue = abiCoder.decode(types, hexData);

// Print the decoded values to the console
console.log(`${decodedValue[0]}`);
console.log(`${decodedValue[1].toString()}`);
console.log(`${decodedValue[2].toString()}`);
console.log(`${decodedValue[3].toString()}`);
console.log(`${decodedValue[4].toString()}`);
