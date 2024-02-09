import React from 'react';
import { Button } from '../ui/button';

interface CardProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    title: string;
    description: string;
    imageUrl: string;
}

const Card: React.FC<CardProps> = ({ onClick, title, description, imageUrl }) => {
    return (
        <div className="card w-80 bg-gray-900 shadow-xl overflow-hidden">
            <figure className="px-10 pt-10">
                <img src={imageUrl} alt={title} className="rounded-xl h-40 w-full object-cover" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title overflow-hidden">{title}</h2>
                <p className="overflow-hidden">{description}</p>
                <div className="card-actions">
                    <Button variant={"connected"} onClick={onClick}>Support Now</Button>
                </div>
            </div>
        </div>
    );
}

export default Card;
