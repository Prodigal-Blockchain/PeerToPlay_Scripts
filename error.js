const { ethers } = require('ethers');

const errorData = "0x118cdaa70000000000000000000000008c19f082271f6168324d4426b11a6acff7a110ea";

const abiCoder = new ethers.utils.AbiCoder();
const decodedData = abiCoder.decode(["address"], errorData);

console.log(decodedData[0]);
