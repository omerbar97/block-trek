"use client";
import { getDashboardStatisticalInformation } from '@/services/frontend/campaign';
import { genericToast } from '@/utils/toast';
import React, { useEffect, useState } from 'react'

interface IStatisticDashboard {
    total: number,
    ongoing: number,
    failed: number,
    succssfully: number,
}

const StatisticDashboard = () => {

    const [info, setInfo] = useState<IStatisticDashboard | null>(null)

    const statisticSection = (title: string, total: number, color: string) => {
        return (
            <div className="bg-slate-500 p-4 shadow-lg rounded-3xl hover:scale-105 max-w-96">
                <p className="text-lg font-semibold mb-2">{title}</p>
                <p className={`${color} font-bold`}>{total}</p>
            </div>
        )
    }
    const { response, error, loading, refetch } = getDashboardStatisticalInformation();
    useEffect(() => {
      if (loading) {
        console.log('Loading...');
      } else if (error) {
        console.error("Failed to fetch ", error);
        genericToast("Failed to retreive dashboard information", "Please try again later");
      } else {
        console.log('Data:', response);
        setInfo(response as IStatisticDashboard);
      }
    }, [response, error, loading]);

    return (
        <div className="mt-4 max-w-screen-md w-5/6">
            <h2 className="text-2xl font-bold mb-4">Campaign's Statistics</h2>
            <div className="grid grid-cols-2 gap-6">
                {statisticSection("Total Campaigns", info?.total ?? 0, "text-white")}
                {statisticSection("Successful Campaigns", info?.succssfully ?? 0, "text-green-400")}
                {statisticSection("Ongoing Campaigns", info?.ongoing ?? 0, "text-yellow-600")}
                {statisticSection("Failed Campaigns", info?.failed ?? 0, "text-red-600")}
            </div>
        </div>
    )
}

export default StatisticDashboard