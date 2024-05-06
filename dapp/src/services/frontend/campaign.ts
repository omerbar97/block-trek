import { useAxiosGet } from "@/hooks/useAxios.hook"

export const getCampaignFullDataFromServerById = (id: string) => {
    const {response, loading, error, refetch} = useAxiosGet(`/api/campaign/${id}`)
    return {response, loading, error, refetch }
}

export const getCampaignsWithFilterFromServer = (map: Map<string, string>) => {
    const {response, loading, error, refetch} = useAxiosGet(`/api/campaign`, map)
    return {response, loading, error, refetch }
}

export const getAllCampaignsFromServer = () => {
    const {response, loading, error, refetch} = useAxiosGet(`/api/campaign`)
    return {response, loading, error, refetch }
}

export const getAllOwnerCampaignByWalletAddressFromServer = (walletAddress: string | null) => {
    const {response, loading, error, refetch} = useAxiosGet(`/api/owner/campaign?walletAddress=${walletAddress}`)
    return {response, loading, error, refetch }
}