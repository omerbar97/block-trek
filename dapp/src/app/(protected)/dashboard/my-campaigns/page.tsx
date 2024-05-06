'use client';
import DisplayCampaign from '@/components/campaigns/displaycampaign.component';
import React, { useEffect, useState } from 'react'
import Drawer from '@/components/campaigns/drawer.component';
import Card from '@/components/campaigns/card.component';
import { useSearchParams } from 'next/navigation';
import { genericToast } from '@/utils/toast';
import { Campaign } from '@prisma/client';
import GhostCard from '@/components/campaigns/ghostcard.component';
import { getAllOwnerCampaignByWalletAddressFromServer, getCampaignFullDataFromServerById } from '@/services/frontend/campaign';
import { useWallet } from '@/hooks/wallet.hook';
import axios from 'axios';
import { IDisplayCampaign } from '@/types/campaign.interface';
import LoadingCard from '@/components/campaigns/loadingcard.component';

const isWalletOwnerAndSessionOkay = async (walletAddress: string) => {
    const result = await axios.get(`/api/owner?walletAddress=${walletAddress}`)
    return result.status === 200
  }

const FundCampaignsPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<IDisplayCampaign | null>(null)
  const [isSelectedModelLoading, setIsSelectedModelLoading] = useState<Boolean>(false)
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


  const handleCardClick = (id: string) => {
    // Fetching the campaign data
    const {response, loading, error, refetch} = getCampaignFullDataFromServerById(id)
    useEffect(() => {
      if (error) {
        console.error("Failed to fetch ", error);
        genericToast("Failed to retreive campaign", "Please try again later");
      } else if (loading) {
        setIsSelectedModelLoading(loading)
        console.log('Loading...');
      } else {
        console.log('Data:', response);
        setSelectedCampaign(response as IDisplayCampaign);
        setIsSelectedModelLoading(false)
      }
    }, [response, loading, error])
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    params.delete("id")
    setDrawerOpen(false);
  };

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
            <Card
              key={campaign.id}
              onClick={() => {
                const stringId = `${campaign.id}`
                params.set("id", stringId)
                handleCardClick(stringId)
              }}
              campaign={campaign}
            />
          ))
        )}
      </div>

      <Drawer isOpen={drawerOpen} onClose={handleDrawerClose}>
        {(isSelectedModelLoading) ? 
        <>
        <LoadingCard>
          <LoadingCard />
        </LoadingCard>
        </>
         :
        <>
        {(selectedCampaign) ?
         <><DisplayCampaign campaign={selectedCampaign.campaign} owner={selectedCampaign.owner} contributers={selectedCampaign.contributers} rewards={selectedCampaign.rewards} /></>
          :
         <></>}
        </>
        }
      </Drawer>
        </div>
        }
      </div>
      }
      
    </main>
  );
}

export default FundCampaignsPage