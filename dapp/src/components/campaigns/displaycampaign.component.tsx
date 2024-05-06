'use client';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import React, { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from "@/components/ui/progress"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useWallet } from '@/hooks/wallet.hook';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { donationAmountCannotBeNegativeToast } from '@/utils/toast';
import { getEthVal, getPriceInFormat } from '@/utils/crypto';
import { Campaign, Contributer, Owner, Reward } from '@prisma/client';


interface CampaignCardProps {
    campaign: Campaign;
    owner: Owner;
    contributers: Contributer[];
    rewards: Reward[];
}

const DisplayCampaign: React.FC<CampaignCardProps> = ({ campaign, contributers, rewards, owner}) => {
    const isScrollable = contributers.length > 10;
    const isScrollableRewards = rewards.length > 10
    const progress = (campaign.collected / campaign.goal) * 100;

    const [donationAmount, setDonationAmount] = useState<number>(0)
    const [ethValue, setEthValue] = useState()
    const [isLoading, setIsLoading] = useState(true);
    const { walletAddress } = useWallet()

    const updateEthValue = async () => {
        const result = await getEthVal()
        setEthValue(result.data.amount)
    }

    const onAmountChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        var val = e.target.value
        if (val == "") {
            setDonationAmount(0.0)
        } else {
            var valGoal = parseFloat(val)
            if (valGoal < 0) {
                setDonationAmount(0.0)
                donationAmountCannotBeNegativeToast()
            } else {
                setDonationAmount(parseFloat(val))
            }
        }
    }

    useEffect(() => {
        updateEthValue();
        // Set up a setTimeout to periodically check the new value
        const intervalId = setInterval(updateEthValue, 10000); // Check every 5 seconds
        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (
        <TooltipProvider>
            <div className={`w-full h-fit bg-slate-600 shadow-xl p-3 rounded-md text-black`}>
                <div className="flex flex-col md:flex-row">
                    <div className="md:flex-shrink-0">
                        <img className="h-48 w-48 object-cover rounded-xl" src={campaign.image} alt="Campaign Image" />
                    </div>
                    <div className="md:ml-4 text-white mt-4 md:mt-0 md:space-y-2 flex-grow">
                        <div className="uppercase tracking-wide text-sm font-semibold">
                            Campaign Type:{' '}
                            <span className={campaign.type === 'Reward' ? 'text-green-600' : 'text-blue-600'}>{campaign.type}</span>
                        </div>
                        <div className="mb-2">Campaign Address: {campaign.contractAddress}</div>
                        <h3 className="block text-lg leading-tight w-fit font-medium hover:bg-slate-500 rounded-xl">
                            Campaign Name: {campaign.title}
                        </h3>
                        <p className="mt-2 text-gray-300 hover:bg-slate-500 w-fit rounded-xl">{campaign.description}</p>
                    </div>
                </div>
                <div className="m-4 flex-row items-center">
                    <span className="text-gray-300 font-bold block md:inline-block">Goal: ${campaign.goal}</span>
                    <span className="ml-0 mt-2 mb-2 md:ml-4 md:mt-0 text-gray-300 font-bold block md:inline-block">
                        Collected: ${campaign.collected}
                    </span>
                    <span className='block font-bold text-white'>
                        More then {progress}% was collected
                    </span>
                    <Progress value={progress} className='m-2' />
                    <div className='flex items-center space-x-2 w-fit'>
                        <Input onChange={onAmountChange} value={donationAmount} className="text-sm px-2 py-1 rounded-md text-white w-1/2 placeholder:text-white" placeholder="Contribute in ETH" type='number' />
                        {walletAddress ?
                            <>
                                <Button variant='secondary' className='w-1/2'>Contribute</Button>
                            </> :
                            <>
                                <Button variant='secondary' disabled={true}>Contribute</Button>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <IoMdInformationCircleOutline />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Register with your wallet to contribute</p>
                                    </TooltipContent>
                                </Tooltip>
                            </>}
                    </div>
                    <p className='text-sm text-slate-200'>Approximation in USD = <span className='font-bold'>{getPriceInFormat(donationAmount, ethValue)} $</span></p>
                </div>
                {(campaign.type == "Reward") && <>
                    <p className='text-white font-bold'>Pay attention, this is a Reward Campaign. If you donate by the reward amount you can retrive your reward from the campaign owner</p>
                    <p className='text-white'>Owner contact information: <span className='font-bold'>{owner.email}</span></p>
                    <div className="flex mt-5">
                        <ScrollArea className={`w-full bg-slate-200 border rounded-md ${isScrollableRewards ? ` max-h-96 overflow-y-auto` : ``}`} >
                            <div className="p-4">
                                <div className="flex items-center space-x-4 text-sm mb-2">
                                    <div className="text-sm font-medium leading-none w-2/4 md:w-1/4 ml-4">Reward Name</div>
                                    <Separator orientation="vertical" />
                                    <div className="text-sm font-medium leading-none w-2/4 md:w-1/4">Min Amount</div>
                                    <Separator orientation="vertical" />
                                    <div className="text-sm font-medium leading-none w-1/4 md:w-1/4">Prize</div>
                                </div>
                                {rewards.map((Reward, index) => (
                                    <div key={index} className="flex items-center space-x-4 text-sm mb-2 hover:bg-slate-300 rounded-xl">
                                        <Tooltip>
                                            <TooltipTrigger className='w-2/4 overflow-hidden whitespace-nowrap overflow-ellipsis md:w-1/4'>{Reward.name}</TooltipTrigger>
                                            <TooltipContent>
                                                <p>{Reward.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger className='w-2/4 overflow-hidden whitespace-nowrap overflow-ellipsis md:w-1/4'>{Reward.minAmount}</TooltipTrigger>
                                            <TooltipContent>
                                                <p>{Reward.minAmount}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Separator orientation="vertical" />
                                        <Tooltip>
                                            <TooltipTrigger className='w-1/4 overflow-hidden whitespace-nowrap overflow-ellipsis'>{Reward.prize}</TooltipTrigger>
                                            <TooltipContent>
                                                <p>{Reward.prize}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Separator orientation="vertical" />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </>}
                <div className="flex mt-2">
                    <ScrollArea className={`w-full bg-slate-200 border rounded-md ${isScrollable ? ` max-h-96 overflow-y-auto` : ``}`} >
                        <div className="p-4">
                            <div className="flex items-center space-x-4 text-sm mb-2">
                                <div className="text-sm font-medium leading-none w-2/4 md:w-1/4 ml-4">Name</div>
                                <Separator orientation="vertical" />
                                <div className="text-sm font-medium leading-none w-2/4 md:w-1/4">Wallet Address</div>
                                <Separator orientation="vertical" />
                                <div className="text-sm font-medium leading-none w-1/4 md:w-1/4">Amount</div>
                                <Separator orientation="vertical" />
                                <div className="text-sm font-medium leading-none w-2/4 md:w-1/4">Date</div>
                            </div>
                            {contributers.map((contributer, index) => (
                                <div key={index} className="flex items-center space-x-4 text-sm mb-2 hover:bg-slate-300 rounded-xl">
                                    <Tooltip>
                                        <TooltipTrigger className='w-2/4 overflow-hidden whitespace-nowrap overflow-ellipsis md:w-1/4'>{contributer.name}</TooltipTrigger>
                                        <TooltipContent>
                                            <p>{contributer.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger className='w-2/4 overflow-hidden whitespace-nowrap overflow-ellipsis md:w-1/4'>{contributer.walletAddress}</TooltipTrigger>
                                        <TooltipContent>
                                            <p>{contributer.walletAddress}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Separator orientation="vertical" />
                                    <Tooltip>
                                        <TooltipTrigger className='w-1/4 overflow-hidden whitespace-nowrap overflow-ellipsis'>{contributer.amount} ETH</TooltipTrigger>
                                        <TooltipContent>
                                            <p>{contributer.amount} ETH</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Separator orientation="vertical" />
                                    <Tooltip>
                                        <TooltipTrigger className='w-2/4 overflow-hidden whitespace-nowrap overflow-ellipsis md:w-1/4'>{contributer.date.toDateString()}</TooltipTrigger>
                                        <TooltipContent>
                                            <p>{contributer.date.toDateString()}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Separator orientation="vertical" />
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default DisplayCampaign;
