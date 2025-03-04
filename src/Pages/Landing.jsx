import React from 'react';
import { onClickPlay } from "../Utiils/soundManager";

const Landing = () => {
    const navigate = (path) => {
        window.location.href = path;
    };

    const navigateToGame = () => {
        // on clicking the start button, play the background music
        onClickPlay.play(); 
                // Navigate to the game page after the sound has finished playing
        onClickPlay.once('end', () => {
            navigate('/game');
        });        
    };

    return (
        <div className="h-screen absolute w-full bg-cover bg-center" style={{ backgroundImage: "url('/images/loadingpage.jpg')" }}>
            <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
                <div className='relative gap-10 flex flex-col items-center'>
                    <img src="/images/GoldenEmpiregame.png" alt="title" className="w-96 mx-auto" />
                <button
                    onClick={navigateToGame}
                    
                    className="px-8 mx-auto py-4 bg-yellow-500 text-white text-xl font-bold rounded hover:bg-yellow-600 transition duration-300"
                >
                    Start Game
                </button>
                </div>
                <div className="absolute bottom-0 w-full text-center text-white text-xl">
                    <p>© 2025. All Rights Reserved.</p>
                </div>            
            </div>
        </div>
    );
};

export default Landing;