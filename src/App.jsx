import React from "react";
import './index.css'
import GameGrid from "./components/GameGrid";

const App = () => {
  return (
    <>
    <div className="absolute inset-0 bg-cover bg-center max-h-screen"  style={{
        backgroundImage:"url('/images/bgimage.jpg')",
        overflow: "hidden",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
    </div>
    <div className="relative z-10 p-10">    
    <GameGrid />
    </div>
    </>
    
  );
};

export default App;
