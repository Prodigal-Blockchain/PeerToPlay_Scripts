async function main() {
    require('dotenv').config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const ABI = require('./uniProxyABI.json');
    const oracleABI=require('./oracleABI.json');
    const erc20ABI= require('./erc20ABI.json');
    const { V0Swap } = require("./swapAggregator2");
    
    const uniProxy = new web3.eth.Contract(ABI, '0x82FcEB07a4D01051519663f6c1c919aF21C27845');
    const oracle=new web3.eth.Contract(oracleABI,"0x53Ea3946874418988F0e025259fD8AbE241Be722");
    
    const inputToken= "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"; //USDT
    const inputAmount="50000";
    const inputDecimal=6;
    const getDecimalUSD= await oracle.methods.decimals(inputToken,"0x0000000000000000000000000000000000000348").call();
    const inputTokenPrice= await oracle.methods.latestRoundData(inputToken,"0x0000000000000000000000000000000000000348").call();
    console.log((inputAmount/10**inputDecimal));
    console.log((inputTokenPrice.answer/10**getDecimalUSD));
    const InputUSDvalue= (inputAmount/(10**inputDecimal))*(inputTokenPrice.answer/(10**getDecimalUSD));
    console.log("input amount in USD:");
    console.log(InputUSDvalue);

    const token0PriceDecimals= await oracle.methods.decimals("0xaf88d065e77c8cC2239327C5EDb3A432268e5831","0x0000000000000000000000000000000000000348").call();
    const token1PriceDecimals=await oracle.methods.decimals("0xf97f4df75117a78c1A5a0DBb814Af92458539FB4","0x0000000000000000000000000000000000000348").call();
    const token0price=await oracle.methods.latestRoundData("0xaf88d065e77c8cC2239327C5EDb3A432268e5831","0x0000000000000000000000000000000000000348").call();
    const token1price=await oracle.methods.latestRoundData("0xf97f4df75117a78c1A5a0DBb814Af92458539FB4","0x0000000000000000000000000000000000000348").call();

    const token0Price=token0price.answer/(10**token0PriceDecimals);
    const token1Price=token1price.answer/(10**token1PriceDecimals);
    console.log("token0Price:",token0Price);
    console.log("token1Price:",token1Price);
    const r= await uniProxy.methods.getDepositAmount("0xf8b645c32F660f5c997ED250f264cA4a0E7A5967","0xaf88d065e77c8cC2239327C5EDb3A432268e5831","1000000").call();
    const ratio= (r.amountEnd/10**18);
    console.log("ratio of token0 to token1",ratio);

    const unroundedX =InputUSDvalue/(token0Price+(ratio*token1Price)); //token0Amount
    const x = (Number(unroundedX.toFixed(6))).toString();
    console.log("unroundedX",unroundedX);
    console.log("x",x);
    const unroundedY =x*ratio;
    const y = (Number(unroundedY.toFixed(16))).toString();
    console.log("unroundedY",unroundedY);
    console.log("y",y);

    // const unroundedX= (InputUSDvalue/2)/token0Price;
    // const x = (Number(unroundedX.toFixed(6))).toString();
    // console.log("token0 amount",x);
    // const unroundedY= (InputUSDvalue/2)/token1Price; 
    // const y = (Number(unroundedY.toFixed(6))).toString();
    // console.log("token1Amount",y);
    
    const sellToken1 = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" 
    const buyToken1 = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" 
    const buyAmount1 = x // paste the sell amount 
    console.log("buyAmount",buyAmount1);
    V0Swap(sellToken1,buyToken1,buyAmount1);
    await delay(30000);

    const sellToken2 = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" 
    const buyToken2 = "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4" 
    const buyAmount2 = y // paste the sell amount 
    console.log("buyAmount2",buyAmount2);
    V0Swap(sellToken2,buyToken2,buyAmount2);
    await delay(30000);


    const amount= await uniProxy.methods.getDepositAmount("0xf8b645c32F660f5c997ED250f264cA4a0E7A5967","0xaf88d065e77c8cC2239327C5EDb3A432268e5831",Number(unroundedX.toFixed(6))*(10**6)).call();
    const currentGasPrice = await web3.eth.getGasPrice(); // Get current gas price
    
    console.log("amounts");
    console.log(amount);
    console.log(amount.amountEnd);
    //100 USDT
    //1:2
    //0.5$ USDC
    //0.5$ ETH

    //0.9$*100=1*1.01+2*19
   
    const USDC = new web3.eth.Contract(erc20ABI, '0xaf88d065e77c8cC2239327C5EDb3A432268e5831');
    const LINK =new web3.eth.Contract(erc20ABI, '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4');

    USDCAllowance=await USDC.methods.allowance("0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB","0x82FcEB07a4D01051519663f6c1c919aF21C27845");
    LINKAllowance=await LINK.methods.allowance("0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB","0x82FcEB07a4D01051519663f6c1c919aF21C27845");

    if (USDCAllowance<(Number(unroundedX.toFixed(6))*(10**6))){
        const currentGasPrice = await web3.eth.getGasPrice(); // Get current gas price
    
    const estimatedGas = await USDC.methods.approve("0x82FcEB07a4D01051519663f6c1c919aF21C27845", Number(unroundedX.toFixed(6))*(10**6)).estimateGas({ from: '0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB' });
    const gasLimit = estimatedGas + 20000; // Adding a buffer
    console.log("EstimatedGas");
    console.log(gasLimit);
  
    const transaction = USDC.methods.approve("0x82FcEB07a4D01051519663f6c1c919aF21C27845", Number(unroundedX.toFixed(6))*(10**6));
    
    const txData = {
        to: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        gas: gasLimit,
        gasPrice: currentGasPrice, // Using current network gas price
        data: transaction.encodeABI(),
        from: '0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB'
    };
  
    const signedTx = await web3.eth.accounts.signTransaction(txData, PRIVATE_KEY);
  
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
        if (!error) {
            console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
        } else {
            console.log("❗Something went wrong while submitting your transaction:", error)
        }
    });
    await delay(30000);
    }

    
    if (LINKAllowance<amount.amountEnd){
        const currentGasPrice = await web3.eth.getGasPrice(); // Get current gas price
    
    const estimatedGas = await LINK.methods.approve("0x82FcEB07a4D01051519663f6c1c919aF21C27845",amount.amountEnd).estimateGas({ from: '0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB' });
    const gasLimit = estimatedGas + 20000; // Adding a buffer
    console.log("EstimatedGas");
    console.log(gasLimit);
  
    const transaction = USDC.methods.approve("0x82FcEB07a4D01051519663f6c1c919aF21C27845",amount.amountEnd);
    
    const txData = {
        to: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        gas: gasLimit,
        gasPrice: currentGasPrice, // Using current network gas price
        data: transaction.encodeABI(),
        from: '0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB'
    };
  
    const signedTx = await web3.eth.accounts.signTransaction(txData, PRIVATE_KEY);
  
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
        if (!error) {
            console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
        } else {
            console.log("❗Something went wrong while submitting your transaction:", error)
        }
    });
    await delay(30000);
    }
  
    
    const estimatedGas = await uniProxy.methods.deposit(Number(unroundedX.toFixed(6))*(10**6),amount.amountEnd, "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB","0xf8b645c32F660f5c997ED250f264cA4a0E7A5967",[0,0,0,0]).estimateGas({ from: '0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB' });
    const gasLimit = estimatedGas + 20000; // Adding a buffer
    console.log("EstimatedGas");
    console.log(gasLimit);
  
    const transaction = uniProxy.methods.deposit(Number(unroundedX.toFixed(6))*(10**6),amount.amountEnd, "0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB","0xf8b645c32F660f5c997ED250f264cA4a0E7A5967",[0,0,0,0]);
    
    const txData = {
        to: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
        gas: gasLimit,
        gasPrice: currentGasPrice, // Using current network gas price
        data: transaction.encodeABI(),
        from: '0x6A1EA5565a6404B2CbA35D99C8E564a66F33bFEB'
    };
  
    const signedTx = await web3.eth.accounts.signTransaction(txData, PRIVATE_KEY);
  
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
        if (!error) {
            console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
        } else {
            console.log("❗Something went wrong while submitting your transaction:", error)
        }
    });
  }
  
  main();
  

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }