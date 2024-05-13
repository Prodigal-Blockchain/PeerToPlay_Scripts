async function getSwapRouteEncodedV0(tokenIn,tokenOut,buyAmount) {
  require('dotenv').config();
  const axios = require('axios');
  const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
  const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
  const web3 = createAlchemyWeb3(ETH_NODE_URL);
  const ABI = require('./swapAggregator.json');
  
  

  const { AggregatorDomain, ChainName} = require("./libs/constants");
  const { getSigner } = require("./libs/signer");

  const USDT = {
    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    chainId: '42161',
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD'
};

const DAI = {
    address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    chainId: '42161',
    decimals: 18,
    symbol: 'DAI',
    name: 'Dai Stablecoin'
};

const LINK = {
    address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
    chainId: '42161',
    decimals: 18,
    symbol: 'LINK',
    name: 'ChainLink Token'
};


const USDC = {
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    chainId: '42161',
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin'
};

 // Create a mapping of token addresses to their respective objects
 const tokens = {
    [USDT.address]: USDT,
    [DAI.address]: DAI,
    [LINK.address]: LINK,
    [USDC.address]: USDC
  };

  // Find the token object based on tokenIn address
  const tokenObject = tokens[tokenIn];

//   if (!tokenObject) {
//     throw new Error("Token address does not match any predefined token objects.");
//   }

let decimals=6;
  if (tokenOut=="0xf97f4df75117a78c1A5a0DBb814Af92458539FB4"){
    decimals=18;
  }
  else{
    decimals  = 6;
  }
  

    // Get the path to be called
    const targetChain = ChainName.ARBITRUM;
    const targetPath = `/${targetChain}/route/encode`;

    // Get the signer's address
    const signer = getSigner();
    const signerAddress = await signer.getAddress();

    // Specify the call parameters (only the required params are specified here, see Docs for full list)
    const targetPathConfig = {
        params: {
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: Number(buyAmount*10**decimals).toString(),
            to: signerAddress,
            slippageTolerance: 10 //0.1%
        }
    };

    // Call the API with axios to handle async calls
    try {
        console.log(`\nCalling [V0] Get Swap Info with Encoded Data...`);
        const { data } = await axios.get(
            AggregatorDomain+targetPath,
            targetPathConfig
        );

        console.log(`[V0] GET Response:`);
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }

}

// At the end of the file where getSwapRouteEncodedV0 is defined
module.exports = { getSwapRouteEncodedV0 };

