import React from 'react';
import TopBanner from './TopBanner';
import GameGrid from './GameGrid';
import ControlPanel from './ControlPanel';

const UIDesign = () => {
    return (
        <div className="relative w-full max-w-4xl mx-auto"  style={{ height: "100vh" }}>          
          <div className="relative">
            <TopBanner />
            <GameGrid />
            <ControlPanel />
          </div>
        </div>
      );
};

export default UIDesign;