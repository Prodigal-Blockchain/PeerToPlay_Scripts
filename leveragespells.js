/**
* Welcome to Instadapp Playground, the online DeFi playground!
*
* Everything here works just like it does when you're running Instadapp dsa-connect SDK locally.
* Learn more about the SDK at https://github.com/instadapp/dsa-connect
*
* Note that you need a connected web3 wallet (like Metamask) to use this online terminal and
* after executing transactions, you can also check your DeFi position status at https://defi.instadapp.io
*
* Feel free to play with this example if you're just learning, or trash it and
* start from scratch if you know enough to be dangerous. Have fun!
*
* Need help? Join our discord (#dev) channel at https://discord.com/invite/C76CeZc
*/

console.log('Connected address', USER_ADDRESS)

const dsaWallets = await dsa.getAccounts(USER_ADDRESS)

// If you don't have a Instadapp DeFi Smart Account
if (dsaWallets.length == 0) return alert("Create a DSA")

const wETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
const stETH = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
const amount = web3.utils.toWei('100', 'ether') // 0.002 ETH amount in wei
const depositAmount=web3.utils.toWei('200', 'ether')

let spells = dsa.Spell()



spells.add({
  connector: "INSTAPOOL-C",
  method: "flashBorrowAndCast",
  args: [wETH, amount,5,"0x", "0x"]
});

const sellToken = wETH // paste the sell token address 
const buyToken = stETH // paste the buy token address 
const sellAmount = amount // paste the sell amount 
const slippage = "1" // 1% slippage

const { data: swapData } = await axios.get(`https://api.instadapp.io/defi/mainnet/1inch/v4/swap`, {
  params: {
    sellToken,
    buyToken,
    sellAmount,
    dsaAddress: dsa.instance.address,
    slippage,
  }
})

const swapId = "263279" // Random swap setId

spells.add({
    connector: "1INCH-V4-A",
    method: "sell",
    args: [buyToken, sellToken, sellAmount, swapData.unitAmt, swapData.calldata, swapId]
});


spells.add({
  "connector": "AAVE-V2-A",
  "method": "deposit",
  "args": [stETH,depositAmount, 0, 0]
})

spells.add({
  connector: "AAVE-V3-A",
  method: "borrow",
  args: [wETH, amount,2,0,0]
});

spells.add({
  connector: "INSTAPOOL-C",
  method: "flashPayback",
  args: [wETH, amount,0,0]
});



console.log(dsa.instance)
console.log(dsa.encodeSpells(spells))
// keep adding spells across DeFi protocols to execute.

console.log("Transaction hash:",
  await dsa.cast({
    spells,
  	value: 0
  })
)
