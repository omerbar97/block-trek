export interface Owner {
    email:string;
    name: string;
    wallet_address: string;
    avatar?: string;
}

export interface Contributer {
    name?: string;
    wallet_address: string;
    amount:string;
    date: Date;
}

export interface Reward {
    name: string;
    min_amount: string;
    prize: string;
    image?: string
}

export interface Campaign {
    contract_address: string;
    owner: Owner;
    title: string;
    description: string;
    image: string;
    video?: string;
    goal: number;
    collected: number;
    type: "Reward" | "Donation" 
    contributers: Contributer[]
    Rewards: Reward[]
}

export interface CampaignCard {
    contract_address: string;
    owner_name: string;
    title: string;
    image: string;
    goal: number;
    collected: number;
}
