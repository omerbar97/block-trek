// Transparency.tsx
import { CONTRACT_ADDRESS, CONTRACT_URL } from '@/services/crypto/consts';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gml } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Importing the atom-one-dark theme

const solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CampaignFactory {
    address owner;
    string[] public deployedCampaignsUuid;
    mapping(string => Campaign) campaigns;

    struct Contributer {
        address donator;
        uint256 amount;
        uint256 date;
        bool isInKeys;
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
        bool isOwnerRetrievedDonations;
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
        campaigns[uuid].isOwnerRetrievedDonations = false;
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
        bool,
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
            campaign.isFinished,
            campaign.isOwnerRetrievedDonations
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

        if (campaign.contributors[msg.sender].amount == 0 && !campaign.contributors[msg.sender].isInKeys) {
            campaign.contributorsKeys.push(msg.sender);
            campaign.contributors[msg.sender].isInKeys = true;
        }

        campaign.contributors[msg.sender].donator = msg.sender;
        campaign.contributors[msg.sender].amount += msg.value;
        campaign.contributors[msg.sender].date = block.timestamp;
        campaign.totalContributions += msg.value;

        if (campaign.totalContributions >= campaign.goalAmount) {
            emit CampaignCompleted(campaign.uuid, block.timestamp);
        }

        emit Contribution(campaign.uuid, msg.sender, msg.value, block.timestamp);
    }

    function getCampaignDonation(string memory uuid) public {
        require(bytes(campaigns[uuid].uuid).length > 0, "Campaign doesn't exist");
        Campaign storage campaign = campaigns[uuid];
        require(campaign.endDate < block.timestamp || campaign.goalAmount <= campaign.totalContributions, "Campaign needs to be at its end date or fully funded");
        require(campaign.owner == msg.sender, "Only the campaign owner can retrieve the campaign funding");
        require(!campaign.isOwnerRetrievedDonations, "The owner of this campaign already got their donation!");

        uint256 amount = campaign.totalContributions;
        campaign.totalContributions = 0;

        (bool success, ) = campaign.owner.call{value: amount}("");
        if (!success) {
            campaign.totalContributions = amount;
            return;
        }
        campaign.isOwnerRetrievedDonations = true;
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

        (bool success, ) = campaign.owner.call{value: amount}("");
        if (success) {
            campaign.totalContributions -= amount;
            campaigns[uuid].contributors[msg.sender].date = block.timestamp;
            emit FundsRetrieved(uuid, msg.sender, amount);
        } else {
            campaigns[uuid].contributors[msg.sender].amount = amount;
        }
    }
}
`;

const Transparency = () => {
    return (
        <section className="transparency-section bg-gray-900 text-white py-16 w-full rounded-badge mb-20" id="transparency-section">
            <div className="container mx-auto px-4">
            <div className="justify-center mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-200 sm:text-6xl mb-8">
                        Smart Contract Transparency
                    </h2>
                    <p className="text-lg leading-relaxed mb-8 font-mono">
                        This smart contract is deployed on{' '}
                        <a 
                        href={CONTRACT_URL} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-500 hover:text-indigo-400 font-semibold underline">
                            {CONTRACT_URL}
                        </a>{' '}
                        with address:{' '}
                        <span className="text-green-400 font-semibold">
                            {CONTRACT_ADDRESS}
                        </span>
                    </p>                    
                    <div className="w-full rounded-lg shadow-lg overflow-hidden">
                        <SyntaxHighlighter language="solidity" style={gml} className="rounded-3xl">
                            {solidityCode}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Transparency;
