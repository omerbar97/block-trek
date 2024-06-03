// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CampaignType.sol";

contract Campaign {
    string public uuid; // unique identifier
    address public owner;
    string  public campaignName;
    string  public campaignDescription;
    address[] contributorsKeys; // the address of all the user that donated
    uint256 public endDate; // end date in linux time
    uint256 public goalAmount;
    uint256 public totalContributions;
    string public campaignType;
    mapping(address => uint256) public contributors;

    // Events for tracking contributions, refund, withdrawal, and campaign completion
    event Contribution(address indexed contributor, uint256 amount, uint256 time);
    event Refund(address indexed contributor, uint256 amount, uint256 time);
    event Withdrawal(uint256 amount, uint256 time);
    event CampaignCompleted(uint256 time);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier notOwner() {
        require(msg.sender != owner, "Owner cannot invoke this function");
        _;
    }

    modifier campaignNotEnded() {
        require(block.timestamp < endDate, "Campaign has already ended");
        _;
    }

    modifier campaignEnded() {
        require(block.timestamp >= endDate, "Campaign has not ended yet");
        _;
    }

    modifier contributionNumberMoreThenZero() {
        require(msg.value > 0, "Contribution amount must be greater than 0");
        _;
    }

    modifier goalAmountNotReached() {
        require(totalContributions < goalAmount, "Goal amount already reached");
        _;
    }

    constructor(
        string memory _campaignName,
        string memory _campaignDescription,
        uint256 _endDate,
        uint256 _goalAmount,
        string memory _campaignType,
        address _ownerWalletAddress,
        string memory _uuid
    ) {
        owner = _ownerWalletAddress;
        campaignName = _campaignName;
        campaignDescription = _campaignDescription;
        endDate = _endDate;
        goalAmount = _goalAmount;
        campaignType = _campaignType;
        uuid = _uuid;
    }

    function contribute() external payable notOwner campaignNotEnded contributionNumberMoreThenZero goalAmountNotReached {
        contributors[msg.sender] += msg.value;
        totalContributions += msg.value;
        bool isInList = false;
        for (uint256 i = 0; i < contributorsKeys.length; i++) {
            if (contributorsKeys[i] == msg.sender) {
                isInList = true;
                break;
            }
        }
        if (!isInList) {
            contributorsKeys.push(msg.sender);
        }
        if (totalContributions >= goalAmount) {
            emit CampaignCompleted(block.timestamp);
        }
        emit Contribution(msg.sender, msg.value, block.timestamp);
    }

    function getCampaignDetails()
        external
        view
        returns (
            address,
            uint256,
            uint256,
            string memory
        )
    {
        return (
            owner,
            endDate,
            goalAmount,
            campaignType
        );
    }

    function getContributorAmount(address contributor)
        external
        view
        returns (uint256)
    {
        return contributors[contributor];
    }

    function refund() external campaignNotEnded {
        // Can only refund when the end date didn't passed
        uint256 refundAmount = contributors[msg.sender];
        require(refundAmount > 0, "No contribution to refund");
        // Reset contributor balance
        contributors[msg.sender] = 0;
        totalContributions -= refundAmount;
        // Refund the contributor
        payable(msg.sender).transfer(refundAmount);
        emit Refund(msg.sender, refundAmount, block.timestamp);
    }

    function withdrawFunds() external onlyOwner campaignEnded {
        require(
            totalContributions >= goalAmount,
            "Withdrawal not allowed, goal not met"
        );

        // Transfer funds to the owner
        payable(owner).transfer(totalContributions);
        emit Withdrawal(totalContributions, block.timestamp);
    }

    function campaignEnd() external onlyOwner {
        require(block.timestamp >= endDate, "Campaign has not ended yet");
        // If the goal is achieved, the funds are transferred to the owner
        if (totalContributions >= goalAmount) {
            payable(owner).transfer(totalContributions);
        } else {
            // Refund all contributors
            for (uint256 i = 0; i < contributorsKeys.length; i++) {
                address contributor = contributorsKeys[i];
                uint256 refundAmount = contributors[contributor];

                if (refundAmount > 0) {
                    // Reset contributor balance
                    contributors[contributor] = 0;
                    // Refund the contributor
                    payable(contributor).transfer(refundAmount);
                    emit Refund(contributor, refundAmount, block.timestamp);
                }
            }
        }
    }
}
