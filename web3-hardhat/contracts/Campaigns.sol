// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Campaigns {

    address owner;
    string[] public deployedCampaignsUuid;
    mapping(string => Campaign) campaigns;

    struct Campaign {
        string uuid;
        address owner;
        string campaignName;
        string campaignDescription;
        address[] contributorsKeys; 
        uint256 endDate;
        uint256 goalAmount;
        uint256 totalContributions;
        string campaignType;
        mapping(address => uint256) contributors;
    }

    constructor() {
        owner = msg.sender;
    }

    event CampaignCreated (
        string uuid,
        address indexed owner
    );
    
    event Contribution(string campaignUuid, address indexed contributor, uint256 amount, uint256 time);
    event Refund(string campaignUuid, address indexed contributor, uint256 amount, uint256 time);
    event Withdrawal(string campaignUuid, uint256 amount, uint256 time);
    event CampaignCompleted(string campaignUuid, uint256 time);

    // Function to create a new campaign
    function createCampaign(
        string memory uuid,
        string memory campaignName,
        string memory campaignDescription,
        uint256 endDate,
        uint256 goalAmount,
        string memory campaignType
    ) external {
        require(bytes(uuid).length > 0, "UUID is required");
        require(bytes(campaigns[uuid].uuid).length == 0, "This campaign UUID already exists");
        campaigns[uuid].uuid = uuid;
        campaigns[uuid].owner = msg.sender;
        campaigns[uuid].campaignName = campaignName;
        campaigns[uuid].campaignDescription = campaignDescription;
        campaigns[uuid].endDate = endDate;
        campaigns[uuid].goalAmount = goalAmount;
        campaigns[uuid].totalContributions = 0;
        campaigns[uuid].campaignType = campaignType;
        deployedCampaignsUuid.push(uuid);
        delete campaigns[uuid].contributorsKeys;
        emit CampaignCreated(uuid, msg.sender);
    }

    function getDeployedCampaignsUuid() external view returns (string[] memory) {
        return deployedCampaignsUuid;
    }

    function getCampaign(string memory uuid) public view returns (
        string memory,
        address,
        string memory,
        string memory,
        uint256,
        uint256,
        uint256,
        string memory,
        address[] memory
    ) {
        require(bytes(campaigns[uuid].uuid).length != 0, "campaign with this uuid doesn't exists");
        Campaign storage campaign = campaigns[uuid];
        return (
            campaign.uuid,
            campaign.owner,
            campaign.campaignName,
            campaign.campaignDescription,
            campaign.endDate,
            campaign.goalAmount,
            campaign.totalContributions,
            campaign.campaignType,
            campaign.contributorsKeys
        );
    }

    function donate(string memory uuid) public payable {
        require(bytes(campaigns[uuid].uuid).length > 0, "Campaign doesn't exists");
        require(campaigns[uuid].endDate > block.timestamp, "Campaign end date already reached");
        require(campaigns[uuid].goalAmount < campaigns[uuid].totalContributions, "Campaign already funded the goal amount");
        
        if(campaigns[uuid].contributors[msg.sender] == 0) {
            // adding the amount to the campaign
            campaigns[uuid].contributorsKeys.push(msg.sender);
        }

        campaigns[uuid].contributors[msg.sender] += msg.value;
        campaigns[uuid].totalContributions += msg.value;
        
        if(campaigns[uuid].totalContributions >= campaigns[uuid].goalAmount) {
            emit CampaignCompleted(campaigns[uuid].uuid, block.timestamp);
        }
        // New contribution
        emit Contribution(campaigns[uuid].uuid, msg.sender, msg.value, block.timestamp);
    }
}
