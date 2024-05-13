const express = require("express");
// Import Moralis
const Moralis = require("moralis").default;
// Import the EvmChain dataType
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const app = express();
const port = 3000;

// Add a variable for the api key, address and chain
const MORALIS_API_KEY =
  "e9LK0P6oyy2Jx2TMXWIRrrRi1o2iYSucNHSSBheX5uIaZJUFw7XSr4iiCeRlDDYo";
const address = "0x7734a07287591E2723Fe2eFb0F3FD8c7587F6635";
// sample address = 0x2260fac5e5542a773aa44fbcfedf7c193bc2c599
const chain = EvmChain.POLYGON;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function getDemoData() {
  const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain,
  });
  const native = nativeBalance.result.balance.ether;

  // Get token balances
  const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  });

  // Format the balances to a readable output with the .display() method
  const tokens = tokenBalances.result.map((token) => token.display());

  // Add tokens to the output
  return { native, tokens };
}

app.get("/demo", async (req, res) => {
  try {
    // Get and return the crypto data
    const data = await getDemoData();
    res.status(200);
    res.json(data);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500);
    res.json({ error: error.message });
  }
});

// Add this a startServer function that initialises Moralis
const startServer = async () => {
  await Moralis.start({
    apiKey: "e9LK0P6oyy2Jx2TMXWIRrrRi1o2iYSucNHSSBheX5uIaZJUFw7XSr4iiCeRlDDYo",
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

// Call startServer()
startServer();