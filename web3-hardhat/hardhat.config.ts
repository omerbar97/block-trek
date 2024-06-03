import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
};

module.exports = {
  ...config,
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
};

