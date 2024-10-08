import WalletCard from '@/components/crypto/walletcard.component'
import StatisticDashboard from '@/components/dashboard/statistic.component'
import React from 'react'

const DashboardPage = () => {

  return (
    <>
      <section className='flex flex-col justify-center items-center m-auto'>
        <div className='flex flex-col md:flex-row lg:flex-row gap-4'>
          <WalletCard />
          <div className='mt-2 left-5 max-w-96 bg-slate-500 h-fit p-5 rounded-3xl hover:scale-105 font-bold'>
            <p>Welcome to your dashboard! Here, you can manage your wallet, explore campaigns, and track your crowdfunding activities.</p>
            <p>Start by:</p>
            <ul className='list-disc list-inside text-white mt-2 font-mono'>
              <li>Connecting your Metamask wallet</li>
              <li>Creating a campaign</li>
              <li>Funding other campaigns</li>
            </ul>
          </div>
        </div>
        {/* Campaign Statistics */}
      </section>
      <section className='flex justify-center items-center'>
        <StatisticDashboard />
      </section>
    </>
  )
}

export default DashboardPage