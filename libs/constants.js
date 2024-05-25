const AggregatorDomain = `https://aggregator-api.kyberswap.com`;

const ChainName = {
    MAINNET: `ethereum`,
    BSC: `bsc`,
    ARBITRUM: `arbitrum`,
    MATIC: `polygon`,
    OPTIMISM: `optimism`,
    AVAX: `avalanche`,
    BASE: `base`,
    CRONOS: `cronos`,
    ZKSYNC: `zksync`,
    FANTOM: `fantom`,
    LINEA: `linea`,
    POLYGONZKEVM: `polygon-zkevm`,
    AURORA: `aurora`,
    BTTC: `bittorrent`,
    SCROLL: `scroll`,    
};

const ChainId = {
    MAINNET: 1,
    BSC: 56,
    ARBITRUM: 42161,
    MATIC: 137,
    OPTIMISM: 10,
    AVAX: 43114,
    BASE: 8453,
    CRONOS: 25,
    ZKSYNC: 324,
    FANTOM: 250,
    LINEA: 59144,
    POLYGONZKEVM: 1101,
    AURORA: 1313161554,
    BTTC: 199,
    ZKEVM: 1101,
    SCROLL: 534352,
};

const tokenIn = {
    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    chainId: ChainId.ARBITRUM.toString(),
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD'
};

const tokenOut = {
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    chainId: ChainId.ARBITRUM.toString(),
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin'
};

module.exports = { AggregatorDomain, ChainName, ChainId, tokenIn, tokenOut };
