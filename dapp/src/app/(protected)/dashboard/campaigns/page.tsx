'use client';
import DisplayCampaign from '@/components/campaigns/displaycampaign.component';
import Searchbar from '@/components/searchbar/searchbar.component';
import { useSearch } from '@/hooks/searchbar.hook';
import React, { useState } from 'react'

import { testcampaigns } from '@/constants/test';
import Drawer from '@/components/campaigns/drawer.component';
import Card from '@/components/campaigns/card.component';

const FundCampaignsPage = () => {

  const [drawerOpen, setDrawerOpen] = useState(false);
  const { input, experationDate, category } = useSearch()

  const handleCardClick = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <main className='mx-16'>
      {/* Your Page Content */}
      <div className='sticky top-0 z-10 flex justify-center bg-slate-900 p-5 rounded-xl mb-2'>
        <Searchbar />
      </div>
      <div className='justify-center flex flex-wrap gap-4'>
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
        <Card onClick={handleCardClick} />
      </div>

      <Drawer isOpen={drawerOpen} onClose={handleDrawerClose}>
        {/* <LoadingCard>
          <LoadingCard>
          </LoadingCard>
        </LoadingCard> */}
        <DisplayCampaign campaign={testcampaigns[0]}/>
      </Drawer>
    </main>
  );
}

export default FundCampaignsPage