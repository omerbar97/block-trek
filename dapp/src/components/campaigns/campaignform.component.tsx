'use client';
import React, { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useWallet } from '@/hooks/wallet.hook'
import { getEthVal, getPriceInFormat } from '@/utils/crypto'
import { goalAmountCannotBeNegativeToast } from '@/utils/toast'
import TextareaCounter from '../shared/textareacounter.component';

const CampaignForm = () => {

    const [ethValue, setEthValue] = useState()
    const [goal, setGoal] = useState(0.0)

    const updateEthValue = async () => {
        const result = await getEthVal()
        setEthValue(result.data.amount)
    }

    const onGoalChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        var val = e.target.value
        if (val == "") {
            setGoal(0.0)
        } else {
            var valGoal = parseFloat(val)
            if (valGoal < 0) {
                setGoal(0.0)
                goalAmountCannotBeNegativeToast()
            } else {
                setGoal(parseFloat(val))
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



    const { walletAddress } = useWallet()

    return (
        <form>
            <TooltipProvider>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Create Campaign
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            This information will be displayed publicly so be careful what you
                            are funding for.
                        </p>
                        <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 text-gray-900">
                            <div className='grid grid-rows-1 w-full'>
                                <div className="flex space-x-2">
                                    <div className="w-1/2">
                                        <label
                                            htmlFor="campaign_name"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Campaign Name
                                        </label>
                                        <Input placeholder='Campaign name' id='campaign_name'></Input>
                                    </div>

                                    <div className="w-1/2">
                                        <label
                                            htmlFor="campaign_address"
                                            className="block text-sm font-medium leading-6 text-black"
                                        >
                                            Campaign Owner Wallet Address
                                        </label>

                                        <Tooltip>
                                            <TooltipTrigger onClick={(e) => e.preventDefault()}>
                                                <Input disabled={true} onClick={(e) => e.preventDefault()} className='text-black disabled:text-black' placeholder={walletAddress ? walletAddress : "Connect your wallet to procedure"}></Input>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {(walletAddress) ?
                                                    <>
                                                        <p className='bg-white rounded-2xl p-1 text-slate-800 font-light'>{walletAddress}</p>
                                                    </>
                                                    :
                                                    <>
                                                        <p className='bg-white rounded-2xl p-1 text-slate-800 font-light'>Register with your wallet to continue</p>
                                                    </>}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full">
                                <TextareaCounter description={`Get more attention with a good campaign description! Don't forget to write a few sentences about yourself.`} placeholder='Campaign description' />
                            </div>
                            <div className="col-span-full">
                                <label
                                    htmlFor="cover-photo"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Campaign photo
                                </label>
                                <Input type='file' className='text-black file-input-primary file-input-bordered' ></Input>
                            </div>
                            <div className="w-full">
                                <label
                                    htmlFor="campaign_video"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Campaign Video Link
                                </label>
                                <Input placeholder='Campaign video link' id='campaign_video'></Input>
                            </div>
                            <div className="w-full">
                                <label
                                    htmlFor="campaign_video"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Campaign Goal Amount in ETH
                                </label>
                                <Input className="text-sm px-2 py-1 rounded-md text-black placeholder:text-white" placeholder="Contribute in ETH" onChange={onGoalChange} value={goal} type='number' />
                                <p className='text-sm font-bold'>Approximation in USD =  {getPriceInFormat(goal, ethValue)} $</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button
                        type="button"
                        variant='default'
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant='outline'
                        disabled={walletAddress ? false : true}
                    >
                        Create Campaign
                    </Button>
                </div>
            </TooltipProvider>
        </form>
    )
}

export default CampaignForm