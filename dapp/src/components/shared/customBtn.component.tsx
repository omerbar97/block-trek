import React, { ReactNode, MouseEventHandler } from 'react';

interface CustomBtnProps {
    onclick: MouseEventHandler<HTMLButtonElement>;
    content: ReactNode;
    className?: string;
}

const CustomBtn: React.FC<CustomBtnProps> = ({ onclick, content, className }) => {
    return (
        <button
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full ${className || ''}`}
            onClick={onclick}
        >
            {content}
        </button>
    );
};

export default CustomBtn;
