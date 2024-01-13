// Import your spinner component if you have one
import Loader from "./loader";


const DimmedOverlay = (loading: boolean) => {
    return (
        <div className={`fixed top-0 left-0 w-full h-full z-50 ${loading ? "bg-black bg-opacity-75" : "hidden"}`}>
            {loading && (
                <div className="flex items-center justify-center h-full">
                    <Loader />
                </div>
            )}
        </div>
    )
}


export default DimmedOverlay;
