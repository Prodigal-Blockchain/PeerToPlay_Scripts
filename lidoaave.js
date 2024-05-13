async function main() {
    require('dotenv').config();
    const { ETH_NODE_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(ETH_NODE_URL);
    const aaveABI = require('./aave.json');
    const lidoABI = require('./lido.json');
    
    const instaAccountAddress = '0x40B7F8Baa00091e12C0fC4c2D538e4DE62ee0258';
    const aaveConnector = new web3.eth.Contract(aaveABI, '0x492860432f37b10f9E9CA90FD56d4d69EA85709e');
    const lidoConnector = new web3.eth.Contract(lidoABI, '0xC4CdC682c40a051644183c6d3D8a955181d1944D');
    const tokenA='0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F';
    const tokenB='0xBa8DCeD3512925e52FE67b1b5329187589072A55';
  
    const amt1="100000000000000000";
    const amt2="10000000000000000";

    const amountWei = "100000000000000000";
    const encodedFunctionCall0 = lidoConnector.methods.deposit(amountWei,0,0).encodeABI();
    console.log('encode',encodedFunctionCall0);
    
    const encodedFunctionCall1 = aaveConnector.methods.deposit(tokenA,amt1,0,0).encodeABI();
      console.log('encode',encodedFunctionCall1);
  
    //   const encodedFunctionCall2 = aaveConnector.methods.borrow(tokenB,amt2,1,0,0).encodeABI();
    //   console.log('encode',encodedFunctionCall2);
  
  const functionAbi = {
    "constant": false,
    "inputs": [
        {
            "name": "_targetNames",
            "type": "string[]"
        },
        {
            "name": "_datas",
            "type": "bytes[]"
        },
        {
            "name": "_origin",
            "type": "address"
        }
    ],
    "name": "cast",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  };
  
  const gasLimit = 589645;
  const gasPrice = web3.utils.toWei('20', 'gwei');
  const encodedData = web3.eth.abi.encodeFunctionCall(functionAbi, [
    ['LidoStEth-v1','AaveV3-v1.2'],
    [
        encodedFunctionCall0,
        encodedFunctionCall1
        ],
    "0xA3014F25945ae21119cecbea96056E826B6ae19B"
  ]);
  
    const transaction = {
        from: "0xA3014F25945ae21119cecbea96056E826B6ae19B",
        to: instaAccountAddress,
        data: encodedData,
        value: 0, // or any ETH amount if required
        gas: gasLimit,
        gasPrice: gasPrice
    };
  
    const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);
  
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
    if (!error) {
      console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
    } else {
      console.log("❗Something went wrong while submitting your transaction:", error)
    }
   });
  }
  
  main();