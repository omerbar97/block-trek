<h1 align="center">
    Block-Trek
</h1 >

<h3 align="center">
    A decentralized crowdfunding platform built on Ethereum
</h3>

<p align="center" >
    <img src="https://nextjs.org/favicon.ico" alt="Next.js" width="80"/>
    &nbsp; &nbsp; &nbsp;
    <img src="https://www.prisma.io/favicon.ico" alt="Prisma" width="80"/>
    &nbsp; &nbsp; &nbsp;
    <img src="https://cdn.worldvectorlogo.com/logos/postgresql.svg" alt="PostgreSQL" width="80"/>
    &nbsp; &nbsp; &nbsp;
    <img src="https://thirdweb.com/favicon.ico" alt="web3" width="80"/>
</p>



Block-Trek is a decentralized crowdfunding platform inspired by Kickstarter. The platform allows users to create and contribute to campaigns, leveraging the power of blockchain technology for transparency and security. The app is built with Next.js, ethers.js, and Solidity, and the smart contracts.

## Features

- **Create Campaigns**: Users can create new crowdfunding campaigns, specifying details like title, description, target amount, and deadline.
- **Contribute to Campaigns**: Users can fund campaigns by sending Ethereum, with their contributions securely recorded on the blockchain.
- **Withdraw Funds**: Campaign creators can withdraw funds once the target is reached, ensuring the funds are used as intended.
- **Decentralized Storage**: All campaign data is stored on the Ethereum blockchain, promoting transparency.
- **Database Syncing**: Campaign data is synced from Ethereum to a Postgres database for efficient querying and search functionality.
- **User Authentication**: Sessions are managed using NextAuth for secure authentication.

## Technologies Used

- **Frontend**: 
  - [Next.js](https://nextjs.org/) - React framework for server-side rendering.
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for styling.
- **Backend**:
  - [PostgreSQL](https://www.postgresql.org/) - Relational database for storing synced data.
  - [Prisma](https://www.prisma.io/) - ORM for database querying.
  - [NextAuth](https://next-auth.js.org/) - User authentication and session management.
- **Blockchain**:
  - [Solidity](https://soliditylang.org/) - Smart contract programming language.
  - [ethers.js](https://docs.ethers.io/v5/) - Library for interacting with the Ethereum blockchain.
  - [Hardhat](https://hardhat.org/) - Development environment for deploying and testing smart contracts.

## Getting Started

To set up Block-Trek locally, follow these steps:

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Hardhat](https://hardhat.org/) for local Ethereum environment

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/omerbar97/block-trek.git
   cd block-trek
   ```

2. Install dependencies:
    ```bash
    cd dapp && npm install && cd ../web3-hardhat && npm install
    ```

3. Start local Ethereum Node (leave the bash window open)
     ```bash
     cd web3-hardhat
     npx hardhat node
     ```

4. Deploying the smart contract to the local network
    ```bash
    cd web3-hardhat
    npx hardhat run --network localhost scripts/deploy.ts
    ```

5. Retreive the address output from that commnad:
    ```bash
    // command: npx hardhat run --network localhost scripts/deploy.ts
    CampaignFactory deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
    ```

6. Set up the environment variables
   Create aמ .env file in the dapp/ directory and add the following variables:
    ```bash
    # Google provider
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    
    GOOGLE_CLIENT_ID_PROD=
    GOOGLE_CLIENT_SECRET_PROD=
    
    # Next configures
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=Some secret
    
    # Prisma database
    DATABASE_URL=postgresql://user:pass@localhost:5432/blocktrek
    
    SITE_URL='http://localhost:3000'
    BLOCKCHAIN_URL='http://127.0.0.1:8545/'
    BLOCKCHAIN_CONTRACT_ADDRESS='0x5FbDB2315678afecb367f032d93F642f64180aa3'
    ```

7. Set up the Postgres database:
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

8. Start the development server:
    ```bash
    npm run dev
    ```

The app will be accessible at http://localhost:3000.

## Usage

1. **Creating a Campaign:**
   - Navigate to the "Create Campaign" page.
   - Fill out the form with campaign details, including title, description, target amount, and deadline.
   - Submit the form to create the campaign on the blockchain. The campaign will appear in the list of active campaigns.

2. **Contributing to a Campaign:**
   - Browse the list of existing campaigns on the homepage.
   - Click on a campaign to view its details, including the current amount raised and the funding goal.
   - Enter the amount you wish to contribute and click "Contribute" to fund the campaign.
   - Confirm the transaction using your Ethereum wallet (e.g., MetaMask).

3. **Withdrawing Funds:**
   - Once a campaign reaches its funding goal, the campaign creator can withdraw funds.
   - The "Withdraw" button will be available on the campaign's page.
   - Click "Withdraw" and confirm the transaction in your Ethereum wallet. The funds will be transferred to the creator's address.

4. **Viewing Campaigns:**
   - Campaigns can be filtered by status (e.g., Active, Completed) and sorted by parameters such as the amount raised or deadline.
   - Click on any campaign to view more detailed information, including the list of contributors.

5. **Managing User Accounts:**
   - Sign in using the "Login" button. The platform uses NextAuth for authentication.
   - View your contributions and campaigns by accessing your profile.
   - Log out when you are done using the platform.

## Smart Contract Overview

The smart contracts are written in Solidity and deployed on the Ethereum Sepolia testnet:

- **./web3-hardhat/CampaignFactory.sol**: A factory contract that creates new instances of individual `Campaign` struct. It keeps track of all the campaigns deployed through it.

The contracts ensure that all transactions are securely recorded on the blockchain, providing transparency and trust.


