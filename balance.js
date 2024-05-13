
const JSBI = require('jsbi');
 require('dotenv').config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./erc20.json');

async function main() {

    const AccountAddress = '0x40B7F8Baa00091e12C0fC4c2D538e4DE62ee0258';//selected DSA Address
        const token = new web3.eth.Contract(ABI, '0x8153A21dFeB1F67024aA6C6e611432900FF3dcb9'); //token address to be passed here.
    // ... [rest of the code remains the same up to the balance fetching]

    const decimals = await token.methods.decimals().call();
    
    // Convert balance and divisor to JSBI BigInts
    const balanceBI = JSBI.BigInt(await token.methods.balanceOf(AccountAddress).call());
    const divisorBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals));

    const quotientBI = JSBI.divide(balanceBI, divisorBI);
    const remainderBI = JSBI.remainder(balanceBI, divisorBI);

    // Convert BigInts to strings and format
    const balanceReadable = `${quotientBI.toString()}.${remainderBI.toString().padStart(decimals, '0')}`;

    console.log(balanceReadable);
}

main();