import { Campaign } from '@/types/campaign.interface';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import React from 'react';
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


interface CampaignCardProps {
    campaign: Campaign;
}

const DisplayCampaign: React.FC<CampaignCardProps> = ({ campaign }) => {
    const isScrollable = campaign.contributers.length > 10;
    const progress = (campaign.collected / campaign.goal) * 100;

    const { walletAddress } = useWallet()

    return (
        <TooltipProvider>
            <div className="w-full h-fit bg-slate-600 shadow-xl p-3 rounded-md">
                <div className="flex flex-col md:flex-row">
                    <div className="md:flex-shrink-0">
                        <img className="h-48 w-48 object-cover rounded-xl" src={campaign.image} alt="Campaign Image" />
                    </div>
                    <div className="md:ml-4 text-white mt-4 md:mt-0 md:space-y-2 flex-grow">
                        <div className="uppercase tracking-wide text-sm font-semibold">
                            Campaign Type:{' '}
                            <span className={campaign.type === 'Reward' ? 'text-green-600' : 'text-blue-600'}>{campaign.type}</span>
                        </div>
                        <div className="mb-2">Campaign Address: {campaign.contract_address}</div>
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
                        <Input className="text-sm px-2 py-1 rounded-md text-white w-1/2 placeholder:text-white" placeholder="Contribute in ETH" type='number' />
                        {walletAddress ?
                            <>
                                <Button variant='secondary' className='w-1/2'>Contribute</Button>
                            </> :
                            <>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button variant='secondary' disabled={true}>Contribute</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Register with your wallet to contribute</p>
                                    </TooltipContent>
                                </Tooltip>
                            </>}
                    </div>
                </div>
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
                            {campaign.contributers.map((contributer, index) => (
                                <div key={index} className="flex items-center space-x-4 text-sm mb-2 hover:bg-slate-300 rounded-xl">
                                    <Tooltip>
                                        <TooltipTrigger className='w-2/4 overflow-hidden whitespace-nowrap overflow-ellipsis md:w-1/4'>{contributer.name}</TooltipTrigger>
                                        <TooltipContent>
                                            <p>{contributer.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger className='w-2/4 overflow-hidden whitespace-nowrap overflow-ellipsis md:w-1/4'>{contributer.wallet_address}</TooltipTrigger>
                                        <TooltipContent>
                                            <p>{contributer.wallet_address}</p>
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
