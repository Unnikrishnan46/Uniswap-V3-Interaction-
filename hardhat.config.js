require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("solidity-docgen");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version:"0.7.6",
    settings:{
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/42237fbfbd2a472c88e935a4bfac5aac"
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
  docgen: {},
};
