'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip';
import { useWallet } from '@/hooks/wallet.hook';
import { getEthVal } from '@/utils/crypto';
import { goalAmountCannotBeNegative } from '@/utils/toast';
import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'


const CreateCampaignPage = () => {

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
        goalAmountCannotBeNegative()
      } else {
        setGoal(parseFloat(val))
      }
    }
  }

  const getPrice = () => {
    if (goal && ethValue) {
      const result = goal * ethValue;
      // Convert the result to a number and format with commas
      const formattedResult = Number(result.toFixed(4)).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
      });

      return formattedResult;
    } else {
      return "0.0";
    }
  };



  useEffect(() => {
    updateEthValue();

    // Set up a setTimeout to periodically check the new value
    const intervalId = setInterval(updateEthValue, 10000); // Check every 5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);


  const form = useForm()

  const onSubmit = () => {

  }

  const { walletAddress } = useWallet()

  // contract_address: string;
  // owner: Owner;
  // title: string;
  // description: string;
  // image: string;
  // video?: string;
  // goal: number;
  // collected: number;
  // type: "Reward" | "Donation" 
  // contributers: Contributer[]
  // Rewards: Reward[]

  return (
    <TooltipProvider>
      <main className='mx-auto max-w-2xl bg-slate-100 p-4 rounded-2xl flex justify-center items-center'>
        <form>
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
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Campaign Owner Wallet Address
                      </label>

                      <Tooltip>
                        <TooltipTrigger>
                          <Input disabled={true} placeholder={walletAddress ? walletAddress : "Connect your wallet to procedure"}></Input>
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
                  <label
                    htmlFor="campaign_description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Get more attention with a good campaign description! Don't forget to write a few sentences about yourself.
                    <Textarea placeholder='Campaign description' id='campaign_description' className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'></Textarea>
                  </label>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Campaign photo
                  </label>
                  <Input type='file' className='text-black file-input-primary file-input-bordered' ></Input>
                  {/* <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div> */}
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
                  <p className='text-sm font-bold'>Approximation in USD =  {getPrice()} $</p>
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
            >
              Create Campaign
            </Button>
          </div>
        </form>

      </main >
    </TooltipProvider>
  )
}

export default CreateCampaignPage