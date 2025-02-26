import React from 'react';
import TopBanner from './TopBanner';
import GameGrid from './GameGrid';

const UIDesign = () => {

  
    return (
        <div className=" w-1/2 max-w-6xl mx-auto" >          
          <div className="mb-4 ">
            <GameGrid />
          </div>
        </div>
      );
};

export default UIDesign;