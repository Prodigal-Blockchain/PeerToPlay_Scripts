const { ethers } = require("ethers");
const { getProvider } = require("./provider");

function getSigner() {
    const MATIC_PRIVATE_KEY = "27b8fa35241b886c59c51a9675f5fc79e818e65f5c99244dd7b79f588dd9f2a9";

    return new ethers.Wallet(MATIC_PRIVATE_KEY, getProvider());
}

module.exports = { getSigner };
