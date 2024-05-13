async function main() {
    require('dotenv').config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./nftManager.json');
    
    const nftManager = new web3.eth.Contract(ABI, '0xC36442b4a4522E871399CD717aBDD847Ab11FE88');

    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    const gasEstimate = await nftManager.methods.mint(["0x2899a03ffDab5C90BADc5920b4f53B0884EB13cC","0x8153A21dFeB1F67024aA6C6e611432900FF3dcb9",3000,-6960,23040,"10000000000000000000","4402140425574513521","9999999999999999980","4402140425574513512","0xA3014F25945ae21119cecbea96056E826B6ae19B",1693223000]).estimateGas({ from: account.address });
    const tx = nftManager.methods.mint(["0x2899a03ffDab5C90BADc5920b4f53B0884EB13cC","0x8153A21dFeB1F67024aA6C6e611432900FF3dcb9",3000,-6960,23040,"10000000000000000000","4402140425574513521","9999999999999999980","4402140425574513512","0xA3014F25945ae21119cecbea96056E826B6ae19B",1693223000]).send({ from: account.address, gas: gasEstimate });
    const receipt = await tx;
    console.log(receipt);
}

main();