import React from 'react';

const GameOver = () => {
    const navigate = (path) => {
        window.location.href = path;
    };

    const navigateToGame = () => {
        navigate('/game');
    };


    return (
        <div className="h-screen absolute w-full bg-cover bg-center" style={{ backgroundImage: "url('/images/golden-empire-slot.jpg')" }}>
            <div className="flex items-center justify-center h-full bg-black bg-opacity-80">
                <div className='relative gap-10 flex flex-col items-center'>
                <button
                    onClick={navigateToGame}
                    className="px-8 mx-auto py-4 bg-yellow-500 text-white text-xl font-bold rounded hover:bg-yellow-600 transition duration-300"
                >
                    Play Again
                </button>
                </div>
            </div>
        </div>
    );
};

export default GameOver;