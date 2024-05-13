const { Price, Token } = require( "@uniswap/sdk-core");
const { nearestUsableTick, priceToClosestTick, tickToPrice } = require ('@uniswap/sdk');
​
const PriceGetter = async ()=>{
        const token1address ="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
        const token2address ="0xdAC17F958D2ee523a2206206994597C13D831ec7"
        const token1Symbol="USDT"
        const tokenSymbol="USDC"
        const tokenName1 ="USD Coin"
        const tokenName2 ="Tether USD"
const token1 =  new Token( 5, token1address, 6, tokenSymbol, tokenName1)
const token2 =  new Token( 5, token2address, 6, token1Symbol, tokenName2)
​
const minValue= 1;
const maxValue = 90;
const price1 = new Price( token1, token2, minValue, 1)
const price2 = new Price( token1, token2, maxValue, 1)
​
​
​
const priceToTick = await priceToClosestTick(price1)
const priceToTick2 = await priceToClosestTick(price2)
​
const fee = 0.5 * 100;
const nearestUsable1 = await nearestUsableTick(priceToTick, fee)
const nearestUsable2 = await nearestUsableTick(priceToTick2, fee)
​
const tickToPrice1 = await  tickToPrice(token1, token2, nearestUsable1 )
console.log(tickToPrice1);
const tickToPrice2 =  tickToPrice(token1, token2, nearestUsable2 )
}
PriceGetter()