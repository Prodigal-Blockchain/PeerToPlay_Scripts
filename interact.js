require("dotenv").config();
const ethers = require("ethers");

// Contract ABI JSON data
const contractAbi = require("./abi.json");

// Ethereum provider
const provider = new ethers.JsonRpcProvider(process.env.ETH_NODE_URL);


async function interactWithContract() {
    // Contract address
    const contractAddress = "0x3D9ED2a3f2b9E4F20d050418cbD7472B7ECbcdFF";
  
    // Connect to the contract using the ABI and address
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  
    // Call a contract function
    const result = await contract.implementations();
  
    console.log("Contract function result:", result);


// Define the ABI for the argument
const argumentAbi = [
  { "name": "targets", "type": "bytes[]" },
  { "name": "spells", "type": "bytes[]" }
];

// Create the argument object
const argumentObject = {
  targets: ['AAVE-V3-A'],
  spells: [
    '0xce88b4390000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000000000000000000000000000004563918244f4000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
  ]
};

// Encode the argument
const encodedArgument = ethers.utils.defaultAbiCoder.encode(argumentAbi, [
  argumentObject.targets,
  argumentObject.spells
]);

// Call the 'cast' function with the encoded argument
const tx = await contract.cast(encodedArgument);
await tx.wait();
}
  
  interactWithContract().catch((error) => {
    console.error("Error:", error);
  });
  