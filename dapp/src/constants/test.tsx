import { Owner, Campaign, Contributer } from "@/types/campaign.interface";

const owner: Owner = {
    email: 'owner@example.com',
    name: 'John Doe',
    wallet_address: '0x1234567890abcdef',
    avatar: 'path/to/avatar.jpg',
};

function generateRandomContributors(numContributors: number): Contributer[] {
    const contributors: Contributer[] = [];
  
    for (let i = 0; i < numContributors; i++) {
      const randomAmount = Math.floor(Math.random() * 1000) + 1; // Random amount between 1 and 1000
      const randomDate = new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)); // Random date within the last ~3 months
  
      const contributor: Contributer = {
        name: `Contributor ${i + 1}`,
        wallet_address: `0x${Math.random().toString(16).substr(2, 10)}`, // Random wallet address
        amount: randomAmount.toString(),
        date: randomDate,
      };
  
      contributors.push(contributor);
    }
  
    return contributors;
  }

const contributerss = generateRandomContributors(20)
export const testcampaigns: Campaign[] = [
    {
        contract_address: '0xabcdef1234567890',
        owner: owner,
        title: 'Campaign 1',
        description: 'Description for Campaign 1',
        image: 'https://picsum.photos/200',
        goal: 1000,
        collected: 500,
        type: 'Reward',
        contributers: contributerss,
        Rewards:[{
          min_amount: "10 ETH",
          name: "Ty Very much!",
          prize: "Wall of fame"
        }, 
        {
          min_amount: "20 ETH",
          name: "Ty Very much!",
          prize: "Wall of fame"
        },
        {
          min_amount: "30 ETH",
          name: "Ty Very much!",
          prize: "Wall of fame"
        },
        {
          min_amount: "40 ETH",
          name: "Ty Very much!",
          prize: "Wall of fame"
        }]
    },
    {
        contract_address: '0x9876543210abcdef',
        owner: owner,
        title: 'Campaign 2',
        description: 'Description for Campaign 2',
        image: 'https://picsum.photos/200/300',
        goal: 2000,
        collected: 800,
        type: 'Donation',
        contributers: contributerss,
        Rewards:[]
    },
];