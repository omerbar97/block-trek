import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("CampaignFactory");
  const contract = await Contract.deploy();
  const address = await contract.getAddress()
  console.log("CampaignFactory deployed to: ", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
