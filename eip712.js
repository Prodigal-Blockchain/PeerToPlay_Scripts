require('dotenv').config();
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(process.env.ETH_NODE_URL);
const web3 = new Web3(provider);

const privateKey = process.env.PRIVATE_KEY;



async function signTypedData(privateKey, typedData) {
    
    const from = web3.eth.accounts.privateKeyToAccount(privateKey).address;

    return new Promise((resolve, reject) => {
        provider.send({
            method: "eth_signTypedData_v4",
            params: [from, JSON.stringify(typedData)],
            from: from,
        }, (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.error) {
                return reject(new Error(result.error.message));
            }
            resolve(result.result);
        });
    });
}

async function main() {

const deadline = +new Date() + 60*60;
    
    const typedData = {
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" },
            ],
            Permit: [
                { name: "owner", type: "address" },
                { name: "spender", type: "address" },
                { name: "value", type: "uint256" },
                { name: "deadline", type: "uint256" },
            ],
        },
        primaryType: "Permit",
        domain: {
            name: "Liquid staked Ether 2.0",
            version: "2",
            chainId: 5,  // Mainnet. For Ropsten use 3, etc.
            verifyingContract: "0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F",
        },
        message: {
            owner: "0xA3014F25945ae21119cecbea96056E826B6ae19B",
            spender: "0x077B60752864B3e5291863cf8890603f9ab335d3",
            value: "100000000000000000",
            deadline: deadline,
        }
    };



    const signature = await signTypedData(privateKey, typedData);

    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = "0x" + signature.slice(130, 132);
    
    console.log("v:", v);
    console.log("r:", r);
    console.log("s:", s);
}

main();
