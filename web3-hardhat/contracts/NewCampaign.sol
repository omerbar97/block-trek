// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



contract CrowdFundingFactory {

    address owner; // owner of the entire crowd funding platform
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
    ) public {
        require(bytes(uuid).length > 0, "UUID is required");
        address campaignOwner = msg.sender;
        address[] memory emptyContributorsKeys;
        Campaign storage newCampaign = campaigns[uuid];

        // if exsits
        require(bytes(newCampaign.uuid).length == 0, "This campaign UUID already exists");
        newCampaign.uuid = uuid;
        newCampaign.owner = campaignOwner;
        newCampaign.campaignName = campaignName;
        newCampaign.campaignDescription = campaignDescription;
        newCampaign.contributorsKeys = emptyContributorsKeys;
        newCampaign.endDate = endDate;
        newCampaign.goalAmount = goalAmount;
        newCampaign.totalContributions = 0;
        newCampaign.campaignType = campaignType;
        deployedCampaignsUuid.push(uuid);
        emit CampaignCreated(uuid, campaignOwner);
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

    function donate(string memory uuid) public payable returns(bool) {
        require(msg.value > 0, "Can only donate positive number");
        Campaign storage newCampaign = campaigns[uuid];
        require(bytes(newCampaign.uuid).length > 0, "Campaign doesn't exists");
        require(newCampaign.endDate < block.timestamp, "Campaign end date already reached");
        require(newCampaign.goalAmount < newCampaign.totalContributions, "Campaign already funded the goal amount");
        require(newCampaign.goalAmount <= newCampaign.totalContributions + msg.value, "You cannot donate more then the goal amount");
        
    }
}
