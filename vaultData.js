async function main() {
    require('dotenv').config();
    const { ETH_NODE_URL} = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./factoryABI.json');
    const vaultABI = require('./vaultABI.json');
    const poolABI=require('./poolABI.json');
    const tokenABI= require('./erc20ABI.json');

    const contractAddress = '0xfCA26911D88E6667aE92AeC3677F14e214B1E77E'; 
    const algoFactory = new web3.eth.Contract(ABI, contractAddress);
    let vaultAddresses = [];
    try {
        const events = await algoFactory.getPastEvents('VaultLaunched', {
            fromBlock: '9892403',
            toBlock: 'latest'
        });
         events.forEach(event => {
            vaultAddresses.push(event.returnValues.vaultAddress);
        });
    } catch (error) {
        console.error('Error fetching past events:', error);
    }
    const VAULT_STATS = {
        numberOfVaults: vaultAddresses.length,
        vaultAddresses: vaultAddresses
    };

    for (const vaultAddress of vaultAddresses) {
        try {
            const vaultContract = new web3.eth.Contract(vaultABI, vaultAddress);
            
            let poolAddress;
            try {
                poolAddress = await vaultContract.methods.poolAddress().call();
            } catch (err) {
                console.warn(`Failed to get poolAddress for vault ${vaultAddress}: ${err.message}`);
                continue; // Skip to the next vault address if this call fails
            }

            // Other potentially failing calls
            let totalAssetsToken0Raw, totalAssetsToken1Raw, algoShares, token0, token1;
            try {
                [totalAssetsToken0Raw, totalAssetsToken1Raw, algoShares] = await Promise.all([
                    vaultContract.methods.totalAssetsToken0().call(),
                    vaultContract.methods.totalAssetsToken1().call(),
                    vaultContract.methods.algoShares().call()
                ]);

                const totalAssetsToken0 = totalAssetsToken0Raw / Math.pow(10, 18);
                const totalAssetsToken1 = totalAssetsToken1Raw / Math.pow(10, 18);

                const poolContract = new web3.eth.Contract(poolABI, poolAddress);
                [token0, token1,fee] = await Promise.all([
                    poolContract.methods.token0().call(),
                    poolContract.methods.token1().call(),
                    poolContract.methods.fee().call()
                ]);

                const token0Contract = new web3.eth.Contract(tokenABI, token0);
                const [token0Name, token0Symbol, token0Decimal] = await Promise.all([
                    token0Contract.methods.name().call(),
                    token0Contract.methods.symbol().call(),
                    token0Contract.methods.decimals().call()
                ]);

                const token1Contract = new web3.eth.Contract(tokenABI, token1);
                const [token1Name, token1Symbol, token1Decimal] = await Promise.all([
                    token1Contract.methods.name().call(),
                    token1Contract.methods.symbol().call(),
                    token1Contract.methods.decimals().call()
                ]);

                const vaultData = {
                    vaultAddress: vaultAddress,
                    poolAddress,
                    feeTier: fee,
                    totalAssets: {
                        token0: totalAssetsToken0,
                        token1: totalAssetsToken1
                    },
                    algoShares,
                    token0Details: {
                        address: token0,
                        name: token0Name,
                        symbol: token0Symbol,
                        decimal: token0Decimal
                    },
                    token1Details: {
                        address: token1,
                        name: token1Name,
                        symbol: token1Symbol,
                        decimal: token1Decimal
                    }
                };
        
                console.log(vaultData);
            } catch (err) {
                console.warn(`Failed to retrieve data for vault ${vaultAddress} with pool address ${poolAddress}: ${err.message}`);
                continue; // Skip to the next vault address if any of these calls fail
            }
        } catch (error) {
            console.error('Error fetching vault details:', error);
        } 
        // Structure the output
       
    }
}



main();

