"use client";
import CampaignForm from '@/components/campaigns/campaignform.component';
import { useWallet } from '@/hooks/wallet.hook';
import React from 'react'

const CreateCampaignPage = () => {

  const { walletAddress } = useWallet()

  return (
    <>
    <main className='mx-16'>
      {!walletAddress ? 
        <div className='bg-slate-800 p-5 rounded-2xl'>
        Please connect to a wallet
      </div> : <div className='mx-auto max-w-2xl bg-slate-100 p-4 rounded-2xl flex justify-center items-center'>
        <CampaignForm />      
      </div>}
    </main >
    </>
  )
}

export default CreateCampaignPage