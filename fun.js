const { Price, Token } = require("@uniswap/sdk-core");
const { nearestUsableTick, priceToClosestTick, tickToPrice } = require('@uniswap/v3-sdk');
const JSBI = require('jsbi');
require('dotenv').config();
const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ETH_NODE_URL);
//A function that converts user input into valid price value
const PriceGetter = () => {
        const token0Address = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"; // user selected token0 details to be passed
        const token1Address = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"; //user selected token1 details to be passed 
        const token0Symbol = "Wrapped Matic";// user selected token0 details to be passed
        const token1Symbol = "WETH";//user selected token1 details to be passed 
        const token0Name = "WMATIC";// user selected token0 details to be passed
        const token1Name = "Wrapped Ether";//user selected token1 details to be passed 
        const token0Decimal=18;// user selected token0 details to be passed
        const token1Decimal=18;//user selected token1 details to be passed 
        const chainId=137;//selected chain
        const token0 = new Token(chainId, token0Address,token0Decimal, token0Symbol, token0Name); //defining token0
        const token1 = new Token(chainId, token1Address, token1Decimal, token1Symbol, token1Name); //defining token1
        const userInputToken0="0.0001";//user input of token0
        const userInputToken1="0.0005";//user input of token1
        const minValue = adjustDecimal(userInputToken0,token0Decimal);
        const maxValue = adjustDecimal(userInputToken1,token1Decimal);
        const baseToken=token0;//as selected by user on ui
        let priceLower;
        let priceUpper;
        const feeTier=500;//as selected by user

        if(baseToken==token0){
                const baseValue= adjustDecimal("1",token0Decimal);
                priceLower = new Price(token0, token1,baseValue, minValue); 
                priceUpper = new Price(token0, token1,baseValue, maxValue);
        }
        else{
                const baseValue= adjustDecimal("1",token1Decimal);
                priceLower = new Price(token1, token0,baseValue, minValue); 
                priceUpper = new Price(token1, token0,baseValue, maxValue);
        }
        
    
        const nearestLowerTick = priceToClosestTick(priceLower);
        const nearestUpperTick = priceToClosestTick(priceUpper);
        
        
        const tickSpacing =feeTierToTickSpacing(feeTier);
        const lowerTick = nearestUsableTick(nearestLowerTick, tickSpacing);
        const upperTick = nearestUsableTick(nearestUpperTick, tickSpacing);
//      
        const lowerPrice = tickToPrice(token0, token1,lowerTick);
        const upperPrice = tickToPrice(token0, token1,upperTick);
        console.log(getPriceValue(lowerPrice));//output to display on ui
        console.log(getPriceValue(upperPrice));//output to display on ui
}
const getPriceValue = (priceObj) => {
        const numerator = JSBI.toNumber(priceObj.numerator);
        const denominator = JSBI.toNumber(priceObj.denominator);
        return numerator / denominator; 
}

const adjustDecimal = (value, decimals) => {
        const parts = value.split(".");
        const adjustedValue = parts.join(''); // Remove the decimal point
        const adjustedDecimals = decimals - (parts[1]?.length || 0);
        return JSBI.multiply(JSBI.BigInt(adjustedValue), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(adjustedDecimals)));

    }
    function feeTierToTickSpacing(feeTier) {
        switch (feeTier) {
            case 100:    // represents 0.01% fee
                return 200;
            case 500:    // represents 0.05% fee
                return 10;
            case 3000:   // represents 0.3% fee
                return 60;
            case 10000:  // represents 1% fee
                return 200;
            default:
                throw new Error('Invalid fee tier provided');
        }
    }
PriceGetter();