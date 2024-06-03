import React from 'react';
import { Button } from '../ui/button';
import { Campaign } from '@prisma/client';

interface CardProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    campaign: Campaign
}

function hasDatePassed(dateToCheck: Date): boolean {
    // Get the current date and time
    const currentDate = new Date();

    // Compare the current date with the date to check
    return currentDate > dateToCheck;
}

function truncateDescription(description: string, maxLength: number): string {
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
    }
    return description;
}


const Card: React.FC<CardProps> = ({ onClick, campaign }: CardProps) => {

    var image = campaign.image
    if (image === null || image === undefined || image === "") {
        image = "https://via.placeholder.com/300"
    }

    
        
    return (
        <div className="card w-80 bg-gray-900 shadow-xl overflow-hidden">
            <figure className="px-10 pt-10">
                <img src={image} alt={campaign.title} className="rounded-xl h-40 w-full object-cover" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title overflow-hidden">{campaign.title}</h2>
                <p className="overflow-hidden">
                    {truncateDescription(campaign.description, 100)}
                </p>                <div className="card-actions">
                    {((hasDatePassed(campaign.endAt) || campaign.isFailed ) ? 
                    <>
                        <Button variant={"destructive"} onClick={onClick}>Campaign Ended</Button>
                    </>
                     : 
                    <>
                        <Button variant={"connected"} onClick={onClick}>Support Now</Button>
                    </>)}
                </div>
            </div>
        </div>
    );
}

export default Card;
