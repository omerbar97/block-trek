import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv'

const config: HardhatUserConfig = {
  solidity: "0.8.19",
};

dotenv.config()
const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  ...config,
  throwOnTransactionFailures: true,
  throwOnCallFailures: true,
  allowUnlimitedContractSize: true,
  timeout: 1800000,
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
};

