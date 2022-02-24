require("@nomiclabs/hardhat-waffle");
const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString()
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    testnet: {
      url: `https://speedy-nodes-nyc.moralis.io/12c36cfbdd209707bb91d9a7/bsc/testnet`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};
