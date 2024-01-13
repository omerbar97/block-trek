import React from 'react'

const StatisticDashboard = () => {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Campaign's Statistics</h2>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-500 p-4 shadow-lg rounded-3xl hover:scale-105">
                    <p className="text-lg font-semibold mb-2">Total Campaigns</p>
                    <p className="text-white">123,123</p>
                </div>

                <div className="bg-slate-500 p-4 shadow-lg rounded-3xl hover:scale-105">
                    <p className="text-lg font-semibold mb-2">Successful Campaigns</p>
                    <p className="text-green-600">85,432</p>
                </div>

                <div className="bg-slate-500 p-4 shadow-lg rounded-3xl hover:scale-105">
                    <p className="text-lg font-semibold mb-2">Ongoing Campaigns</p>
                    <p className="text-yellow-600">23,987</p>
                </div>

                <div className="bg-slate-500 p-4 shadow-lg rounded-3xl hover:scale-105">
                    <p className="text-lg font-semibold mb-2">Failed Campaigns</p>
                    <p className="text-red-600">13,704</p>
                </div>
            </div>
        </div>
    )
}

export default StatisticDashboard