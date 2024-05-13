require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NODE_URL)); // Replace with your Ethereum node URL
// ABI for AAVE connector, replace with the correct one
const connectorAbi = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];
// Address for the AAVE connector contract, replace with the correct one
const connectorAddress = '0xYourConnectorAddress';
const contract = new web3.eth.Contract(connectorAbi, connectorAddress);
contract.methods.name().call()
  .then(name => console.log(`Connector name: ${name}`))
  .catch(error => console.error(`Error fetching connector name: ${error}`));