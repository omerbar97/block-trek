'use client';
import Searchbar from '@/components/searchbar/searchbar.component';
import Card from '@/components/shared/card.component'
import Drawer from '@/components/shared/drawer.component'
import LoadingCard from '@/components/shared/loadingcard.component';
import { useSearch } from '@/hooks/searchbar.hook';
import React, { useState } from 'react'

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
        <div className='flex justify-center bg-slate-800 p-5 rounded-2xl z-10'>
          <Searchbar />
        </div>
        <div className='justify-center flex flex-wrap gap-3'>
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
          <LoadingCard>
            <LoadingCard>
            </LoadingCard>
          </LoadingCard>
        </Drawer>
      </div>
  );
}

export default FundCampaignsPage