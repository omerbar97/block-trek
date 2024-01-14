import React from 'react'

const StatisticDashboard = () => {

    const statisticSection = (title: string, total: string, color: string) => {
        return (
            <div className="bg-slate-500 p-4 shadow-lg rounded-3xl hover:scale-105 max-w-96">
                <p className="text-lg font-semibold mb-2">{title}</p>
                <p className={`${color} font-bold`}>{total}</p>
            </div>
        )
    }

    return (
        <div className="mt-4 max-w-screen-md w-5/6">
            <h2 className="text-2xl font-bold mb-4">Campaign's Statistics</h2>
            <div className="grid grid-cols-2 gap-6">
                {statisticSection("Total Campaigns", "123,123", "text-white")}
                {statisticSection("Successful Campaigns", "85,432", "text-green-400")}
                {statisticSection("Ongoing Campaigns", "23,987", "text-yellow-600")}
                {statisticSection("Failed Campaigns", "13,704", "text-red-600")}
            </div>
        </div>
    )
}

export default StatisticDashboard