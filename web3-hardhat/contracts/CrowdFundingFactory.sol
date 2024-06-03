// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Campaign.sol";

contract CrowdFundingFactory {
    address owner;
    address[] public deployedCampaignsAddress;
    mapping(address => Campaign) campaigns;

    constructor() {
        owner = msg.sender;
    }

    event CampaignCreated (
        address indexed campaignAddress,
        address indexed owner,
        string uuid
    );

    function createCampaign(
        address ownerWalletAddress,
        string memory campaignName,
        string memory description,
        uint256 endDate,
        uint256 goalAmount,
        string memory campaignType,
        string memory uuid
    ) external payable returns (Campaign) {
        Campaign newCampaign = new Campaign(
            campaignName,
            description,
            endDate,
            goalAmount,
            campaignType,
            ownerWalletAddress,
            uuid
        );

        deployedCampaignsAddress.push(address(newCampaign));

        emit CampaignCreated(address(newCampaign), ownerWalletAddress, uuid);
        return newCampaign;
    }

    function getDeployedCampaignsAddress() external view returns (address[] memory) {
        return deployedCampaignsAddress;
    }

    // function donateToCampaign(address campaignAddress) external payable {
    //     Campaign campaignContract = campaigns[campaignAddress];
        
    //     require(address(campaignAddress) != address(0), "Campaign contract does not exist");
    //     require(campaignContract.owner() != msg.sender, "The campaign owner cannot donate to it self");

    //     campaignContract.contribute();
    // }

    function getCampaignContractByCampaignAddress(address campaignAddress) external view returns (Campaign) {
        // Retrieve the campaign contract associated with the provided campaign address
        Campaign campaignContract = campaigns[campaignAddress];
        
        // Check if the retrieved campaign contract exists and if the caller is the owner
        require(address(campaignContract) != address(0), "Campaign contract does not exist");
        require(campaignContract.owner() == msg.sender, "Only the campaign owner can access this function");
        
        // Return the campaign contract
        return campaignContract;
    }

}
