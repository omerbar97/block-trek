import React from 'react'


const GhostCard = () => {
  return (
    <>
        <div className="card w-80 bg-gray-900 shadow-xl overflow-hidden">
        <div className="animate-pulse px-10 pt-10">
            <div className="bg-gray-800 h-40 w-full rounded-xl"></div>
        </div>
        <div className="card-body items-center text-center">
            <h2 className="card-title animate-pulse h-8 w-40 bg-gray-800 rounded-full mt-4"></h2>
            <p className="animate-pulse h-5 w-60 bg-gray-800 rounded-full mt-2"></p>
            <div className="card-actions">
                {/* <Button variant={"connected"} disabled={true}>Loading...</Button> */}
            </div>
        </div>
    </div>
    </>
  )
}

export default GhostCard