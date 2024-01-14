// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Enum for different campaign types
enum CampaignType {
    Donation,
    Reward,
    Equity
}

contract Campaign {
    address public owner;
    mapping(address => uint256) public contributors;
    uint256 public endDate;
    uint256 public goalAmount;
    uint256 public totalContributions;
    CampaignType public campaignType;

    // Events for tracking contributions, refund, withdrawal, and campaign completion
    event Contribution(address indexed contributor, uint256 amount);
    event Refund(address indexed contributor, uint256 amount);
    event Withdrawal(uint256 amount);
    event CampaignCompleted();

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
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

    constructor(
        uint256 _endDate,
        uint256 _goalAmount,
        CampaignType _campaignType
    ) {
        owner = msg.sender;
        endDate = _endDate;
        goalAmount = _goalAmount;
        campaignType = _campaignType;
    }

    function contribute() external payable campaignNotEnded {
        require(msg.value > 0, "Contribution amount must be greater than 0");
        contributors[msg.sender] += msg.value;
        totalContributions += msg.value;
        emit Contribution(msg.sender, msg.value);
    }

    function getCampaignDetails()
        external
        view
        returns (
            address,
            uint256,
            uint256,
            CampaignType
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
        require(
            block.timestamp >= endDate && totalContributions < goalAmount,
            "Refund not available"
        );

        uint256 refundAmount = contributors[msg.sender];
        require(refundAmount > 0, "No contribution to refund");

        // Reset contributor balance
        contributors[msg.sender] = 0;

        // Refund the contributor
        payable(msg.sender).transfer(refundAmount);

        emit Refund(msg.sender, refundAmount);
    }

    function withdrawFunds() external onlyOwner campaignEnded {
        require(
            totalContributions >= goalAmount,
            "Withdrawal not allowed, goal not met"
        );

        // Transfer funds to the owner
        payable(owner).transfer(totalContributions);

        emit Withdrawal(totalContributions);
    }

    function campaignEnd() external onlyOwner {
    require(block.timestamp >= endDate, "Campaign has not ended yet");

    // If the goal is achieved, the funds are transferred to the owner
    if (totalContributions >= goalAmount) {
        payable(owner).transfer(totalContributions);
    } else {
        // Refund all contributors
        for (address contributor : contributors) {
            uint256 refundAmount = contributors[contributor];
            
            // Reset contributor balance
            contributors[contributor] = 0;

            // Refund the contributor
            payable(contributor).transfer(refundAmount);

            emit Refund(contributor, refundAmount);
        }
    }

    emit CampaignCompleted();
}
}
