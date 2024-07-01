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
import { donationAmountCannotBeNegativeToast, genericToast } from '@/utils/toast';
import { getEthVal, getPriceInFormat, weiToEthStringFormat } from '@/utils/crypto';
import { Campaign, Contributer, Owner, Reward } from '@prisma/client';
import { SearchBarCategories } from '@/constants/combobox.constant';
// import { WeiPerEther } from 'ethers';
import { requestBlockchainForDonation, requestBlockchainForRefund } from '@/services/crypto/contract';
import axios from 'axios';


interface CampaignCardProps {
    campaign: Campaign;
    owner: Owner;
    contributers: Contributer[];
    rewards: Reward[];
}

function weiToEth(weiString: string): number {
    // Convert the string representation of Wei to a BigInt
    const weiBigInt = BigInt(weiString);
    // Calculate the ETH value using BigInt arithmetic
    const ethValue = Number(weiBigInt) / Number(BigInt(1e18));
    // Return the ETH value as a number
    return ethValue;
}


const DisplayCampaign: React.FC<CampaignCardProps> = ({ campaign, contributers, rewards, owner}) => {
    const isScrollable = contributers.length > 10;
    const isScrollableRewards = rewards.length > 10
    const progress = String((Number(BigInt(campaign.collected)) / Number(BigInt(campaign.goal))) * 100);
    const numberProgress = Number(progress)
    const leftOver = weiToEth(campaign.goal) - weiToEth(campaign.collected)

    const categoryFormat = SearchBarCategories.filter((e) => {
        return e.value === campaign.category
    })[0]

    var image = campaign.image
    if (image === null || image === undefined || image === "") {
        image = "https://via.placeholder.com/300"
    }

    const [donationAmount, setDonationAmount] = useState<number>(0)

    const [ethValue, setEthValue] = useState()
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
            } else if (valGoal > leftOver) {
                genericToast("You cannot donate more then the campaign goal amount", "...")
            }
            else {
                setDonationAmount(parseFloat(val))
            }
        }
    }

    const handleContribute = async () => {
        // Check if the donation amount is a valid number
        if (isNaN(donationAmount) || donationAmount <= 0) {
            genericToast("Invalid Donation Amount!", "Please enter a valid number.", 5);
            return;
        }

        // Convert the donation amount to WEI as a bigint
        const donationAmountWei = BigInt(Math.round(donationAmount * 1e18));

        const isOk = await requestBlockchainForDonation(campaign.uuid, donationAmountWei)
        if (!isOk) {
            genericToast("Failed to Donate!", "Try to check your information...", 5)
            return
        } else {
            // sending api sync to the database
            const requestData = {
                campaignUuid: campaign.uuid,
            }
            const req = await axios.post('/api/contribution', requestData)
            if (req.status !== 200) {
                // Failed to sync data to db
                genericToast("Failed To Sync Contribution To DB", "Sorry, please try again later")
                return
            }
        }
    }

    const handleRefund = async () => {
        const isOk = await requestBlockchainForRefund(campaign.uuid)
        if (!isOk) {
            genericToast("Failed to Donate!", "Try to check your information...", 5)
            return
        }
        // sending api sync to the database
        const requestData = {
            campaignUuid: campaign.uuid,
        }
        const req = await axios.post('/api/contribution', requestData)
        if (req.status !== 200) {
            // Failed to sync data to db
            genericToast("Failed To Sync Contribution To DB", "Sorry, please try again later")
            return
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
            <div className={`w-full h-fit bg-stone-800 shadow-xl p-3 rounded-2xl text-black`}>
                <div className="flex flex-col md:flex-row">
                    <div className="md:flex-shrink-0">
                        <img className="h-48 w-48 object-cover rounded-xl" src={image} alt="Campaign Image" />
                    </div>
                    <table className="text-white m-4 p-2 hover:bg-stone-700 rounded-xl font-semibold uppercase">
                    <tbody>
                        <tr>
                            <td className="pr-2">Campaign Name:</td>
                            <td>{campaign.title}</td>
                        </tr>
                        <tr>
                            <td className="pr-2">Campaign Type:</td>
                            <td>
                                <span className={campaign.type === 'Reward' ? 'text-green-600' : 'text-blue-600'}>{campaign.type}</span>
                            </td>
                        </tr>
                        <tr>
                            <td className="pr-2">Campaign Category:</td>
                            <td>{categoryFormat?.label}</td>
                        </tr>
                        <tr>
                            <td className="pr-2">CAMPAIGN UUID:</td>
                            <td>{campaign.uuid}</td>
                        </tr>
                        <tr>
                            <td className="pr-2">END DATE:</td>
                            <td>{campaign.endAt.toString()}</td>
                        </tr>
                    </tbody>
                </table>

                </div>
                <div className="m-4 flex-row items-center">
                    <div className='hover:bg-stone-700 rounded-xl p-2'>
                        <h3 className='mt-2 text-gray-200 w-fit font-semibold'><u>CAMPAIGN DESCRIPTION</u></h3>
                        <p className="mt-2 text-gray-200 w-fit ">{campaign.description}</p>
                    </div>
                    {(campaign.video ? 
                    <>
                    <div className='hover:bg-stone-700 rounded-xl p-2'>
                        <p className="text-gray-100 font-bold">                    Campaign Video: <u><a href={campaign.video} target="_blank" rel="noopener noreferrer">{campaign.video}</a></u></p>
                    </div></>
                     : 
                     <></>)}
                    <div className="flex flex-col md:flex-row">
                        <span className="text-gray-100 font-bold block md:inline-block mb-2 md:mb-0 md:mr-4">
                            Goal: {weiToEth(campaign.goal)} ETH
                        </span>
                        <span className="text-gray-100 font-bold block md:inline-block">
                            Collected: {weiToEth(campaign.collected)} ETH
                        </span>
                    </div>
                    <span className='block font-bold text-white'>
                        More then {progress}% was collected
                    </span>
                    <Progress value={numberProgress} className='m-2' />
                    <div className='flex items-center space-x-2 w-fit'>
                        <Input onChange={onAmountChange} value={donationAmount} className="text-sm px-2 py-1 rounded-md bg-slate-700 text-white w-1/2 placeholder:text-white" placeholder="Contribute in ETH" type='number' />
                        {walletAddress ?
                            <>
                                <Button variant='default' className='w-1/2' onClick={handleContribute}>Contribute</Button>
                                <Button variant='default' className='w-1/2' onClick={handleRefund}>Refund</Button>
                            </> :
                            <>
                                <Button variant='secondary' disabled={true}>Contribute</Button>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <IoMdInformationCircleOutline color='white'/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Register with your wallet to contribute</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Button variant='secondary' disabled={true}>Refund</Button>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <IoMdInformationCircleOutline color='white'/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Register with your wallet to refund your wallet</p>
                                    </TooltipContent>
                                </Tooltip>
                            </>}
                    </div>
                    <p className='text-sm text-slate-200'>Approximation in USD = <span className='font-bold'>{getPriceInFormat(donationAmount, ethValue)} $</span></p>
                </div>
                {(campaign.type == "Reward" && rewards.length > 0) && <>
                    <p className='text-white font-bold'>Pay attention, this is a Reward Campaign. If you donate by the reward amount you can retreive your reward's from the campaign owner</p>
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
                {(contributers.length > 0) ? 
                <>                
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
                            <div key={index} className={`flex items-center space-x-4 text-sm mb-2 rounded-xl hover:bg-slate-300 ${
                                contributer.isRefunded ? "text-red-500" : ""
                              }`}>
                                <Tooltip>
                                    <TooltipTrigger className='w-2/4 overflow-hidden whitespace-nowrap overflow-ellipsis md:w-1/4'>{contributer.name ?? "Anonymous"}</TooltipTrigger>
                                    <TooltipContent>
                                        <p>{contributer.name ?? "Anonymous"}</p>
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
                                    <TooltipTrigger className='w-1/4 overflow-hidden whitespace-nowrap overflow-ellipsis'>{weiToEthStringFormat(contributer.amount)} ETH</TooltipTrigger>
                                    <TooltipContent>
                                        <p>{weiToEthStringFormat(contributer.amount)} ETH</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Separator orientation="vertical" />
                                <Tooltip>
                                    <TooltipTrigger className='w-2/4 overflow-hidden whitespace-nowrap overflow-ellipsis md:w-1/4'>{new Date(contributer.date).toDateString()}</TooltipTrigger>
                                    <TooltipContent>
                                        <p>{new Date(contributer.date).toDateString()}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Separator orientation="vertical" />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div></>
                 :
                <>
                    <h3 className='text-white m-2 p-2 hover:bg-stone-700 rounded-xl font-semibold uppercase'>No Contributers Yet!</h3>
                </>}
            </div>
        </TooltipProvider>
    );
};

export default DisplayCampaign;
