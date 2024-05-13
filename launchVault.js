async function main() {
    require('dotenv').config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./launchVault.json');
    
    
    const factory = new web3.eth.Contract(ABI, '0xfCA26911D88E6667aE92AeC3677F14e214B1E77E');

   
    const vault = factory.methods.launchVault('0xB4C5E700c8114d0C758b71865Cf9F70605cdF6d8','0x9Eec67CEDFE0F07E9782A76b9E45b46e374fab51','0x5E7f512c3b2b77d452f10100627E53902632dd7e',TRUE,FALSE,2);


}

main();