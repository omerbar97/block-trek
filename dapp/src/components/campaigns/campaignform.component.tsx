'use client';
import React, { ChangeEvent, Ref, useEffect, useRef, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useWallet } from '@/hooks/wallet.hook'
import { getEthVal, getPriceInFormat } from '@/utils/crypto'
import { genericToast, goalAmountCannotBeNegativeToast, uploadImageSuccessToast, uploadMaxImageSizeExceedsToast, uploadOnlyImagesToast } from '@/utils/toast'
import TextareaCounter from '../shared/textareacounter.component';
import axios from 'axios';
import { CampaignTypes, SearchBarCategories } from '@/constants/combobox.constant';
import { Combobox } from '../searchbar/combobox.component';
import DatePickerForCreationCampaign from './dateforcreation.component';
import { WeiPerEther } from 'ethers';
import { getCampaignFactoryContract } from '@/services/crypto/contract';
import { getUnixTime } from 'date-fns';
import { formatEtherFromString, pasreEtherFromStringEtherToWEI } from '@/services/crypto/utils';


const CampaignForm = () => {
    const [ethValue, setEthValue] = useState()
    const [goal, setGoal] = useState(0.0)

    const updateEthValue = async () => {
        const result = await getEthVal()
        setEthValue(result.data.amount)
    }

    const [base64Image, setBase64Image] = useState<string | null | ArrayBuffer>(null);
    const [date, setDate] = useState<Date | null>(null)
    const [category, setCategory] = useState<string | null>(null)
    const [type, setType] = useState<string | null>(null)
    const campaignName = useRef<Ref<HTMLInputElement>>()
    const campaignDescription = useRef<Ref<HTMLTextAreaElement>>()
    const campaignVideoLink = useRef<Ref<HTMLInputElement>>()
    const campaignEthAmount = useRef<Ref<HTMLInputElement>>()


    function handleImage(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) {
            event.target.value = ''
            return
        }

        if (!file.type.startsWith('image/')) {
            console.error('Selected file is not an image.');
            uploadOnlyImagesToast()
            event.target.value = ''
            return;
        }

        const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
        if (file.size > maxSizeInBytes) {
          console.error('Selected file exceeds the maximum allowed size (5 MB).');
          uploadMaxImageSizeExceedsToast()
          event.target.value = ''
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          const base64 = reader.result;
          uploadImageSuccessToast()
          setBase64Image(base64);
        };
        reader.onerror = function (error) {
          event.target.value = ''
          console.error('Error reading the file:', error);
        };
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

    const getDataFromRefs = () => {
        const lst = SearchBarCategories.filter((e) => {
            return e.label === category
        })
        var campaignCategory: string
        if (lst.length > 0) {
            campaignCategory = lst[0].value
        } else {
            campaignCategory = "NO_CATEGORY"
        }

        return {
            title: campaignName.current?.value,
            description: campaignDescription.current?.value,
            video: campaignVideoLink.current?.value,
            goal: campaignEthAmount.current?.value,
            category: campaignCategory,
            type: type,
            walletAddress: walletAddress
        }
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // Dummy content
        e.preventDefault()
        if (date === null) {
            genericToast("Please select end date for the campaign", "Campaign cannot last forever..")
            return
        }
        const data = getDataFromRefs()

        if (!walletAddress) {
            genericToast("You must connect a wallet address", "...")
            return
        }

        if (data.goal <= 0) {
            genericToast("Goal amount cannot be 0 or less", "...")
            return
        }

        if(data.category === null) {
            genericToast("Campaign must be categorized", "...")
            return   
        }

        if(data.type === null) {
            genericToast("Campaign must have a type", "...")
            return   
        }

        var goalAsWei: bigint
        goalAsWei = pasreEtherFromStringEtherToWEI(data.goal)
        const bigintAsString = goalAsWei.toString();

        const requestData = {
            ...data,
            image: base64Image ?? "",
            goal: bigintAsString,
            endDate: date,
        };

        const req = await axios.post('/api/campaign', requestData)
        if (req.status !== 200) {
            // Failed to save campaign data to db
            genericToast("Failed to create campaign", "Sorry, please try again later")
            return
        }

        const uuid = req.data.uuid
        const res = await getCampaignFactoryContract(uuid, data.title, data.description, getUnixTime(date), goalAsWei, type ?? "")
        if (res) {
            genericToast("Created campaign succssfully", "Good job mate!")
            return
        }
        genericToast("Failed to create campaign", "That's a bummer")
        const dataToDelete = { campaginUuid: uuid };
        const reqq = await axios.delete('/api/campaign', {data: dataToDelete})
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
                                        <Input ref={campaignName} placeholder='Campaign name' id='campaign_name'></Input>
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
                                <TextareaCounter ref={campaignDescription} description={`Get more attention with a good campaign description! Don't forget to write a few sentences about yourself.`} placeholder='Campaign description' />
                            </div>
                            <div className="col-span-full">
                                <label
                                    htmlFor="cover-photo"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Campaign photo
                                </label>
                                <Input onChange={handleImage} type='file' className='text-black file-input-primary file-input-bordered' ></Input>
                            </div>
                            <div className="w-full">
                                <label
                                    htmlFor="campaign_video"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Campaign Video Link
                                </label>
                                <Input ref={campaignVideoLink} placeholder='Campaign video link' id='campaign_video'></Input>
                            </div>
                            <div className="w-full">
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Campaign Category
                                </label>
                                <Combobox data={SearchBarCategories} value={category} setValue={setCategory} name="Category"/>
                            </div>
                            <div className="w-full">
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Campaign Type
                                </label>
                                <Combobox data={CampaignTypes} value={type} setValue={setType} name="Type"/>
                            </div>
                            <div className="w-full">
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Campaign end date
                                </label>
                                <DatePickerForCreationCampaign date={date} setDate={setDate} />
                                {(date) ? <p className='text-sm font-bold'>Campaign will be ended at {date.toLocaleString()}</p> : null}
                            </div>
                            <div className="w-full">
                                <label
                                    htmlFor="amount"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Campaign Goal Amount in ETH
                                </label>
                                <Input ref={campaignEthAmount} id='amount' className="text-sm px-2 py-1 rounded-md text-black placeholder:text-white" placeholder="Contribute in ETH" onChange={onGoalChange} value={goal} type='number' />
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
                        onClick={handleSubmit}
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