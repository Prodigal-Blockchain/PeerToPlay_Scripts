// in nodejs
require("dotenv").config();
const Web3 = require('web3')
const DSA = require('dsa-connect');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NODE_URL))
const address= "0xa3014f25945ae21119cecbea96056e826b6ae19b";

const chainId=137
const dsa = new DSA(web3, chainId);


async function demo(){
const dsaWallets = await dsa.getAccounts(address)
console.log(dsaWallets)

}
demo()


async function main(){
await dsa.setInstance("60188");

const token = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
const amt = web3.utils.toWei('1', 'ether') //1 WMATIC

let spells = dsa.Spell();

spells.add({
  connector: "AAVE-V3-A",
  method: "deposit",
  args: [token, amt, 0, 0]
});


console.log(dsa.instance)
console.log(dsa.encodeSpells(spells))


console.log("Transaction hash:",
  await spells.cast({
    gasPrice: web3.utils.toWei("0.1", "ether"),
    value:"100000000000000000"
  })
  
)
}
main()
