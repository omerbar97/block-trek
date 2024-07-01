import DisplayCampaign from "@/components/campaigns/displaycampaign.component";
import { testcampaigns } from '@/constants/test';


export default function Page({ params }: { params: { id: string } }) {
    // reciving the information of the campaign
    // ...
    return (
        <>
            <div className="max-w-fit justify-center align-center m-auto">
                {/* <DisplayCampaign campaign={testcampaigns[0]} /> */}
            </div>
        </>
    )
}