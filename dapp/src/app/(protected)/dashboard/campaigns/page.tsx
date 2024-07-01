'use client';
import DisplayCampaign from '@/components/campaigns/displaycampaign.component';
import Searchbar from '@/components/searchbar/searchbar.component';
import React, { useEffect, useState } from 'react'
import Drawer from '@/components/campaigns/drawer.component';
import Card from '@/components/campaigns/card.component';
import LoadingCard from '@/components/campaigns/loadingcard.component';
import { useRouter, useSearchParams } from 'next/navigation';
import { genericToast } from '@/utils/toast';
import { Campaign } from '@prisma/client';
import GhostCard from '@/components/campaigns/ghostcard.component';
import { IDisplayCampaign } from '@/types/campaign.interface';
import { useAxiosGet } from '@/hooks/useAxios.hook';

const getParamsMap = (params: URLSearchParams) => {
  var map: Map<string, string> = new Map();
  map.set("name", params.get("name") ?? "")
  map.set("category", params.get("category") ?? "")
  map.set("experation", params.get("experation") ?? "")
  return map
}

const retrieveCampaignsWithFilter = (params: URLSearchParams) => {
  const map = getParamsMap(params)
  const {response, loading, error, refetch} = useAxiosGet(`/api/campaign`, map)
  return {response, loading, error, refetch }
}

const retreiveSelectedCampaign = (id: string) => {
  const {response, loading, error, refetch} = useAxiosGet(`/api/campaign/${id}`)
  return {response, loading, error, refetch }
}

const FundCampaignsPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<IDisplayCampaign | null>(null)
  const [isSelectedModelLoading, setIsSelectedModelLoading] = useState<Boolean>(false)
  const [didUrlChange, setDidUrlChange] = useState<Boolean>(false)
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams);
  const router = useRouter();

  const { response, error, loading, refetch } = retrieveCampaignsWithFilter(params);
  const SelectedData = retreiveSelectedCampaign("dummy")

  useEffect(() => {
    // Read the query parameter from the URL
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id');
    if (id) {
      handleCardClick(id);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      console.log('Loading...');
    } else if (error) {
      console.error("Failed to fetch ", error);
      genericToast("Failed to retreive campaigns", "Please try again later");
    } else {
      console.log('Data:', response);
      setCampaigns(response as Campaign[]);
    }
  }, [response, error, loading]);

  useEffect(() => {
    if (SelectedData.error) {
      console.error("Failed to fetch ", SelectedData.error);
      genericToast("Failed to retreive campaign", "Please try again later");
    } else if (SelectedData.loading) {
      setIsSelectedModelLoading(loading)
      console.log('Loading...');
    } else {
      console.log('Data:', SelectedData.response);
      setSelectedCampaign(SelectedData.response as IDisplayCampaign);
      setIsSelectedModelLoading(false)
    }
  }, [SelectedData.response, SelectedData.loading, SelectedData.error])

  useEffect(() => {
    if (didUrlChange) {
      const map = getParamsMap(params)
      refetch(null, map)
      setDidUrlChange(false)
    }
  }, [didUrlChange])

  // const handleCardClick = (id: string) => {
  //   // Fetching the campaign data
  //   if (!drawerOpen) {
  //     SelectedData.refetch(`/api/campaign/${id}`)
  //   }
  //   setDrawerOpen(!drawerOpen);
  // };

  const handleCardClick = (id: string) => {
    // Update the URL with the new query parameter
    router.push(`?id=${id}`, undefined);

    // Fetching the campaign data
    if (!drawerOpen) {
      SelectedData.refetch(`/api/campaign/${id}`);
    }
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    params.delete("id");
    router.push(`?${params.toString()}`, undefined);
    setDrawerOpen(false);
  };

  return (
    <main className='mx-16'>
      {/* Your Page Content */}
      <div className='sticky top-0 z-10 flex justify-center bg-slate-900 p-5 rounded-xl mb-2'>
        <Searchbar setDidUrlChange={setDidUrlChange} didUrlChange={didUrlChange}/>
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
                const params = new URLSearchParams(window.location.search);
                const stringId = `${campaign.id}`
                params.set("id", stringId)
                console.log(params)
                handleCardClick(stringId)
              }}
              campaign={campaign}
            />
          ))
        )}
      </div>
      <Drawer isOpen={drawerOpen} onClose={handleDrawerClose}>
        {(isSelectedModelLoading) ? 
        <>
        <LoadingCard>
          <LoadingCard />
        </LoadingCard>
        </>
         :
        <>
        {(selectedCampaign) ?
         <><DisplayCampaign campaign={selectedCampaign.campaign} owner={selectedCampaign.owner} contributers={selectedCampaign.contributers} rewards={selectedCampaign.rewards} /></>
          :
         <></>}
        </>
        }
      </Drawer>
    </main>
  );
}

export default FundCampaignsPage