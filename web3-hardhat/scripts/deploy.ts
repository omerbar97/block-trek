import { ethers } from "hardhat";

async function main() {

  const CrowdFundingFactory = await ethers.getContractFactory("CrowdFundingFactory");
  const crowdFundingFactory = await CrowdFundingFactory.deploy();

  const address = await crowdFundingFactory.getAddress()

  console.log("CrowdFundingFactory deployed to:", address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
