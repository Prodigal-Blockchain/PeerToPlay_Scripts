const { ethers } = require("ethers");
require('dotenv').config();
  const { ETH_NODE_URL, PRIVATE_KEY } = process.env;

// Or, using a specific JSON RPC provider (e.g., Infura, Alchemy)
const provider = new ethers.providers.JsonRpcProvider(ETH_NODE_URL);
const contractABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_implementations",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [],
      "name": "implementations",
      "outputs": [
        {
          "internalType": "contract AccountImplementations",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];
const contractAddress = "0x04ca0B06Eac6178Fe5962B928d669e4686e72463";

const contract = new ethers.Contract(contractAddress, contractABI, provider);

async function fetchEvents() {
    // Example event filter: Fetch all Transfer events
    const eventName = "cast"; // Use your actual event name
    const fromBlock = 0; // Starting block (set accordingly)
    const toBlock = "latest"; // Fetch up to the latest block

    // Creating a filter (optional, you can also pass null to fetch all events of the specified type)
    const filter = contract.filters[eventName](); // Adjust parameters as needed for your event

    // Querying the events
    const events = await contract.queryFilter(filter, fromBlock, toBlock);

    // Processing the events
    events.forEach(event => {
        console.log(event);
        // Access event details using event.args for the parameters, event.blockNumber, etc.
    });
}

fetchEvents().catch(console.error);
