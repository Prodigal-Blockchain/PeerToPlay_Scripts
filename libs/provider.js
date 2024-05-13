const { ethers } = require('ethers');
const { ChainId } = require('./constants');

function getProvider() {    
    // Replace this with an RPC of your choice
    const providerUrl = 'https://arb-mainnet.g.alchemy.com/v2/bcfXPoTTvDcNkeLHbMQyEvxGfXHqmDt3';
    const providerOptions = {
        // Testing on Polygon POS
        chainId: ChainId.ARBITRUM,
        name: 'arbitrum'
    }
    return new ethers.JsonRpcProvider(providerUrl, providerOptions);
}

module.exports = { getProvider };
