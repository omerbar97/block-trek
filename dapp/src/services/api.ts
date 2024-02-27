import { useGet } from "@/hooks/usefetch.hook";

export async function getAllCampaigns() {
    return await useGet('/api/campaign')
}