import React from 'react'


// Real card
{/* <div className="card w-80 bg-gray-900 shadow-xl overflow-hidden">
<figure className="px-10 pt-10">
    <img src={campaign.image ?? "https://via.placeholder.com/300"} alt={campaign.title} className="rounded-xl h-40 w-full object-cover" />
</figure>
<div className="card-body items-center text-center">
    <h2 className="card-title overflow-hidden">{campaign.title}</h2>
    <p className="overflow-hidden">{campaign.description}</p>
    <div className="card-actions">
        <Button variant={"connected"} onClick={onClick}>Support Now</Button>
    </div>
</div>
</div> */}


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