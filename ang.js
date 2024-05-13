// in nodejs
require("dotenv").config();
const Web3 = require("web3");
const DSA = require("dsa-connect");
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.ETH_NODE_URL)
);
const chainId = 137;
const dsa = new DSA(
  {
    web3: web3,
    mode: "node",
    privateKey: process.env.PRIVATE_KEY,
  },
  chainId
);
​
//CREATE DSA ACCOUNT
// const gasPrice = 5000;
const gasPrice = web3.utils.toWei("90", "gwei");
const origin = "0xA3014F25945ae21119cecbea96056E826B6ae19B";
let authority = "0xA3014F25945ae21119cecbea96056E826B6ae19B";
dsa.build({
  gasPrice: gasPrice, // estimated gas price
  origin: origin,
  authority: authority,
});