import React, { ReactNode, useState } from 'react';

type DrawerProps = {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
};

const Drawer: React.FC<DrawerProps> = ({ children, isOpen, onClose }) => {
    return (
        (isOpen ? <>
            <div className='drawer drawer-end z-20'>
                <input
                    id="my-drawer-1"
                    type="checkbox"
                    className="drawer-toggle"
                    checked={isOpen}
                    onChange={onClose}
                />
                <div className="drawer-side">
                    <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="menu p-4 w-5/6 sm:w-5/6 md:w-4/5 lg:sm:w-1/2 min-h-full bg-slate-500 rounded-md text-base-content">
                        <label htmlFor="my-drawer-1" className="cursor-pointer mr-4" onClick={onClose}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </label>
                        {children}
                    </div>
                </div>
            </div>

        </> : <></>)

    );
}

export default Drawer;
