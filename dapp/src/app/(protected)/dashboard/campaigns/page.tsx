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
import { Campaign } from '@prisma/client';
import GhostCard from '@/components/campaigns/ghostcard.component';

const getParamsMap = (params: URLSearchParams) => {
  var map: Map<string, string> = new Map();
  map.set("name", params.get("name") ?? "")
  map.set("category", params.get("category") ?? "")
  map.set("experation", params.get("experation") ?? "")
  return map
}

const getIdFromParams = (params: URLSearchParams) => {
  const id = params.get("id") ?? ""
  return id
}

const retrieveCampaignWithFullData = (id: string) => {
  const {response, loading, error, refetch} = useAxiosGet(`/api/campaign/${id}`)
  return {response, loading, error, refetch }
}

const retrieveCampaignsWithFilter = (params: URLSearchParams) => {
  const map = getParamsMap(params)
  const {response, loading, error, refetch} = useAxiosGet(`/api/campaign`, map)
  return {response, loading, error, refetch }
}

const FundCampaignsPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [didUrlChange, setDidUrlChange] = useState<Boolean>(false)
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams);

  const { response, error, loading, refetch } = retrieveCampaignsWithFilter(params);

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch ", error);
      genericToast("Failed to retreive campaigns", "Please try again later");
    } else if (loading) {
      console.log('Loading...');
    } else {
      console.log('Data:', response);
      setCampaigns(response as Campaign[]);
    }
  }, [response, error, loading]);


  useEffect(() => {
    if (didUrlChange) {
      const map = getParamsMap(params)
      refetch(map)
      setDidUrlChange(false)
    }
  }, [didUrlChange])

  const handleCardClick = (id: string) => {
    // Fetching the campaign data
    const {response, loading, error, refetch} = retrieveCampaignWithFullData(id)
    useEffect(() => {
      if (error) {
        console.error("Failed to fetch ", error);
        genericToast("Failed to retreive campaign", "Please try again later");
      } else if (loading) {
        console.log('Loading...');
      } else {
        console.log('Data:', response);
        setSelectedCampaign(response as Campaign);
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
      {/* Your Page Content */}
      <div className='sticky top-0 z-10 flex justify-center bg-slate-900 p-5 rounded-xl mb-2'>
        <Searchbar setDidUrlChange={setDidUrlChange}/>
      </div>
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
        {/* <LoadingCard>
          <LoadingCard />
        </LoadingCard> */}
        <DisplayCampaign campaign={testcampaigns[0]} />
      </Drawer>
    </main>
  );
}

export default FundCampaignsPage