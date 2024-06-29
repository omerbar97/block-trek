// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Campaigns {

    address owner;
    string[] public deployedCampaignsUuid;
    mapping(string => Campaign) campaigns;

    struct Contributer {
        address donator;
        uint256 amount;
        uint256 date;
    }

    struct Campaign {
        string uuid;
        address owner;
        string campaignName;
        string campaignDescription;
        address[] contributorsKeys; 
        uint256 startDate;
        uint256 endDate;
        uint256 goalAmount;
        uint256 totalContributions;
        string campaignType;
        bool isFinished;
        mapping(address => Contributer) contributors;
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
    event FundsRetrievedByCampaignOwner(string uuid, address owner, uint256 amount);
    event FundsRetrieved(string uuid, address owner, uint256 amount);

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
        campaigns[uuid].startDate = block.timestamp;
        campaigns[uuid].totalContributions = 0;
        campaigns[uuid].campaignType = campaignType;
        campaigns[uuid].isFinished = false;
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
        uint256,
        string memory,
        address[] memory,
        bool
    ) {
        require(bytes(campaigns[uuid].uuid).length != 0, "campaign with this uuid doesn't exists");
        Campaign storage campaign = campaigns[uuid];
        return (
            campaign.uuid,
            campaign.owner,
            campaign.campaignName,
            campaign.campaignDescription,
            campaign.startDate,
            campaign.endDate,
            campaign.goalAmount,
            campaign.totalContributions,
            campaign.campaignType,
            campaign.contributorsKeys,
            campaign.isFinished
        );
    }

    function getContributions(string memory uuid) public view returns (address[] memory, uint256[] memory, uint256[] memory) {
        require(bytes(campaigns[uuid].uuid).length != 0, "Campaign with this uuid doesn't exist");
        Campaign storage campaign = campaigns[uuid];
        address[] memory keys = campaign.contributorsKeys;
        uint256[] memory amounts = new uint256[](keys.length);
        uint256[] memory dates = new uint256[](keys.length);

        for (uint256 i = 0; i < keys.length; i++) {
            Contributer storage contributer = campaign.contributors[keys[i]];
            amounts[i] = contributer.amount;
            dates[i] = contributer.date;
        }

        return (keys, amounts, dates);
    }

    function donate(string memory uuid) public payable {
        require(bytes(campaigns[uuid].uuid).length > 0, "Campaign doesn't exist");
        require(campaigns[uuid].owner != msg.sender, "Owner cannot conrtibute to it self");
        require(campaigns[uuid].endDate > block.timestamp, "Campaign end date already reached");
        require(campaigns[uuid].goalAmount > campaigns[uuid].totalContributions, "Campaign already funded the goal amount");

        Campaign storage campaign = campaigns[uuid];

        if (campaign.contributors[msg.sender].amount == 0) {
            // Adding the donator to the contributors list if not already present
            campaign.contributorsKeys.push(msg.sender);
        }

        // Updating the contributor's information
        campaign.contributors[msg.sender].donator = msg.sender;
        campaign.contributors[msg.sender].amount += msg.value;
        campaign.contributors[msg.sender].date = block.timestamp;
        campaign.totalContributions += msg.value;

        if (campaign.totalContributions >= campaign.goalAmount) {
            emit CampaignCompleted(campaign.uuid, block.timestamp);
        }

        // New contribution
        emit Contribution(campaign.uuid, msg.sender, msg.value, block.timestamp);
    }

    function getCampaignDonation(string memory uuid) public {
        require(bytes(campaigns[uuid].uuid).length > 0, "Campaign doesn't exist");
        Campaign storage campaign = campaigns[uuid];
        require(campaign.endDate < block.timestamp || campaign.goalAmount <= campaign.totalContributions, "Campaign needs to be at its end date or fully funded");
        require(campaign.owner == msg.sender, "Only the campaign owner can retrieve the campaign funding");

        uint256 amount = campaign.totalContributions;
        campaign.totalContributions = 0;

        // Transfer the funds to the campaign owner
        (bool success, ) = campaign.owner.call{value: amount}("");
        if (!success) {
            // restoring the campaign amount
            campaign.totalContributions = amount;
        }
        emit FundsRetrievedByCampaignOwner(uuid, campaign.owner, amount);
    }

    function getMoneyBackFromCampaign(string memory uuid) public {
        require(bytes(campaigns[uuid].uuid).length > 0, "Campaign doesn't exist");
        Campaign storage campaign = campaigns[uuid];
        require(campaign.endDate > block.timestamp, "Campaign already finished cannot retreivied the money");
        require(campaign.owner != msg.sender, "Owner can withdraw any money because the owner cannot donate it for a campaign that he owns.");

        uint256 amount = campaigns[uuid].contributors[msg.sender].amount;
        campaigns[uuid].contributors[msg.sender].amount = 0;
        require(amount > 0, "No amount to refund");

        // Transfer the funds to the campaign owner
        (bool success, ) = campaign.owner.call{value: amount}("");
        if (success) {
            campaign.totalContributions -= amount;
            // updating the new value of the contributation
            campaigns[uuid].contributors[msg.sender].date = block.timestamp;
        } else {
            // restoring the value
            campaigns[uuid].contributors[msg.sender].amount = amount;
        }
        emit FundsRetrieved(uuid, msg.sender, amount);
    }
}
