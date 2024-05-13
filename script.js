// in nodejs
require("dotenv").config();
const Web3 = require('web3');
const DSA = require('dsa-connect');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NODE_URL));
​
const address="0xA3014F25945ae21119cecbea96056E826B6ae19B";
const dsa = new DSA({
    web3: web3,
    mode: "node",
    privateKey: process.env.PRIVATE_KEY
  },
    137
);

​async function main(){ 
  await dsa.getAccounts(address);
​
// await dsa.setInstance(60188); // DSA ID
// const token = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
// const amount = web3.utils.toWei('1', 'ether');
// console.log(dsa)
// let spells = dsa.Spell();
// ​
// spells.add({
//     connector: "AAVE-V3-A",
//     method: "deposit",
//     args: [token, amount, 0, 0]
//   });
  
 
// ​
// console.log(dsa.instance)
// console.log(dsa.encodeSpells(spells))
// ​
// ​
// console.log("Transaction hash:",
//   await spells.cast({
//     gasPrice: web3.utils.toWei(0.1, "ether"),
//     value:"100000000000000000"
//   })
  
// )
}
main();