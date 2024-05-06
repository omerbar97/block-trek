'use client';
import { useWallet } from '@/hooks/wallet.hook'
import { Campaign } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const isWalletOwnerAndSessionOkay = async (walletAddress: string) => {
  const result = await axios.get(`/api/owner?walletAddress=${walletAddress}`)
  return result.status === 200
}

const MyCampaignsPage = () => {
  const {walletAddress} = useWallet()
  const {data: session} = useSession()
  const [isWalletSessionOkay, setIsWalletSessionOkay] = useState<Boolean>(false)
  const [ownerCampaigns, setOwnerCampaigns] = useState<Campaign[] | null>(null)

  useEffect(() => {
    const handler = async () => {
      if (walletAddress && walletAddress !== "") {
        const res = await isWalletOwnerAndSessionOkay(walletAddress)
        setIsWalletSessionOkay(res)
      }
    }
    handler()
  }, [walletAddress])

  return (
    <main className='mx-auto max-w-2xl p-4 rounded-2xl flex justify-center items-center'>
      {!walletAddress ? <div className='bg-slate-800 p-5 rounded-2xl'>
        Please connect to a wallet
      </div> : 
      <div className='bg-slate-800 p-5 rounded-2xl'>
        {!isWalletSessionOkay ? <>
          The wallet address {walletAddress} is already assign to another user. please change to that user to continue.
        </> : 
        <div>
          {/* Adding users campaigns */}
        </div>
        }
      </div>
      }
    </main >
  )
}

export default MyCampaignsPage