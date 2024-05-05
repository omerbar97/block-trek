'use client';
import DisplayCampaign from '@/components/campaigns/displaycampaign.component';
import Searchbar from '@/components/searchbar/searchbar.component';
import { useSearch } from '@/hooks/searchbar.hook';
import React, { useEffect, useState } from 'react'


import { testcampaigns } from '@/constants/test';
import Drawer from '@/components/campaigns/drawer.component';
import Card from '@/components/campaigns/card.component';
import LoadingCard from '@/components/campaigns/loadingcard.component';
import { useAxiosGet } from '@/hooks/useAxios.hook';
import { useSearchParams } from 'next/navigation';
import { genericToast } from '@/utils/toast';


const retrieveCampaignsWithFilter = async (params: URLSearchParams) => {
  var map: Map<string, string> = new Map();
  map.set("name", params.get("name") ?? "")
  map.set("category", params.get("category") ?? "")
  map.set("experation", params.get("experation") ?? "")

  const {response, loading, error, refetch} = await useAxiosGet(`/api/campaign`, map)
  return {response, loading, error, refetch }
}

const FundCampaignsPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([])
  const [load, setLoad] = useState(true)
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams);
  
  const handleSearchLogic = async () => {
    const {response, loading, error, refetch} = await retrieveCampaignsWithFilter(params)
    if (error) {
      genericToast("Failed to retreive campaigns", error)
      return
    }
    setCampaigns(response)

  }

  useEffect(() => {
    handleSearchLogic()
  }, [])

  useEffect(() => {
    handleSearchLogic()
  }, [])

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
        <Card
          onClick={handleCardClick}
          title="Campaign 1"
          description="Help us raise funds for our new community center project."
          imageUrl="https://via.placeholder.com/300"
        />
        <Card
          onClick={handleCardClick}
          title="Campaign 1d kasmd askd askd akmkamdk kasd"
          description="Help us raskdmas mksdm kasm kasdm kasmd kasm kmaskdm askdmksa mkm kasmd ksamaise funds for our new community center project."
          imageUrl="https://via.placeholder.com/300"
        />

        <Card
          onClick={handleCardClick}
          title="Campaign 1"
          description="Help us raise funds for our new community center project."
          imageUrl="https://via.placeholder.com/300"
        />
        <Card
          onClick={handleCardClick}
          title="Campaign 1d kasmd askd askd akmkamdk kasd"
          description="Help us raskdmas mksdm kasm kasdm kasmd kasm kmaskdm askdmksa mkm kasmd ksamaise funds for our new community center project."
          imageUrl="https://via.placeholder.com/300"
        />
        <Card
          onClick={handleCardClick}
          title="Campaign 1"
          description="Help us raise funds for our new community center project."
          imageUrl="https://via.placeholder.com/300"
        />
        <Card
          onClick={handleCardClick}
          title="Campaign 1d kasmd askd askd akmkamdk kasd"
          description="Help us raskdmas mksdm kasm kasdm kasmd kasm kmaskdm askdmksa mkm kasmd ksamaise funds for our new community center project."
          imageUrl="https://via.placeholder.com/300"
        />
        <Card
          onClick={handleCardClick}
          title="Campaign 1"
          description="Help us raise funds for our new community center project."
          imageUrl="https://via.placeholder.com/300"
        />
        <Card
          onClick={handleCardClick}
          title="Campaign 1d kasmd askd askd akmkamdk kasd"
          description="Help us raskdmas mksdm kasm kasdm kasmd kasm kmaskdm askdmksa mkm kasmd ksamaise funds for our new community center project."
          imageUrl="https://via.placeholder.com/300"
        />
      </div>

      <Drawer isOpen={drawerOpen} onClose={handleDrawerClose}>
        {/* <LoadingCard>
          <LoadingCard />
        </LoadingCard> */}
        <DisplayCampaign campaign={testcampaigns[0]} />
      </Drawer>
    </main>
  );
}

export default FundCampaignsPage