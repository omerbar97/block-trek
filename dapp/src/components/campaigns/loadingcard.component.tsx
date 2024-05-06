import React, { ReactNode } from 'react';

type LoadingCardProps = {
    children?: ReactNode;
};

const LoadingCard: React.FC<LoadingCardProps> = ({ children }) => {
    return (
        <div className="w-full bg-gray-700 drop-shadow-md rounded-lg m-5">
            <div className="animate-pulse w-full h-48 bg-gray-500" />
            <div className="p-3 space-y-4">
                <div className="animate-pulse w-2/3 h-6 bg-gray-400" />
                <div className="flex space-x-4">
                    <div className="animate-pulse w-1/3 h-3 bg-gray-200" />
                    <div className="animate-pulse w-1/3 h-3 bg-gray-200" />
                    <div className="animate-pulse w-1/3 h-3 bg-gray-200" />
                    {children}
                </div>
                <div className="flex space-x-4">
                    <div className="animate-pulse w-1/3 h-3 bg-gray-200" />
                    <div className="animate-pulse w-1/3 h-3 bg-gray-200" />
                    {children}
                    {children}
                    {children}
                </div>
                
            </div>
        </div>

    );
}

export default LoadingCard;
