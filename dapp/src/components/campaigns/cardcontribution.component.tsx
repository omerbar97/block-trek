import React from 'react';
import { Button } from '../ui/button';
import { Campaign } from '@prisma/client';
import { Progress } from '@radix-ui/react-progress';
import { wetToEthBigIntFormat } from '@/utils/crypto';

interface CardProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    campaign: Campaign
    amount: BigInt
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


const CardContribution: React.FC<CardProps> = ({ onClick, campaign, amount }: CardProps) => {

    var image = campaign.image
    if (image === null || image === undefined || image === "") {
        image = "https://via.placeholder.com/300"
    }

    const progress = String((Number(BigInt(campaign.collected)) / Number(BigInt(campaign.goal))) * 100);
    const numberProgress = Number(progress)

    return (
        <div className="card w-80 bg-gray-900 shadow-xl overflow-hidden">
            <figure className="px-10 pt-10">
                <img src={image} alt={campaign.title} className="rounded-xl h-40 w-full object-cover" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title overflow-hidden">{campaign.title}</h2>
                <p className="overflow-hidden">
                    {truncateDescription(campaign.description, 100)}
                </p>                
                <span className='block font-bold text-white'>
                        More then {progress}% was collected
                </span>
                <Progress value={numberProgress} className='m-2' />
                <span className='block font-bold text-white'>
                        You donated: {wetToEthBigIntFormat(amount)} ETH
                </span>
                <div className="card-actions justify-center">
                    {(campaign.isFailed ? 
                    <>
                        <Button variant={"destructive"}>Campaign Ended</Button>
                    </>
                     : 
                    <>
                        <Button variant={"connected"}>{(campaign.isFinished ? "Camapaign Finished" : "On Going Campaign...")}</Button>
                    </>)}
                    {(!campaign.isOwnerRetrievedDonations ? 
                    <>
                        <Button variant={"default"} onClick={onClick}>Retreive Donation!</Button>
                    </> 
                    :
                    <>
                        <Button variant="default" disabled={true}>Retreive Donation!</Button>
                    </>)}
                </div>
            </div>
        </div>
    );
}

export default CardContribution;
