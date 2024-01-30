import React from 'react';

interface CardProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Card: React.FC<CardProps> = ({ onClick }) => {
    return (
        <div className="card w-80 bg-gray-900 shadow-xl overflow-hidden">
            <figure className="px-10 pt-10">
                <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title overflow-hidden">Shoes!</h2>
                <p className="overflow-hidden">If a dog chews shoes</p>
                <div className="card-actions">
                    <button className="btn btn-primary" onClick={onClick}>Buy Now</button>
                </div>
            </div>
        </div>
    );
}

export default Card;
