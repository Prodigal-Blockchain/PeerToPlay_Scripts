const axios = require("axios");

async function httpCall() {

  const url = "https://api.1inch.dev/swap/v5.2/42161/swap";

  const config = {
      headers: {
  "Authorization": "Bearer YHIkhFVEk5PyshRZy5i9zboVDHk8A0Bm"
},
      params: {
  "src": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  "dst": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  "amount": "1000000",
  "from": "0xbFE963775C57FE0B1d0c4F80a8a2CE1e431168A0",
  "slippage": "0"
}
  };
      

  try {
    const response = await axios.get(url, config);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

httpCall();