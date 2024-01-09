'use client';
import Card from '@/components/shared/card.component'
import Drawer from '@/components/shared/drawer.component'
import LoadingCard from '@/components/shared/loadingcard.component';
import React, { useState } from 'react'

const FundCampaignsPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleCardClick = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // Function to retrive all campaigns

  return (
    <div>
      {/* Your Page Content */}
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

      {/* Reusable Drawer Component */}
      <Drawer isOpen={drawerOpen} onClose={handleDrawerClose}>
        {/* Dynamic Content */}
        {/* Pass data or components as children */}
        <LoadingCard>
          <LoadingCard>
          </LoadingCard>
        </LoadingCard>
      </Drawer>
    </div>
  );
}

export default FundCampaignsPage