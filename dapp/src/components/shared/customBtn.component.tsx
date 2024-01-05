import React, { ReactNode, MouseEventHandler } from 'react';

interface CustomBtnProps {
    onclick: MouseEventHandler<HTMLButtonElement>;
    content: ReactNode;
    className?: string;
    image?: string;
}

const CustomBtn: React.FC<CustomBtnProps> = ({ onclick, content, className, image }) => {
    return (
        <button
            className={`bg-gradient-to-r from-gray-600 to-gray-800 hover:bg-gradient-to-l text-white font-bold py-2 px-4 rounded-full ${className || ''}`}
            onClick={onclick}
        >
            <div className='flex gap-2 items-center'>
                {image ?
                    <img className="w-10 h-10 rounded-full" src={image} alt="Rounded avatar" /> :
                    <></>}
                {content}
            </div>

        </button>
    );
};

export default CustomBtn;
