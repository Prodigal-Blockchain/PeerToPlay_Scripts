const Web3 = require('web3');
const web3 = new Web3();

const valuesToEncode = ["0x2899a03ffDab5C90BADc5920b4f53B0884EB13cC","0x8153A21dFeB1F67024aA6C6e611432900FF3dcb9",3000,-6960,23040,"10000000000000000000","4402140425574513521","9999999999999999980","4402140425574513512","0xA3014F25945ae21119cecbea96056E826B6ae19B",153622];
const encodedValues = valuesToEncode.map(value => web3.utils.asciiToHex(value));

console.log(encodedValues); // This will display the encoded byte strings for "Hello" and "World"

