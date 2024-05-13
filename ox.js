const qs = require('qs');
async function main(){
const params = {
    // Not all token symbols are supported. The address of the token should be used instead.
    sellToken: '0xb93cba7013f4557cDFB590fD152d24Ef4063485f', //DAI
    buyToken: '0x79C950C7446B234a6Ad53B908fBF342b01c4d446', //WETH
    // Note that the DAI token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
    sellAmount: '1000000000000000000',
    takerAddress: '0xA3014F25945ae21119cecbea96056E826B6ae19B', //Including takerAddress is highly recommended to help with gas estimation, catch revert issues, and provide the best price
};

const headers = {'0x-api-key':'108ce82c-b1c3-45d4-8d55-061f8b768fbf'};
const response = await fetch(
    `https://goerli.api.0x.org/swap/v1/quote?${qs.stringify(params)}`, { headers }
); // Using the global fetch() method. Learn more https://developer.mozilla.org/en-US/docs/Web/API/fetch

console.log(await response.json());
}

main();