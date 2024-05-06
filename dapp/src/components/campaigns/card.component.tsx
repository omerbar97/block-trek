import React from 'react';
import { Button } from '../ui/button';
import { Campaign } from '@prisma/client';

interface CardProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    campaign: Campaign
}

const Card: React.FC<CardProps> = ({ onClick, campaign }: CardProps) => {
    return (
        <div className="card w-80 bg-gray-900 shadow-xl overflow-hidden">
            <figure className="px-10 pt-10">
                <img src={campaign.image ?? "https://via.placeholder.com/300"} alt={campaign.title} className="rounded-xl h-40 w-full object-cover" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title overflow-hidden">{campaign.title}</h2>
                <p className="overflow-hidden">{campaign.description}</p>
                <div className="card-actions">
                    <Button variant={"connected"} onClick={onClick}>Support Now</Button>
                </div>
            </div>
        </div>
    );
}

export default Card;
