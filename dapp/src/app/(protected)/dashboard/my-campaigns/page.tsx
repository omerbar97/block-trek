'use client';
import { useWallet } from '@/hooks/wallet.hook'
import axios from 'axios';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const isOwnerAndSessionOkay = async (walletAddress: string) => {
  const result = await axios.get(`/api/owner?walletAddress=${walletAddress}`)
  return result.status === 200
}

const MyCampaignsPage = () => {
  const {walletAddress} = useWallet()
  const {data: session} = useSession()
  const [isWalletSessionOkay, setIsWalletSessionOkay] = useState<Boolean>(false)

  useEffect(() => {
    const handler = async () => {
      if (walletAddress && walletAddress !== "") {
        const res = await isOwnerAndSessionOkay(walletAddress)
        setIsWalletSessionOkay(res)
      }
    }
    handler()
  }, [walletAddress])

  return (
    <main className='mx-auto max-w-2xl p-4 rounded-2xl flex justify-center items-center'>
      {!walletAddress ? <>
        Please connect a wallet
      </> : <>
        {!isWalletSessionOkay ? <>
          The wallet address {walletAddress} is already assign to another user. please change to that user to continue.
        </> : <>
          Okay!
        </>}
      </>}
    </main >
  )
}

export default MyCampaignsPage