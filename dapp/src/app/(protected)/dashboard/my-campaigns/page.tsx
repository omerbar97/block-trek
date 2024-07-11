'use client';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { genericToast } from '@/utils/toast';
import { Campaign } from '@prisma/client';
import GhostCard from '@/components/campaigns/ghostcard.component';
import { getAllOwnerCampaignByWalletAddressFromServer, getCampaignFullDataFromServerById } from '@/services/frontend/campaign';
import { useWallet } from '@/hooks/wallet.hook';
import axios from 'axios';
import CardOwnerCampaign from '@/components/campaigns/cardownercampaign.component';
import { requestBlockchainForOwnerFunds } from '@/services/crypto/contract';

const isWalletOwnerAndSessionOkay = async (walletAddress: string) => {
    const result = await axios.get(`/api/owner?walletAddress=${walletAddress}`)
    return result.status === 200
  }

const FundCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null)
  const { walletAddress } = useWallet()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams);
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

  const { response, error, loading, refetch } = getAllOwnerCampaignByWalletAddressFromServer(walletAddress);
  
  useEffect(() => {
    if (error) {
      console.error("Failed to fetch ", error);
      genericToast("Failed to retreive campaigns", "Check that the wallet is connected with a valid session");
    } else if (loading) {
      console.log('Loading...');
    } else {
      console.log('Data:', response);
      setCampaigns(response as Campaign[]);
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
          campaigns?.map((campaign) => (
            <CardOwnerCampaign
              key={campaign.id}
              onClick={async () => {
                const result = await requestBlockchainForOwnerFunds(campaign.uuid)
                if (!result) {
                  genericToast("Failed to get campaign donations from blockchain", "That's a bummer, try again later")
                } else {
                  genericToast("You Got Donations!", "Donation Amount Is " + campaign.collected + " WEI")
                  const requestData = {
                    campaignUuid: campaign.uuid,
                  }
                  // syncing database
                  const req = await axios.post('/api/scan/campaign', requestData)
                }
              }}
              campaign={campaign}
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

export default FundCampaignsPage