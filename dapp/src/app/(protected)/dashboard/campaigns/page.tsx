'use client';
import DisplayCampaign from '@/components/campaigns/displaycampaign.component';
import Searchbar from '@/components/searchbar/searchbar.component';
import Card from '@/components/shared/card.component'
import Drawer from '@/components/shared/drawer.component'
import LoadingCard from '@/components/shared/loadingcard.component';
import { useSearch } from '@/hooks/searchbar.hook';
import React, { useState } from 'react'

import { testcampaigns } from '@/constants/test';

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
    <div className='mx-16'>
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
    </div>
  );
}

export default FundCampaignsPage