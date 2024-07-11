"use client";
import CardContribution from '@/components/campaigns/cardcontribution.component';
import GhostCard from '@/components/campaigns/ghostcard.component';
import { useWallet } from '@/hooks/wallet.hook';
import { bigintToString } from '@/services/controller/scan/campaign.scan';
import { requestBlockchainForRefund } from '@/services/crypto/contract';
import { getAllContributionCampaignsByWalletAddress } from '@/services/frontend/campaign';
import { genericToast } from '@/utils/toast';
import { Campaign } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface CampaignsContributions {
  campaigns: Campaign[],
  amounts: BigInt[]
}

const isWalletOwnerAndSessionOkay = async (walletAddress: string) => {
  const result = await axios.get(`/api/owner?walletAddress=${walletAddress}`)
  return result.status === 200
}

const MyDonationsPage = () => {
  
  // const [data, setData] = useState<CampaignsContributions | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]| null>(null)
  const [amounts, setAmounts] = useState<BigInt[]| null>(null)

  const { walletAddress } = useWallet()
  const [isWalletSessionOkay, setIsWalletSessionOkay] = useState<Boolean>(false)

  useEffect(() => {
    const handler = async () => {
      if (walletAddress && walletAddress !== "") {
        const res = await isWalletOwnerAndSessionOkay(walletAddress)
        setIsWalletSessionOkay(res)
      }
    }
    handler()
  }, [walletAddress])

  const { response, error, loading, refetch } = getAllContributionCampaignsByWalletAddress(walletAddress);
  
  useEffect(() => {
    if (error) {
      console.error("Failed to fetch ", error);
      genericToast("Failed to retreive contribution", "Check that the wallet is connected with a valid session");
    } else if (loading) {
      console.log('Loading...');
    } else {
      console.log('Data:', response);
      const result = response as CampaignsContributions
      setCampaigns(result.campaigns)
      setAmounts(result.amounts)
    }
  }, [walletAddress, response, error, loading]);


  return (
    <main className='mx-16'>
        {!walletAddress ? 
        <div className='bg-slate-800 p-5 rounded-2xl'>
        Please connect to a wallet
      </div> : 
      <div>
        {!isWalletSessionOkay ? <div className='bg-slate-800 p-5 rounded-2xl'>
          The wallet address {walletAddress} is already assign to another user. please change to that user to continue.
        </div> : 
        <div>
          <div className='justify-center flex flex-wrap gap-4'>
      {loading ? (
          // Render loading state
          Array.from({ length: 9 }).map((_, index) => <GhostCard key={index} />)
        ) : (
          // Render campaign cards if not loading
          campaigns?.map((campaign, index) => (
            <CardContribution
              key={campaign.id}
              onClick={async () => {
                const result = await requestBlockchainForRefund(campaign.uuid)
                if (!result) {
                  genericToast("Failed to get refund from blockchain", "That's a bummer, try again later")
                } else {
                  genericToast("You Got A Refund!", "Refund Amount Is " + (amounts ? amounts[index].toString() : "NaN") + " WEI")
                  const requestData = {
                    campaignUuid: campaign.uuid,
                  }
                  // syncing database
                  const req = await axios.post('/api/contribution', requestData)
                }
              }}
              campaign={campaign}
              amount={amounts ? amounts[index] : BigInt(NaN)}
            />
          ))
        )}
      </div>
        </div>
        }
      </div>
      }
    </main>
  );
}

export default MyDonationsPage