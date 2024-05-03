// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Campaign.sol";

contract CrowdFundingFactory {
    address owner;
    address[] public deployedCampaigns;

    constructor() {
        owner = msg.sender;
    }

    event CampaignCreated(
        address indexed campaignAddress,
        address indexed owner
    );

    function createCampaign(
        string memory ownerName,
        string memory description,
        uint256 endDate,
        uint256 goalAmount,
        string memory campaignType
    ) external returns (Campaign) {
        Campaign newCampaign = new Campaign(
            ownerName,
            description,
            endDate,
            goalAmount,
            campaignType
        );

        deployedCampaigns.push(address(newCampaign));

        emit CampaignCreated(address(newCampaign), msg.sender);
        return newCampaign;
    }

    function getDeployedCampaigns() external view returns (address[] memory) {
        return deployedCampaigns;
    }
}
