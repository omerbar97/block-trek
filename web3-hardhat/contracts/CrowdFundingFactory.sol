// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Campaign.sol";

contract CrowdFundingFactory {
    address[] public deployedCampaigns;

    event CampaignCreated(
        address indexed campaignAddress,
        address indexed owner
    );

    function createCampaign(
        string memory description,
        string memory ownerName,
        uint256 endDate,
        uint256 goalAmount,
        CampaignType campaignType
    ) external {
        Campaign newCampaign = new Campaign(
            description,
            ownerName,
            endDate,
            goalAmount,
            campaignType
        );

        deployedCampaigns.push(address(newCampaign));

        emit CampaignCreated(address(newCampaign), msg.sender);
    }

    function getDeployedCampaigns() external view returns (address[] memory) {
        return deployedCampaigns;
    }
}
