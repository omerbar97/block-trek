import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import { expect } from 'chai';
import { CrowdFundingFactory, Campaign  } from '../typechain-types';

describe('Campaign Contract', function () {
  let factory: CrowdFundingFactory;
  let campaign: Campaign;
  let owner: Signer;
  let accounts: Signer[];
  const campaignName = 'Test Campaign';
  const campaignDescription = 'This is a test campaign';
  const endDate = Math.floor(Date.now() / 1000) + 86400; // End date set to 1 day from now
  const goalAmount = ethers.utils.parseEther('100'); // Set goal amount to 100 ethers
  const campaignType = CampaignType.Donation;

  beforeEach(async function () {
    [owner, ...accounts] = await ethers.getSigners();
    const CrowdFundingFactory = await ethers.getContractFactory('CrowdFundingFactory', owner);
    factory = (await CrowdFundingFactory.deploy()) as CrowdFundingFactory;
  });

  it('Should create a campaign', async function () {
    await factory.createCampaign(campaignName, campaignDescription, endDate, goalAmount, campaignType);
    const deployedCampaigns = await factory.getDeployedCampaigns();
    expect(deployedCampaigns.length).to.equal(1);

    const deployedCampaign = deployedCampaigns[0];
    const Campaign = await ethers.getContractFactory('Campaign', owner);
    campaign = (await Campaign.attach(deployedCampaign)) as Campaign;

    expect(await campaign.owner()).to.equal(await owner.getAddress());
    expect(await campaign.campaignName()).to.equal(campaignName);
    expect(await campaign.campaignDescription()).to.equal(campaignDescription);
    expect(await campaign.endDate()).to.equal(endDate);
    expect(await campaign.goalAmount()).to.equal(goalAmount);
    expect(await campaign.campaignType()).to.equal(campaignType);
  });

  it('Should contribute to the campaign', async function () {
    await campaign.connect(accounts[0]).contribute({ value: ethers.utils.parseEther('50') });
    expect(await ethers.provider.getBalance(campaign.address)).to.equal(ethers.utils.parseEther('50'));
  });

  it('Should refund from the campaign', async function () {
    await campaign.refund();
    expect(await ethers.provider.getBalance(campaign.address)).to.equal(0);
  });

  it('Should withdraw funds from the campaign', async function () {
    await campaign.withdrawFunds();
    expect(await ethers.provider.getBalance(campaign.address)).to.equal(0);
  });

  it('Should end the campaign', async function () {
    await campaign.campaignEnd();
    expect(await ethers.provider.getBalance(campaign.address)).to.equal(0);
  });
});