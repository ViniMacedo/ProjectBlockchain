require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY1,PRIVATE_KEY2, PRIVATE_KEY3, BESU_RPC_URL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    besu: {
      url: BESU_RPC_URL,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2, PRIVATE_KEY3]
    }
  }
};
