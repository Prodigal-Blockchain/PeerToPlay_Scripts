async function main() {
    require('dotenv').config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./uniConnect.json');
    
    const contractAddress = '0xBF359bBDe75E8e68f2AD2B62e71C8603A11Cf0C6';

    // Initialize contract with Web3
    const contract = new web3.eth.Contract(ABI, contractAddress);
    
    // Function to call the 'getSlotFromTokenId' read functio
        const slot = await contract.methods.getAllSlots.call();
        console.log(`Slot: ${slot}`);
}

main();